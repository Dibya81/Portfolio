import type { ArchitectureStep } from "@/types";

/** Data-driven architecture flow — rendered as an ordered list so it reads correctly for everyone. */
export function ArchitectureDiagram({ steps, accent, title }: { steps: ArchitectureStep[]; accent: string; title: string }) {
  return (
    <ol className="relative" aria-label={`${title} architecture flow`}>
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
          <div className="flex flex-col items-center">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-[0.68rem]"
              style={{ borderColor: `${accent}66`, color: accent }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < steps.length - 1 ? <span aria-hidden className="mt-1 w-px flex-1" style={{ background: `${accent}40` }} /> : null}
          </div>
          <div className="pt-1">
            <p className="text-[0.95rem] text-fg">{s.label}</p>
            <p className="text-sm text-fg-muted">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
