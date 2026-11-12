/**
 * Ink-spill theme switch.
 *
 * The View Transitions API gives two snapshots of the page: the old theme and
 * the new one. Both are masked by one per-frame image built from an "ink"
 * field that spreads from the rope handle:
 *   - inside the ink the new theme shows,
 *   - a thin band just ahead of the front shows neither, revealing the
 *     ::view-transition backdrop (a hot ember gradient), so the spill has a
 *     burning edge,
 *   - everything else is still the old theme.
 * Extra bursts erupt elsewhere on the page and merge into the main spill, and
 * the page takes a small "thump" when the ink lands.
 *
 * Cost: the noisy field is computed once on a coarse grid (idle time, ahead of
 * the click), then bilinearly upsampled to ~1.25 CSS px cells so edges are
 * smooth. Each frame just thresholds it and encodes a PNG (~1ms).
 *
 * Mask encoding (one image for both snapshots):
 *   new snapshot  - mask-mode: luminance  -> luminance * alpha = "inside ink"
 *   old snapshot  - mask-mode: alpha      -> alpha = 0 only in the ember band
 */

type VTDoc = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

const DURATION = 1500; // ms
const FINE = 1.25; // CSS px per mask cell

// ---------- noise ----------
function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; // 0..1
}
function fbm(x: number, y: number, seed: number, octaves: number) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(x, y, seed + o * 17);
    norm += amp;
    x *= 2.03;
    y *= 2.03;
    amp *= 0.5;
  }
  return sum / norm; // 0..1
}

// ---------- the ink field ----------
interface Field {
  W: number;
  H: number;
  ox: number;
  oy: number;
  w: number; // fine grid size
  h: number;
  data: Float32Array;
  min: number;
  max: number;
}

interface Source {
  x: number;
  y: number;
  delay: number; // field offset: when (in field units) this source starts
  reach: number; // distance (px) that maps to 1 field unit
}

function buildField(W: number, H: number, ox: number, oy: number): Field {
  const cell = Math.max(2.5, W / 440);
  const cw = Math.ceil(W / cell) + 1;
  const ch = Math.ceil(H / cell) + 1;
  const coarse = new Float32Array(cw * ch);
  const S = Math.max(W, H);
  const seed = (Math.random() * 1e6) | 0;
  const maxD = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy));

  // The main spill from the handle, plus bursts that erupt mid-way.
  const sources: Source[] = [{ x: ox, y: oy, delay: 0, reach: maxD }];
  const bursts = 2 + ((Math.random() * 2) | 0);
  for (let k = 0; k < bursts; k++) {
    sources.push({
      x: W * (0.12 + Math.random() * 0.76),
      y: H * (0.3 + Math.random() * 0.6),
      delay: 0.16 + k * 0.1 + Math.random() * 0.06,
      reach: maxD * (0.55 + Math.random() * 0.3),
    });
  }

  // Splatter drops, flung ahead of the front.
  const drops: { x: number; y: number; r: number; d: number }[] = [];
  for (let k = 0; k < 110; k++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = (0.08 + Math.random() * 0.92) * maxD;
    const x = ox + Math.cos(ang) * dist;
    const y = oy + Math.sin(ang) * dist;
    if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
    drops.push({ x, y, r: (3 + Math.random() ** 2.5 * 24) * (S / 1440 + 0.35), d: dist / maxD });
  }

  for (let j = 0; j < ch; j++) {
    const py = j * cell;
    for (let i = 0; i < cw; i++) {
      const px = i * cell;
      const nx = px / S;
      const ny = py / S;

      // Domain-warped noise for the blotchy, fluid edge (and stray islands).
      const wx = fbm(nx * 2.2, ny * 2.2, seed, 3) - 0.5;
      const wy = fbm(nx * 2.2 + 7.3, ny * 2.2 + 1.9, seed, 3) - 0.5;
      const n = fbm(nx * 6 + wx * 3, ny * 6 + wy * 3, seed + 101, 6) - 0.5;

      let f = Infinity;
      for (let s = 0; s < sources.length; s++) {
        const src = sources[s];
        const dx = px - src.x;
        const dy = py - src.y;
        const d = Math.hypot(dx, dy) / src.reach;
        // Polar noise: broad lobes plus fine radial streaks (ink fingers).
        const ang = Math.atan2(dy, dx);
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        const lobe = fbm(ca * 2.5 + 11 + s * 9, sa * 2.5 + 5, seed + 211, 3);
        const streak = fbm(ca * 14 + d * 2.2 + wx, sa * 14 + d * 2.2 + wy + s * 13, seed + 307, 4);
        const finger = Math.max(0, streak - 0.5) ** 1.5 * 2.6;
        const rough = Math.min(1, d * 2.5 + 0.2);
        const v = src.delay + d * (1 - 0.5 * Math.max(0, lobe - 0.4)) + n * 0.42 * rough - finger * 0.3 * rough;
        if (v < f) f = v;
      }

      for (const dr of drops) {
        const q = Math.hypot(px - dr.x, py - dr.y);
        // Lands well before the front reaches it, then gets swallowed.
        if (q < dr.r) f = Math.min(f, dr.d - 0.16 + (q / dr.r) * 0.05);
      }
      coarse[j * cw + i] = f;
    }
  }

  // Bilinear upsample to the fine grid so thresholded edges are smooth.
  const w = Math.ceil(W / FINE);
  const h = Math.ceil(H / FINE);
  const data = new Float32Array(w * h);
  let min = Infinity;
  let max = -Infinity;
  const r = FINE / cell;
  for (let j = 0; j < h; j++) {
    const gy = (j + 0.5) * r;
    const y0 = Math.min(Math.floor(gy), ch - 2);
    const ty = gy - y0;
    for (let i = 0; i < w; i++) {
      const gx = (i + 0.5) * r;
      const x0 = Math.min(Math.floor(gx), cw - 2);
      const tx = gx - x0;
      const a = coarse[y0 * cw + x0];
      const b = coarse[y0 * cw + x0 + 1];
      const c = coarse[(y0 + 1) * cw + x0];
      const d = coarse[(y0 + 1) * cw + x0 + 1];
      const v = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
      data[j * w + i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  return { W, H, ox, oy, w, h, data, min, max };
}

// Quick splash, then a steady spread that slows as it reaches the far corner.
const ease = (t: number) => 0.55 * t + 0.45 * (1 - (1 - t) ** 2.4);

// ---------- precompute ahead of the click ----------
let cached: Field | null = null;
let pending = 0;

type IdleWin = Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };

/** Build the next ink field in idle time so the switch starts instantly. */
export function prepareInk(x: number, y: number) {
  if (typeof window === "undefined") return;
  const w = window as IdleWin;
  window.clearTimeout(pending);
  pending = window.setTimeout(() => {
    const run = () => {
      cached = buildField(window.innerWidth, window.innerHeight, x, y);
    };
    if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 2000 });
    else run();
  }, 300);
}

function takeField(x: number, y: number) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const c = cached;
  cached = null;
  if (c && c.W === W && c.H === H && Math.abs(c.ox - x) < 8 && Math.abs(c.oy - y) < 8) return c;
  return buildField(W, H, x, y);
}

/**
 * Switch the theme with an ink spill from (x, y). Falls back to an instant
 * switch when View Transitions or motion are unavailable.
 */
export function inkTransition(apply: () => void, x: number, y: number) {
  const doc = document as VTDoc;
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduced) {
    apply();
    return;
  }

  const field = takeField(x, y);
  const canvas = document.createElement("canvas");
  canvas.width = field.w;
  canvas.height = field.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    apply();
    return;
  }
  const img = ctx.createImageData(field.w, field.h);
  const px = img.data;
  const range = field.max - field.min;
  // Edge softness: about one fine cell, in field units.
  const soft = range / Math.max(field.w, field.h) * 1.1;
  const rimMax = range * 0.022; // ember band width

  const draw = (p: number) => {
    const rim = rimMax * (0.5 + 0.5 * Math.sin(Math.min(p * 1.2, 1) * Math.PI)) * (p < 1 ? 1 : 0);
    const R = field.min - soft - rim + (range + soft * 3 + rim * 2) * ease(p);
    const { data } = field;
    for (let i = 0, k = 0; i < data.length; i++, k += 4) {
      const v = data[i];
      let aNew = (R - v) / soft + 0.5;
      aNew = aNew <= 0 ? 0 : aNew >= 1 ? 1 : aNew;
      let aOld = (v - R - rim) / soft + 0.5;
      aOld = aOld <= 0 ? 0 : aOld >= 1 ? 1 : aOld;
      const a = aNew > aOld ? aNew : aOld;
      const lum = a > 0 ? (aNew / a) * 255 : 0;
      px[k] = px[k + 1] = px[k + 2] = lum;
      px[k + 3] = a * 255;
    }
    ctx.putImageData(img, 0, 0);
    root.style.setProperty("--ink", `url(${canvas.toDataURL()})`);
  };

  draw(0); // new theme hidden until the spill starts
  root.style.setProperty("--ink-x", `${x}px`);
  root.style.setProperty("--ink-y", `${y}px`);
  root.classList.add("ink-switch");
  const vt = doc.startViewTransition(apply);
  vt.ready
    .then(() => {
      // Keeps the transition alive for the full spill; the mask does the work.
      root.animate({ opacity: [1, 1] }, { duration: DURATION, pseudoElement: "::view-transition-new(root)" });
      // The thump as the ink lands.
      root.animate(
        { transform: ["scale(1)", "scale(1.022) rotate(-0.25deg)", "scale(0.996)", "scale(1)"] },
        { duration: 620, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-image-pair(root)" },
      );
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / DURATION, 1);
        draw(p);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    })
    .catch(() => {});
  vt.finished.finally(() => {
    root.classList.remove("ink-switch");
    root.style.removeProperty("--ink");
    prepareInk(x, y); // fresh shape for next time
  });
}
