"use client";

import { useEffect, useState } from "react";

/** Cycles roles through a pill: the current word slides up and out, the next slides in. */
export function RoleRotator({ words, interval = 2200 }: { words: readonly string[]; interval?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="inline-flex items-center rounded-full border border-line-strong bg-ink px-5 py-2 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.45)]">
      {/* Screen readers get one stable phrase instead of a ticking one. */}
      <span className="sr-only">{words.join(", ")}</span>
      <span className="rotator font-display text-[1.6em] leading-[1.15] text-ember-soft" aria-hidden>
        {words.map((w, k) => (
          <span key={w} data-state={k === i ? "current" : k === (i - 1 + words.length) % words.length ? "prev" : "next"}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
