import type { ProjectStatus } from "@/types";

const label: Record<ProjectStatus, string> = {
  live: "Live",
  development: "In development",
  archived: "Archived",
};

const tone: Record<ProjectStatus, string> = {
  live: "text-signal border-signal/35",
  development: "text-ember-soft border-ember/35",
  archived: "text-fg-faint border-line",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] leading-none ${tone[status]}`}>
      <span aria-hidden className={`size-1.5 rounded-full ${status === "live" ? "bg-signal" : status === "development" ? "bg-ember" : "bg-fg-faint"}`} />
      {label[status]}
    </span>
  );
}
