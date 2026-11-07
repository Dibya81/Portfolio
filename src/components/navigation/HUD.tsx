"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { stations } from "@/data/navigation";
import { useExperience } from "@/lib/experience-store";
import { MenuIcon } from "@/components/ui/Icons";
import { WorldMenu } from "./WorldMenu";

export function HUD() {
  const index = useExperience((s) => s.sectionIndex);
  const scrolled = useExperience((s) => s.progress > 0.002);
  const menuRef = useRef<HTMLDialogElement>(null);
  const station = stations[index];

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "m" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      const menu = menuRef.current;
      if (!menu) return;
      if (menu.open) menu.close();
      else menu.showModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 ${
          scrolled ? "border-b border-line bg-void/80 backdrop-blur-sm" : "border-b border-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 md:pr-20 xl:pr-12">
          <a href="#home" className="font-display text-2xl leading-none text-fg" aria-label="Dibya Bhusal, back to the start">
            DB<span className="text-ember">.</span>
          </a>

          <p className="meta hidden min-w-0 items-center gap-2 sm:flex" aria-live="polite">
            <span aria-hidden className="size-1.5 rounded-full bg-ember" />
            <span className="truncate text-fg-muted">{station.label}</span>
          </p>

          <nav aria-label="Primary" className="flex items-center gap-1">
            <Link href="/projects" className="hidden min-h-11 items-center rounded-full px-3 text-sm text-fg-muted hover:text-fg md:inline-flex">
              Projects
            </Link>
            <Link href="/resume" className="hidden min-h-11 items-center rounded-full px-3 text-sm text-fg-muted hover:text-fg md:inline-flex">
              Resume
            </Link>
            <button
              type="button"
              onClick={openMenu}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-fg transition-colors hover:border-line-strong"
              aria-haspopup="dialog"
              aria-keyshortcuts="M"
            >
              <MenuIcon size={16} />
              <span>Menu</span>
            </button>
          </nav>
        </div>
      </header>
      <WorldMenu ref={menuRef} activeIndex={index} onClose={closeMenu} />
    </>
  );
}
