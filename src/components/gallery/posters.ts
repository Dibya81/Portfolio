/**
 * Canvas-drawn textures for the gallery: one printed poster per project
 * (screenshot or generated line art + a museum label), the "More work" sign,
 * the intro text on the back wall, the floor and the soft character shadow.
 */
import * as THREE from "three";
import type { GalleryItem, Palette } from "./shared";

export const POSTER_W = 1024;
export const POSTER_H = 1356; // 0.755 aspect, matches the frame's print area
const PAPER = "#f6f3ec";
const INK = "#151413";

function cssFont(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
const fonts = () => ({
  display: cssFont("--font-display", "Georgia, serif"),
  sans: cssFont("--font-sans", "system-ui, sans-serif"),
  mono: cssFont("--font-mono", "ui-monospace, monospace"),
});

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function rng(seedText: string) {
  let s = 2166136261;
  for (let i = 0; i < seedText.length; i++) s = Math.imul(s ^ seedText.charCodeAt(i), 16777619);
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  let used = 0;
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else line = next;
    used++;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (used < words.length) {
    let last = lines[lines.length - 1];
    while (ctx.measureText(`${last}…`).width > maxW) last = last.slice(0, -1);
    lines[lines.length - 1] = `${last.trimEnd()}…`;
  }
  return lines;
}

/** Generated art for projects without a screenshot: a seeded flow field in ink plus one accent disc. */
function flowArt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: string, accent: string) {
  const r = rng(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = "#efebe2";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(x + w * (0.25 + r() * 0.5), y + h * (0.3 + r() * 0.4), Math.min(w, h) * (0.16 + r() * 0.1), 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const f1 = 1.5 + r() * 2.5;
  const f2 = 1.5 + r() * 2.5;
  const p1 = r() * 10;
  const p2 = r() * 10;
  const field = (u: number, v: number) => Math.sin(u * f1 + p1 + Math.cos(v * f2 + p2) * 1.7) * Math.PI + Math.cos(v * 1.3 + u * 0.7) * 0.8;
  ctx.strokeStyle = INK;
  ctx.lineCap = "round";
  for (let k = 0; k < 520; k++) {
    let px = x + r() * w;
    let py = y + r() * h;
    ctx.globalAlpha = 0.25 + r() * 0.55;
    ctx.lineWidth = 0.8 + r() * 1.6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    const steps = 18 + ((r() * 40) | 0);
    for (let s = 0; s < steps; s++) {
      const a = field((px - x) / w, (py - y) / h);
      px += Math.cos(a) * 6;
      py += Math.sin(a) * 6;
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const s = Math.max(w / img.width, h / img.height);
  const sw = w / s;
  const sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, 0, sw, sh, x, y, w, h); // top-aligned: UI headers stay visible
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d") as CanvasRenderingContext2D] as const;
}

export async function drawPoster(item: GalleryItem, index: number, total: number) {
  const F = fonts();
  const [c, ctx] = canvas(POSTER_W, POSTER_H);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  const M = 64;
  const IW = POSTER_W - M * 2;
  const IH = 600;
  const img = item.image ? await loadImage(item.image.src) : null;
  if (img) drawCover(ctx, img, M, M, IW, IH);
  else flowArt(ctx, M, M, IW, IH, item.slug, item.accent);
  ctx.strokeStyle = "rgba(21,20,19,0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(M, M, IW, IH);

  let y = M + IH + 70;
  ctx.fillStyle = "#b8400c";
  ctx.font = `500 24px ${F.mono}`;
  ctx.letterSpacing = "4px";
  ctx.fillText(item.category.toUpperCase(), M, y);
  ctx.fillStyle = "rgba(21,20,19,0.45)";
  const num = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  ctx.fillText(num, POSTER_W - M - ctx.measureText(num).width, y);
  ctx.letterSpacing = "0px";

  y += 108;
  ctx.fillStyle = INK;
  let size = 112;
  ctx.font = `400 ${size}px ${F.display}`;
  while (ctx.measureText(item.title).width > IW && size > 60) {
    size -= 4;
    ctx.font = `400 ${size}px ${F.display}`;
  }
  ctx.fillText(item.title, M - 4, y);

  y += 62;
  ctx.fillStyle = "rgba(21,20,19,0.72)";
  ctx.font = `400 31px ${F.sans}`;
  for (const line of wrap(ctx, item.tagline, IW, 3)) {
    ctx.fillText(line, M, y);
    y += 44;
  }

  // stack chips
  y += 22;
  ctx.font = `500 22px ${F.mono}`;
  let x = M;
  let rows = 1;
  for (const t of item.technologies.slice(0, 9)) {
    const w = ctx.measureText(t).width + 30;
    if (x + w > POSTER_W - M) {
      rows++;
      if (rows > 2) break;
      x = M;
      y += 54;
    }
    ctx.strokeStyle = "rgba(21,20,19,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y - 30, w, 42, 21);
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.fillText(t, x + 15, y - 2);
    x += w + 10;
  }

  const fy = POSTER_H - 70;
  ctx.fillStyle = "rgba(21,20,19,0.15)";
  ctx.fillRect(M, fy - 46, IW, 2);
  ctx.font = `500 22px ${F.mono}`;
  ctx.fillStyle = "rgba(21,20,19,0.6)";
  const status = item.status === "live" ? "LIVE" : item.status === "development" ? "IN DEVELOPMENT" : "ARCHIVED";
  ctx.fillText(`${item.year}  ·  ${status}`, M, fy);
  const hint = "SEE DETAILS ↵";
  ctx.fillText(hint, POSTER_W - M - ctx.measureText(hint).width, fy);
  return c;
}

export function drawMorePoster(count: number) {
  const F = fonts();
  const [c, ctx] = canvas(POSTER_W, POSTER_H);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  ctx.fillStyle = INK;
  ctx.font = `400 380px ${F.display}`;
  ctx.fillText(`+${count}`, 70, 560);
  ctx.fillStyle = "#b8400c";
  ctx.font = `500 26px ${F.mono}`;
  ctx.letterSpacing = "4px";
  ctx.fillText("THE REST OF THE SHELF", 76, 700);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = INK;
  ctx.font = `400 120px ${F.display}`;
  ctx.fillText("More work", 70, 830);
  ctx.fillStyle = "rgba(21,20,19,0.72)";
  ctx.font = `400 32px ${F.sans}`;
  let y = 910;
  for (const line of wrap(ctx, "Document platforms, healthcare agents, a 3D cloud UI, blockchain tools and a chat app over raw Java sockets.", 880, 4)) {
    ctx.fillText(line, 76, y);
    y += 46;
  }
  ctx.font = `500 22px ${F.mono}`;
  ctx.fillStyle = "rgba(21,20,19,0.6)";
  ctx.fillText("SEE DETAILS ↵", 76, POSTER_H - 70);
  return c;
}

export function drawIntroWall(p: Palette, count: number) {
  const F = fonts();
  const [c, ctx] = canvas(2048, 1024);
  ctx.fillStyle = p.text;
  ctx.font = `500 34px ${F.mono}`;
  ctx.letterSpacing = "10px";
  ctx.fillText("DIBYA BHUSAL  ·  SELECTED WORK", 120, 200);
  ctx.letterSpacing = "0px";
  ctx.font = `400 300px ${F.display}`;
  ctx.fillText("Projects", 104, 480);
  ctx.font = `400 46px ${F.sans}`;
  ctx.globalAlpha = 0.75;
  let y = 600;
  const blurb = `${count} builds hung in one room: industrial AI, public-health ML, Web3 agents, security, IoT and computer vision. Walk up to a frame and stand on its circle to look closer.`;
  for (const line of wrap(ctx, blurb, 1500, 4)) {
    ctx.fillText(line, 120, y);
    y += 66;
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ff6a2b";
  ctx.fillRect(120, 880, 160, 6);
  return c;
}

export function drawFloor(p: Palette) {
  const [c, ctx] = canvas(1024, 1024);
  ctx.fillStyle = p.floor;
  ctx.fillRect(0, 0, 1024, 1024);
  const r = rng("floor");
  for (let k = 0; k < 46; k++) {
    ctx.strokeStyle = p.light ? `rgba(120,112,100,${0.03 + r() * 0.06})` : `rgba(255,245,230,${0.015 + r() * 0.03})`;
    ctx.lineWidth = 0.6 + r() * 2.4;
    ctx.beginPath();
    let x = r() * 1024;
    let y = r() * 1024;
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) {
      const nx = x + (r() - 0.3) * 420;
      const ny = y + (r() - 0.5) * 180;
      ctx.quadraticCurveTo(x + (r() - 0.5) * 200, y + (r() - 0.5) * 200, nx, ny);
      x = nx;
      y = ny;
    }
    ctx.stroke();
  }
  ctx.strokeStyle = p.light ? "rgba(90,84,76,0.12)" : "rgba(0,0,0,0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 1022, 1022);
  return c;
}

export function drawShadow() {
  const [c, ctx] = canvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.5)");
  g.addColorStop(0.5, "rgba(0,0,0,0.22)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return c;
}

/** A right-foot sole print (toe at the top): white on transparent, tinted per instance. */
export function drawFootprint() {
  const [c, ctx] = canvas(96, 192);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 5;
  // ball of the foot, a little wider on the big-toe (inner, left) side
  ctx.beginPath();
  ctx.ellipse(46, 62, 30, 44, -0.12, 0, Math.PI * 2);
  ctx.fill();
  // heel
  ctx.beginPath();
  ctx.ellipse(50, 150, 23, 29, 0.05, 0, Math.PI * 2);
  ctx.fill();
  // toe pads
  const toes: [number, number, number][] = [
    [30, 14, 9],
    [47, 10, 7.5],
    [61, 14, 6.5],
    [72, 21, 5.5],
  ];
  for (const [x, y, r] of toes) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

export function toTexture(c: HTMLCanvasElement, repeat?: [number, number]) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  return t;
}
