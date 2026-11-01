import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: number;
  world: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "right";
}

export function SectionHeading({ index, world, title, lead, id, align = "left" }: SectionHeadingProps) {
  return (
    <header className={align === "right" ? "md:ml-auto md:text-right" : ""}>
      <p className="meta flex items-center gap-3 md:[&]:justify-start">
        <span className="text-ember">{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        <span>{world}</span>
      </p>
      <h2
        id={id}
        className="mt-5 max-w-[18ch] font-display text-[clamp(2.4rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.01em] text-fg text-balance-safe"
      >
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-[56ch] text-fg-muted">{lead}</p> : null}
    </header>
  );
}
