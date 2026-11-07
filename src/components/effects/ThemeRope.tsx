"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

/** The theme lives on <html data-theme>; read it as an external store. */
function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const MAX_PULL = 70; // px the handle can be dragged down
const TRIGGER = 26; // px past which a release switches the theme

/**
 * A pull-cord hanging from the top of the viewport. Drag it down (or click it,
 * or press Enter/Space) to switch dark ↔ light. The new theme wipes in as a
 * circle growing from the handle (View Transitions API; instant elsewhere).
 * Motion is a tiny damped spring in rAF, not React state.
 */
export function ThemeRope() {
  const rope = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "dark" as Theme);

  // Spring state lives in a ref: pull (px) and swing (deg), each with velocity.
  const sim = useRef({ pull: 0, vp: 0, swing: 0, vs: 0, dragging: false, raf: 0 });

  useEffect(() => {
    const s = sim.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const render = () => {
    const el = rope.current;
    if (!el) return;
    const s = sim.current;
    el.style.setProperty("--pull", `${s.pull.toFixed(2)}px`);
    el.style.transform = `rotate(${s.swing.toFixed(3)}deg)`;
  };

  const step = () => {
    const s = sim.current;
    // Springs: k = stiffness, c = damping (per frame at ~60fps).
    if (!s.dragging) {
      s.vp += -0.18 * s.pull - 0.16 * s.vp;
      s.pull += s.vp;
    }
    s.vs += -0.05 * s.swing - 0.06 * s.vs;
    s.swing += s.vs;
    render();
    const settled = !s.dragging && Math.abs(s.pull) < 0.05 && Math.abs(s.vp) < 0.05 && Math.abs(s.swing) < 0.02 && Math.abs(s.vs) < 0.02;
    if (settled) {
      s.pull = s.swing = s.vp = s.vs = 0;
      render();
      s.raf = 0;
      return;
    }
    s.raf = requestAnimationFrame(step);
  };

  const kick = () => {
    const s = sim.current;
    if (!s.raf) s.raf = requestAnimationFrame(step);
  };

  // Touch devices, first visit only: two gentle swings so people notice it can be pulled.
  useEffect(() => {
    const touch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = true;
    try {
      seen = localStorage.getItem("rope-hint") === "1";
      if (!seen) localStorage.setItem("rope-hint", "1");
    } catch {}
    if (!touch || seen || reduced) return;
    const id = window.setTimeout(() => {
      sim.current.vs += 4.5;
      sim.current.vp = 6;
      kick();
    }, 1800);
    return () => window.clearTimeout(id);
    // kick only touches refs; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.dataset.theme === "light" ? "dark" : "light";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const h = handle.current?.getBoundingClientRect();
    if (!doc.startViewTransition || reduced || !h) {
      apply();
      return;
    }
    const x = h.left + h.width / 2;
    const y = h.top + h.height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(apply).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };

  // Pointer drag: follow the finger downwards, release past TRIGGER to switch.
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = sim.current;
    const startY = e.clientY;
    let moved = 0;
    s.dragging = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    kick();

    const move = (ev: PointerEvent) => {
      const dy = Math.max(0, ev.clientY - startY);
      moved = Math.max(moved, dy);
      s.pull = MAX_PULL * Math.tanh(dy / MAX_PULL); // resists as it stretches
      kick();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      s.dragging = false;
      // A tap counts as a pull: give it a little tug so it still feels physical.
      if (moved < 4) s.vp = 9;
      if (moved < 4 || s.pull > TRIGGER) {
        s.vs += (Math.random() > 0.5 ? 1 : -1) * 3.5;
        toggle();
      }
      kick();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  return (
    <div ref={rope} className="rope no-print" onPointerEnter={() => ((sim.current.vs += 1.6), kick())}>
      <div className="rope-cord" aria-hidden />
      <button
        ref={handle}
        type="button"
        className="rope-handle"
        aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        onPointerDown={onPointerDown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            sim.current.vp = 9;
            kick();
            toggle();
          }
        }}
      />
    </div>
  );
}
