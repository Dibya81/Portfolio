"use client";

import { useExperience } from "@/lib/experience-store";

/** Small hint when the pointer is over an interactive object in the 3D world. */
export function WorldHint() {
  const hint = useExperience((s) => s.hint);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
      {hint ? (
        <span className="rounded-full border border-line-strong bg-void/90 px-4 py-2 font-mono text-[0.7rem] tracking-wide text-fg">
          {hint} <span className="text-ember">· click</span>
        </span>
      ) : null}
    </div>
  );
}
