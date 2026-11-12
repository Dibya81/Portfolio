"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { clearInput, input, keyAction } from "./shared";

/** WASD / arrow keys -> shared input, only while `active` is true. */
export function useMovementKeys(active: RefObject<boolean>) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!active.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const a = keyAction(e.code);
      if (!a) return;
      e.preventDefault(); // arrows must not scroll the page
      input.keys.add(a);
    };
    const up = (e: KeyboardEvent) => {
      const a = keyAction(e.code);
      if (a) input.keys.delete(a);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clearInput);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clearInput);
      clearInput();
    };
  }, [active]);
}

export function useMedia(query: string, ssr = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => ssr,
  );
}

/** Touch joystick: drag the knob; writes a -1..1 vector into the shared input. */
export function Joystick({ className = "", onActive }: { className?: string; onActive?: (on: boolean) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const id = useRef<number | null>(null);

  const move = (e: React.PointerEvent) => {
    const b = base.current?.getBoundingClientRect();
    if (!b || !knob.current) return;
    const R = b.width / 2 - 18;
    let dx = e.clientX - (b.left + b.width / 2);
    let dy = e.clientY - (b.top + b.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    knob.current.style.transform = `translate(${dx}px, ${dy}px)`;
    const nx = dx / R;
    const ny = dy / R;
    const mag = Math.hypot(nx, ny);
    input.joy.x = mag < 0.12 ? 0 : nx;
    input.joy.y = mag < 0.12 ? 0 : ny;
  };
  const end = () => {
    id.current = null;
    input.joy.x = 0;
    input.joy.y = 0;
    if (knob.current) knob.current.style.transform = "";
    onActive?.(false);
  };

  return (
    <div
      ref={base}
      role="application"
      aria-label="Joystick: drag to walk"
      className={`touch-none select-none rounded-full border border-line-strong bg-void/40 backdrop-blur-md ${className}`}
      onPointerDown={(e) => {
        id.current = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
        onActive?.(true);
        move(e);
      }}
      onPointerMove={(e) => {
        if (id.current === e.pointerId) move(e);
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div
        ref={knob}
        className="pointer-events-none absolute left-1/2 top-1/2 -ml-6 -mt-6 size-12 rounded-full bg-fg/85 shadow-lg transition-transform duration-75"
      />
    </div>
  );
}

export function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-grid min-w-8 place-items-center rounded-md border border-line-strong px-1.5 py-1 font-mono text-[0.7rem] leading-none text-fg">
      {children}
    </kbd>
  );
}
