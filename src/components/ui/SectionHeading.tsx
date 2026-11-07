import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** @deprecated kept so callers compile; numbering was removed. */
  index?: number;
  world: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "right";
}

export function SectionHeading({ world, title, lead, id, align = "left" }: SectionHeadingProps) {
  return (
    <header data-reveal="type" className={align === "right" ? "md:ml-auto md:text-right" : ""}>
      <p className="meta flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-ember" />
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
