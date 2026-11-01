"use client";

import { stations } from "@/data/navigation";
import { useExperience } from "@/lib/experience-store";

/** Right-edge rail: one labelled stop per station, plus overall progress. */
export function ScrollProgress() {
  const index = useExperience((s) => s.sectionIndex);
  const progress = useExperience((s) => Math.round(s.progress * 1000) / 1000);

  return (
    <nav aria-label="Station progress" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div aria-hidden className="absolute right-[5px] top-0 h-full w-px bg-line">
        <div className="w-px bg-ember transition-[height] duration-200" style={{ height: `${progress * 100}%` }} />
      </div>
      <ol className="relative flex flex-col gap-6">
        {stations.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={i === index ? "location" : undefined}
              className="group flex items-center justify-end gap-3"
            >
              <span
                className={`font-mono text-[0.65rem] tracking-[0.14em] uppercase transition-opacity duration-300 ${
                  i === index ? "text-fg opacity-100" : "text-fg-faint opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {s.world}
              </span>
              <span
                className={`block size-[11px] rounded-full border transition-colors duration-300 ${
                  i === index ? "border-ember bg-ember" : i < index ? "border-ember/60 bg-void" : "border-line-strong bg-void"
                }`}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
