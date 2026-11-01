"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import type { Project, ProjectArea } from "@/types";

const areas: ("All" | ProjectArea)[] = ["All", "AI", "Security", "Web3", "IoT", "Data", "Full-stack"];

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [area, setArea] = useState<(typeof areas)[number]>("All");
  const shown = useMemo(() => (area === "All" ? projects : projects.filter((p) => p.area.includes(area))), [area, projects]);

  return (
    <div>
      <div role="group" aria-label="Filter projects by area" className="flex flex-wrap gap-2">
        {areas.map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={area === a}
            onClick={() => setArea(a)}
            className={`min-h-11 rounded-full border px-4 font-mono text-xs tracking-wide transition-colors ${
              area === a ? "border-ember bg-ember text-void" : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      <p className="meta mt-6" aria-live="polite">
        {shown.length} project{shown.length === 1 ? "" : "s"}
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
