import type { ReactNode } from "react";

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.68rem] leading-none tracking-wide " +
        (tone === "accent" ? "border-ember/40 text-ember-soft" : "border-line text-fg-muted")
      }
    >
      {children}
    </span>
  );
}
