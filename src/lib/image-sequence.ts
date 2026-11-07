/**
 * Framework-free image sequence loader + drawer — the engine of the preserved
 * scroll effect (originally js/main.js). Behaviour kept from the original:
 *   - scroll progress maps linearly to a frame index
 *   - DPR-aware canvas, capped at 2
 *   - contain fit, centred, clear before draw
 *   - redraw only when the frame index changes (caller's job)
 * Improvement: progressive loading — keyframes first, then nearest-first —
 * and drawing the nearest *loaded* frame until the exact one arrives, so no
 * content is blocked behind a full preload.
 */

export interface SequenceSource {
  count: number;
  url: (index: number) => string;
}

export class ImageSequence {
  readonly count: number;
  private readonly url: (i: number) => string;
  private readonly images: (HTMLImageElement | null)[];
  private queue: number[] = [];
  private inFlight = 0;
  private disposed = false;
  loaded = 0;
  onProgress?: (loaded: number, total: number) => void;
  onFrameLoaded?: (index: number) => void;

  /** Only every `stride`-th frame is fetched (2 on slow / Save-Data connections); `nearest` fills the gaps. */
  readonly stride: number;
  /** Frames that will actually be fetched. */
  readonly total: number;

  constructor(source: SequenceSource, private readonly concurrency = 6) {
    this.count = source.count;
    this.stride = slowConnection() ? 2 : 1;
    this.total = Math.ceil(source.count / this.stride);
    this.url = source.url;
    this.images = Array.from({ length: source.count }, () => null);
  }

  /** Load keyframes first, then everything else ordered by distance from `around`. */
  start(around = 0) {
    around -= around % this.stride;
    const keyStep = Math.max(this.stride, Math.floor(this.count / 16 / this.stride) * this.stride);
    const keyframes: number[] = [];
    for (let i = 0; i < this.count; i += keyStep) keyframes.push(i);
    const rest = Array.from({ length: this.count }, (_, i) => i)
      .filter((i) => i % this.stride === 0 && i % keyStep !== 0)
      .sort((a, b) => Math.abs(a - around) - Math.abs(b - around));
    this.queue = [around, ...keyframes.filter((k) => k !== around), ...rest.filter((r) => r !== around)];
    for (let i = 0; i < this.concurrency; i++) this.pump();
  }

  private pump(): void {
    if (this.disposed) return;
    const next = this.queue.shift();
    if (next === undefined) return;
    if (this.images[next]) {
      this.pump();
      return;
    }
    this.inFlight++;
    const img = new Image();
    img.decoding = "async";
    const done = (ok: boolean) => {
      this.inFlight--;
      if (this.disposed) return;
      if (ok) {
        this.images[next] = img;
        this.loaded++;
        this.onFrameLoaded?.(next);
      }
      this.onProgress?.(this.loaded, this.total);
      this.pump();
    };
    img.src = this.url(next);
    // Decode off the main thread before the frame is ever drawn, so scrolling
    // never pays for a synchronous decode inside drawImage.
    img.decode().then(
      () => done(true),
      () => done(false),
    );
  }

  /** The exact frame if loaded, otherwise the closest loaded one. */
  nearest(index: number): HTMLImageElement | null {
    const i = Math.min(Math.max(index, 0), this.count - 1);
    if (this.images[i]) return this.images[i];
    for (let d = 1; d < this.count; d++) {
      const a = this.images[i - d];
      if (a) return a;
      const b = this.images[i + d];
      if (b) return b;
    }
    return null;
  }

  dispose() {
    this.disposed = true;
    this.queue = [];
    this.images.fill(null);
  }
}

/** Save-Data, or a 2G/3G effective connection (Network Information API, where supported). */
function slowConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (!c) return false;
  return Boolean(c.saveData) || ["slow-2g", "2g", "3g"].includes(c.effectiveType ?? "");
}

export type FitMode = "contain" | "cover";

/** Draw in CSS pixels (ctx already scaled by DPR). */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cssWidth: number,
  cssHeight: number,
  fit: FitMode,
) {
  if (!img.complete || !img.naturalWidth) return;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = fit === "contain" ? Math.min(cssWidth / iw, cssHeight / ih) : Math.max(cssWidth / iw, cssHeight / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.clearRect(0, 0, cssWidth, cssHeight);
  ctx.drawImage(img, (cssWidth - dw) / 2, (cssHeight - dh) / 2, dw, dh);
}

export function sizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

export const portraitSequence = {
  desktop: { count: 120, url: (i: number) => `/sequence/desktop/f${String(i).padStart(3, "0")}.webp` },
  mobile: { count: 60, url: (i: number) => `/sequence/mobile/f${String(i).padStart(3, "0")}.webp` },
} satisfies Record<string, SequenceSource>;
