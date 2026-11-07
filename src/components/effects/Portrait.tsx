"use client";

import { useEffect, useRef } from "react";
import { drawFrame, ImageSequence, portraitSequence, sizeCanvas } from "@/lib/image-sequence";
import { getExperience, subscribe } from "@/lib/experience-store";

const FLOOD_AFTER_MS = 900; // keep hovering this long and the whole photo turns colour

/**
 * Hero portrait. Two effects:
 *  1. Scroll turns the head: the hero's pin progress picks a frame from the
 *     pre-rendered sequence (progressively loaded, drawn only on change).
 *  2. Black & white until you hover: a backdrop-filter layer greys everything
 *     behind it, and a radial mask cut at the cursor lets colour through. Hold
 *     the hover and the hole grows to flood the photo. Tap toggles on touch.
 * The 4:5 crop also trims the source video's corner watermark.
 */
export function Portrait() {
  const card = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = card.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!el || !canvas || !ctx) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    // Below lg the hero doesn't pin, so progress = how far you've scrolled past the photo.
    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    // No hover (phones, tablets): colour is driven by that same scroll progress instead.
    const touch = window.matchMedia("(hover: none)").matches;
    el.dataset.touch = String(touch);
    let bottomAbs = 1;
    let radius = 400;
    const sequence = new ImageSequence(mobile ? portraitSequence.mobile : portraitSequence.desktop);
    let w = 0;
    let h = 0;
    let frame = -1;
    let raf = 0;
    let drewOnce = false;

    const paint = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const img = sequence.nearest(frame);
        if (!img) return;
        drawFrame(ctx, img, w, h, "cover");
        if (!drewOnce && poster.current) {
          drewOnce = true;
          poster.current.style.visibility = "hidden";
        }
      });
    };
    const progress = () => {
      const s = getExperience();
      if (s.reducedMotion) return 0;
      if (!narrow) return s.pinProgress[0];
      const span = Math.max(1, bottomAbs - window.innerHeight * 0.25);
      return Math.min(Math.max(window.scrollY / span, 0), 1);
    };
    // Touch: B&W at the top, colour floods out from the centre as the head turns.
    const colourFromScroll = (p: number) => {
      if (!touch || el.dataset.color === "true") return;
      const t = Math.min(Math.max((p - 0.06) / 0.7, 0), 1);
      const eased = t * t * (3 - 2 * t);
      el.style.setProperty("--spot", `${Math.round(eased * radius)}px`);
    };
    const update = (force = false) => {
      const f = Math.min(Math.max(Math.round(progress() * (sequence.count - 1)), 0), sequence.count - 1);
      if (!force && f === frame) return;
      frame = f;
      paint();
    };
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      const r = el.getBoundingClientRect();
      bottomAbs = r.bottom + window.scrollY;
      radius = Math.hypot(w, h) * 0.72; // big enough to clear the whole card
      if (touch) {
        el.style.setProperty("--mx", `${w / 2}px`);
        el.style.setProperty("--my", `${h * 0.4}px`);
      }
      sizeCanvas(canvas, ctx, w, h);
      update(true);
    };

    sequence.onFrameLoaded = (i) => {
      if (i === frame || !drewOnce) paint();
    };
    let last = -1;
    const unsubscribe = subscribe(() => {
      const p = progress();
      if (p === last) return; // ignore pointer-only emissions
      last = p;
      update();
      colourFromScroll(p);
    });
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const recolour = () => colourFromScroll(progress());
    el.addEventListener("recolour", recolour);
    resize();
    colourFromScroll(progress());
    sequence.start(Math.round(progress() * (sequence.count - 1)));

    return () => {
      el.removeEventListener("recolour", recolour);
      unsubscribe();
      ro.disconnect();
      cancelAnimationFrame(raf);
      sequence.dispose();
    };
  }, []);

  // Colour reveal.
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    let timer = 0;
    const setPos = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setPos(e);
      el.dataset.hover = "true";
      window.clearTimeout(timer);
      timer = window.setTimeout(() => (el.dataset.color = "true"), FLOOD_AFTER_MS);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "mouse") setPos(e);
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(timer);
      el.dataset.hover = "false";
      el.dataset.color = "false";
    };
    const tap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const on = el.dataset.color !== "true";
      el.dataset.color = String(on);
      // Inline --spot (set by scroll) would override the stylesheet, so drive it here too.
      if (on) el.style.setProperty("--spot", "1600px");
      else el.style.removeProperty("--spot");
      el.dispatchEvent(new Event("recolour")); // hand colour back to scroll progress
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerup", tap);
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerup", tap);
    };
  }, []);

  return (
    <div
      ref={card}
      role="img"
      aria-label="Portrait of Dibya Bhusal. Hover to reveal colour."
      data-hover="false"
      data-color="false"
      className="portrait relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-line bg-[#0d0c0b] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)]"
    >
      <picture>
        <source media="(max-width: 768px)" srcSet={portraitSequence.mobile.url(0)} />
        <img
          ref={poster}
          src={portraitSequence.desktop.url(0)}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block" />
      <div className="portrait-bw" aria-hidden />
    </div>
  );
}
