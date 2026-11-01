"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useExperience } from "@/lib/experience-store";
import { registerRevealSlot, requestRevealFrame, type RevealSlotState } from "@/lib/reveal-registry";
import type { RevealPair } from "@/types";

/**
 * DOM anchor for the product ↔ architecture reveal.
 * - WebGL available: the slot is a transparent window; the shared canvas
 *   draws the ported shader quad exactly behind it.
 * - Otherwise: CSS clip-path fallback (from the prototype's About section).
 * - Either way a button toggles the reveal, so it never depends on hover.
 */
export function RevealSlot({ pair, title }: { pair: RevealPair; title: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const slotRef = useRef<RevealSlotState | null>(null);
  const webgl = useExperience((s) => s.webgl);
  const [active, setActive] = useState(false);
  const [cssPos, setCssPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = ref.current;
    if (!webgl || !el) return;
    const slot: RevealSlotState = {
      id,
      el,
      product: pair.product,
      architecture: pair.architecture,
      target: { x: 0.5, y: 0.5 },
      hoverTarget: 0,
    };
    slotRef.current = slot;
    const unregister = registerRevealSlot(slot);
    return () => {
      unregister();
      slotRef.current = null;
    };
  }, [webgl, id, pair.product, pair.architecture]);

  // Keep the shader hover target in sync with React state.
  useEffect(() => {
    if (slotRef.current) {
      slotRef.current.hoverTarget = active ? 1 : 0;
      requestRevealFrame();
    }
  }, [active]);

  // Tap outside closes the reveal (fixes the original "never closes on touch").
  useEffect(() => {
    if (!active) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.parentElement?.contains(e.target as Node)) setActive(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [active]);

  const setPoint = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (clientX - r.left) / r.width;
    const y = (clientY - r.top) / r.height;
    if (slotRef.current) {
      slotRef.current.target.x = x;
      slotRef.current.target.y = 1 - y; // shader UV space: y up
      requestRevealFrame();
    }
    setCssPos({ x: x * 100, y: y * 100 });
  };

  const centre = () => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPoint(r.left + r.width / 2, r.top + r.height / 2);
  };

  const mode = webgl ? "webgl" : "css";

  return (
    <figure className="m-0">
      <div
        ref={ref}
        className="reveal-slot"
        data-mode={mode}
        data-active={active}
        role="img"
        aria-label={`${pair.productAlt}. Revealing shows: ${pair.architectureAlt}.`}
        style={{ "--rx": `${cssPos.x}%`, "--ry": `${cssPos.y}%` } as CSSProperties}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          setPoint(e.clientX, e.clientY);
          setActive(true);
        }}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") setPoint(e.clientX, e.clientY);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setActive(false);
        }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") return;
          setPoint(e.clientX, e.clientY);
          setActive(true);
        }}
      >
        {mode === "css" ? (
          <>
            <Image src={pair.product} alt="" fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
            <div className="reveal-fallback-mask absolute inset-0">
              <Image src={pair.architecture} alt="" fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
            </div>
          </>
        ) : null}
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4">
        <span className="meta">Product ↔ architecture</span>
        <button
          type="button"
          aria-pressed={active}
          onClick={() => {
            if (!active) centre();
            setActive((v) => !v);
          }}
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4 font-mono text-[0.7rem] tracking-wide text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          {active ? "Hide architecture" : `Reveal ${title} architecture`}
        </button>
      </figcaption>
    </figure>
  );
}
