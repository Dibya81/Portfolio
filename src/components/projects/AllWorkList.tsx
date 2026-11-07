"use client";

import { useMemo, useState } from "react";
import type { WorkCategory, WorkItem } from "@/data/allWork";

const categories: ("All" | WorkCategory)[] = ["All", "AI", "Full-stack", "IoT", "Security", "Web3", "Web"];
const sources = ["Everywhere", "On GitHub", "Local only"] as const;

/** Compact, image-free list of every other project: renders instantly, even on phones. */
export function AllWorkList({ items }: { items: WorkItem[] }) {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [source, setSource] = useState<(typeof sources)[number]>("Everywhere");

  const shown = useMemo(
    () =>
      items.filter(
        (w) =>
          (category === "All" || w.category === category) &&
          (source === "Everywhere" || (source === "On GitHub" ? Boolean(w.repo) : w.local)),
      ),
    [items, category, source],
  );

  const chip = (active: boolean) =>
    `min-h-11 shrink-0 rounded-full border px-4 font-mono text-xs tracking-wide transition-colors ${
      active ? "border-ember bg-ember text-on-accent" : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
    }`;

  return (
    <div>
      <div role="group" aria-label="Filter by area" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((c) => (
          <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={chip(category === c)}>
            {c}
          </button>
        ))}
      </div>
      <div role="group" aria-label="Filter by where the code lives" className="-mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {sources.map((s) => (
          <button key={s} type="button" aria-pressed={source === s} onClick={() => setSource(s)} className={chip(source === s)}>
            {s}
          </button>
        ))}
      </div>

      <p className="meta mt-6" aria-live="polite">
        {shown.length} project{shown.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((w) => (
          <li key={w.name} className="work-item panel flex flex-col p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.68rem] text-ember-soft">
                {w.category} · {w.year}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-mono text-[0.62rem] ${
                  w.repo ? "border-ember/40 text-ember-soft" : "border-line text-fg-faint"
                }`}
              >
                {w.repo ? "GitHub" : "Local"}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl leading-tight">{w.name}</h3>
            <p className="mt-2 flex-1 text-sm text-fg-muted">{w.description}</p>
            <p className="mt-4 font-mono text-[0.68rem] text-fg-faint">{w.tech.join(" · ")}</p>
            {w.repo || w.live ? (
              <p className="mt-4 flex gap-4 text-sm">
                {w.live ? (
                  <a href={w.live} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-ember-soft hover:text-fg">
                    Live ↗
                  </a>
                ) : null}
                {w.repo ? (
                  <a href={w.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-ember-soft hover:text-fg">
                    Code ↗
                  </a>
                ) : null}
              </p>
            ) : (
              <p className="mt-4 text-xs text-fg-faint">Not published yet</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
