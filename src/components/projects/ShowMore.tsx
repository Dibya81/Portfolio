"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowRight } from "@/components/ui/Icons";

/** Collapsed-by-default reveal: the button sits last, the content renders server-side but stays hidden until opened. */
export function ShowMore({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} hidden={!open}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="mt-12 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-sm tracking-wide text-fg transition-colors duration-300 hover:border-fg/60 hover:bg-fg/[0.05]"
      >
        {open ? "Show less" : `Show ${count} more projects`}
        <ArrowRight size={16} className={`transition-transform duration-300 ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
    </>
  );
}
