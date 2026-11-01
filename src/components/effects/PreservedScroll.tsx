"use client";

import { useEffect, useRef } from "react";
import { drawFrame, ImageSequence, portraitSequence, sizeCanvas, type FitMode } from "@/lib/image-sequence";
import { getExperience, subscribe } from "@/lib/experience-store";

/**
 * PRESERVED EFFECT #1 — the original scroll-driven portrait sequence.
 *
 * Kept from js/main.js: linear progress → frame index across a pinned sticky
 * section, DPR-capped canvas, contain fit, rAF-coalesced draws only when the
 * frame changes, and the overlay text blocks that fade/parallax by range.
 * Now driven by the shared experience store (single scroll source) and
 * progressively loaded instead of blocking on a 64 MB preload.
 * New: at the end of the sequence the panel recedes to reveal the universe.
 */
export function PreservedScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const panel = canvas?.closest<HTMLElement>(".gateway-sticky");
    if (!canvas || !ctx || !panel) return;

    const blocks = Array.from(panel.querySelectorAll<HTMLElement>("[data-hero-range]")).map((el) => {
      const [start, end] = (el.dataset.heroRange ?? "0,1").split(",").map(Number);
      return { el, start, end };
    });

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const sequence = new ImageSequence(mobile ? portraitSequence.mobile : portraitSequence.desktop);
    let width = 0;
    let height = 0;
    let fit: FitMode = "contain";
    let currentFrame = -1;
    let raf = 0;
    let drewOnce = false;

    const progress = () => {
      const s = getExperience();
      return s.reducedMotion ? 0 : s.pinProgress[0];
    };

    const paint = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const img = sequence.nearest(currentFrame);
        if (!img) return;
        drawFrame(ctx, img, width, height, fit);
        if (!drewOnce && posterRef.current) {
          drewOnce = true;
          posterRef.current.style.visibility = "hidden";
        }
      });
    };

    const updateFrame = (force = false) => {
      const p = progress();
      const frame = Math.min(Math.max(Math.round(p * (sequence.count - 1)), 0), sequence.count - 1);
      if (!force && frame === currentFrame) return;
      currentFrame = frame;
      paint();
    };

    // Original overlay behaviour: visible within range ±0.07, small parallax around the midpoint.
    const updateOverlay = () => {
      const s = getExperience();
      if (s.reducedMotion) {
        blocks.forEach(({ el }) => {
          el.dataset.visible = "true";
          el.style.transform = "";
        });
        panel.style.transform = "";
        panel.style.opacity = "";
        panel.style.borderRadius = "";
        return;
      }
      const p = s.pinProgress[0];
      blocks.forEach(({ el, start, end }) => {
        const visible = p >= Math.max(0, start - 0.07) && p <= Math.min(1, end + 0.07);
        el.dataset.visible = visible ? "true" : "false";
        const mid = (start + end) / 2;
        el.style.transform = visible ? `translateY(${((p - mid) / ((end - start) * 1.5)) * -26}px)` : "translateY(24px)";
      });
      // Fly-out: the portrait frame recedes and fades, revealing the universe behind it.
      const t = Math.min(Math.max((p - 0.85) / 0.15, 0), 1);
      panel.style.transform = t > 0 ? `scale(${1 - 0.14 * t})` : "";
      panel.style.borderRadius = t > 0 ? `${Math.round(28 * t)}px` : "";
      panel.style.opacity = t > 0 ? String(1 - t) : "";
    };

    const resize = () => {
      width = panel.clientWidth;
      height = panel.clientHeight;
      sizeCanvas(canvas, ctx, width, height);
      fit = mobile && height > width ? "cover" : "contain";
      updateFrame(true);
    };

    sequence.onFrameLoaded = (i) => {
      if (i === currentFrame || !drewOnce) paint();
    };
    sequence.onProgress = (loaded, total) => {
      if (!counterRef.current) return;
      counterRef.current.textContent = loaded >= total ? "" : `frames ${loaded}/${total}`;
    };

    const unsubscribe = subscribe(() => {
      updateFrame();
      updateOverlay();
    });
    const ro = new ResizeObserver(resize);
    ro.observe(panel);

    resize();
    updateOverlay();
    sequence.start(Math.round(progress() * (sequence.count - 1)));

    return () => {
      unsubscribe();
      ro.disconnect();
      cancelAnimationFrame(raf);
      sequence.dispose();
      panel.style.transform = "";
      panel.style.opacity = "";
      panel.style.borderRadius = "";
    };
  }, []);

  return (
    <>
      {/* Poster: frame 0, visible before the canvas paints and without JS. */}
      <picture>
        <source media="(max-width: 768px)" srcSet={portraitSequence.mobile.url(0)} />
        <img
          ref={posterRef}
          src={portraitSequence.desktop.url(0)}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain max-md:object-cover"
        />
      </picture>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block" />
      <span
        ref={counterRef}
        aria-hidden
        className="absolute bottom-5 left-[clamp(1rem,4vw,3rem)] z-20 font-mono text-[0.65rem] tracking-[0.14em] text-fg-faint"
      />
    </>
  );
}
