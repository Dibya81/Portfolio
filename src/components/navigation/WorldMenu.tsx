"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { stations } from "@/data/navigation";
import { profile } from "@/data/profile";
import { CloseIcon } from "@/components/ui/Icons";

interface WorldMenuProps {
  activeIndex: number;
  onClose: () => void;
}

/** Full-screen station list. Native <dialog>: Escape closes, focus is trapped and restored. */
export const WorldMenu = forwardRef<HTMLDialogElement, WorldMenuProps>(function WorldMenu({ activeIndex, onClose }, ref) {
  return (
    <dialog
      ref={ref}
      aria-label="Site menu"
      className="m-0 h-dvh max-h-none w-full max-w-none bg-void p-0 text-fg backdrop:bg-transparent"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="shell flex h-full flex-col py-5">
        <div className="flex h-11 items-center justify-between">
          <span className="meta">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line text-fg-muted hover:text-fg"
            aria-label="Close menu"
            autoFocus
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav aria-label="Stations" className="flex flex-1 items-center">
          <ol className="w-full divide-y divide-line border-y border-line">
            {stations.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`/#${s.id}`}
                  onClick={onClose}
                  aria-current={i === activeIndex ? "location" : undefined}
                  className="group flex min-h-16 items-baseline gap-5 py-3 transition-colors hover:text-ember-soft"
                >
                  <span className={`w-8 font-mono text-xs ${i === activeIndex ? "text-ember" : "text-fg-faint"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-tight">{s.world}</span>
                  <span className="meta ml-auto hidden sm:inline">{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-2 text-sm text-fg-muted">
          <Link href="/projects" onClick={onClose} className="hover:text-fg">All projects</Link>
          <Link href="/resume" onClick={onClose} className="hover:text-fg">Resume</Link>
          <a href={`mailto:${profile.email}`} className="hover:text-fg">{profile.email}</a>
        </div>
      </div>
    </dialog>
  );
});
