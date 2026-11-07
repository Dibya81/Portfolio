"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight, GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/types";

export type DoorProject = Pick<
  Project,
  | "slug"
  | "title"
  | "category"
  | "tagline"
  | "year"
  | "accent"
  | "problem"
  | "solution"
  | "technologies"
  | "features"
  | "results"
  | "status"
  | "githubUrl"
  | "demoUrl"
  | "screenshots"
  | "contribution"
  | "team"
>;

const STATUS: Record<Project["status"], string> = { live: "Live", development: "In development", archived: "Archived" };
const SWING_MS = 520; // door swings this long before we walk through

/** Page scroll lock while a door is open (the dialog scrolls itself). */
function lockPageScroll(lock: boolean) {
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

/**
 * Projects as doors. Hover cracks a door open (warm light + a glimpse of the
 * project behind it). Click swings it wide, the row zooms toward it, and the
 * project's details open as a full-screen dialog that grows out of the
 * doorway. "Back to the doors" (or Esc) returns, focus goes back to the door.
 */
export function ProjectDoors({ projects }: { projects: DoorProject[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const row = useRef<HTMLUListElement>(null);
  const doors = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef(0);

  // Always release the scroll lock when this unmounts, e.g. when "Full case
  // study" navigates away while a door is still open.
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      lockPageScroll(false);
    },
    [],
  );

  // Phones: the row is a horizontal swipe strip. Whichever door is nearest the
  // middle is "active": it cracks open (the touch version of hover) and lights
  // its dot. Tracked from the scroll position itself, so it follows the finger.
  useEffect(() => {
    const rowEl = row.current;
    if (!rowEl) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (rowEl.scrollWidth <= rowEl.clientWidth + 1) return; // desktop grid: not a strip
      const mid = rowEl.getBoundingClientRect().left + rowEl.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      rowEl.querySelectorAll("li").forEach((li, i) => {
        const r = li.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    rowEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      rowEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => {
    row.current?.querySelectorAll("li")[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const openDoor = (i: number) => {
    if (open !== null) return;
    const btn = doors.current[i];
    const d = dialog.current;
    const rowEl = row.current;
    if (!btn || !d || !rowEl) return;

    const frame = btn.querySelector<HTMLElement>(".door-frame") ?? btn;
    const r = frame.getBoundingClientRect();
    const rr = rowEl.getBoundingClientRect();
    setOrigin(`${r.left - rr.left + r.width / 2}px ${r.top - rr.top + r.height / 2}px`);
    setOpen(i);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(() => {
      // The dialog's clip-path starts as the doorway's rectangle.
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      d.style.setProperty("--t", `${(r.top / vh) * 100}%`);
      d.style.setProperty("--l", `${(r.left / vw) * 100}%`);
      d.style.setProperty("--r", `${((vw - r.right) / vw) * 100}%`);
      d.style.setProperty("--b", `${((vh - r.bottom) / vh) * 100}%`);
      setZoom(true);
      d.dataset.closing = "false";
      lockPageScroll(true);
      d.showModal();
      d.scrollTop = 0;
    }, reduced ? 0 : SWING_MS);
  };

  const back = () => {
    const d = dialog.current;
    if (!d?.open) return;
    d.dataset.closing = "true";
    window.setTimeout(() => d.close(), 320);
  };

  // Runs for both "Back to the doors" and Esc.
  const onClose = () => {
    const d = dialog.current;
    if (d) d.dataset.closing = "false";
    lockPageScroll(false);
    setZoom(false);
    const i = open;
    window.setTimeout(() => {
      setOpen(null);
      if (i !== null) doors.current[i]?.focus({ preventScroll: true });
    }, 450);
  };

  const p = open !== null ? projects[open] : null;
  const shot = p?.screenshots[0];
  const media = p ? (
    shot ? (
                  <figure className="overflow-hidden rounded-2xl border border-line bg-ink">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      sizes="(min-width: 1024px) 38vw, 92vw"
                      className="h-auto w-full"
                    />
                    {shot.caption ? <figcaption className="px-4 py-3 text-sm text-fg-muted">{shot.caption}</figcaption> : null}
                  </figure>
                ) : (
                  <div
                    className="flex aspect-[16/10] items-end rounded-2xl p-6"
                    style={{ background: `linear-gradient(135deg, ${p.accent}, color-mix(in oklab, ${p.accent} 45%, #000))` }}
                    aria-hidden
                  >
                    <span className="font-display text-5xl text-[#120a05]">{p.title}</span>
                  </div>
                )
  ) : null;

  return (
    <>
      <ul
        ref={row}
        className="door-row no-scrollbar mt-16 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10 max-md:-mx-4 max-md:mt-10 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:px-[19vw] max-md:py-3"
        data-zoom={zoom}
        style={{ transformOrigin: origin }}
      >
        {projects.map((proj, i) => (
          <li
            key={proj.slug}
            data-reveal
            data-index={i}
            style={{ "--d": i } as React.CSSProperties}
            className="max-md:w-[62vw] max-md:shrink-0 max-md:snap-center"
          >
            <button
              ref={(el) => {
                doors.current[i] = el;
              }}
              type="button"
              className="door"
              data-open={open === i}
              data-active={active === i}
              aria-haspopup="dialog"
              onClick={() => openDoor(i)}
              style={{ "--accent": proj.accent } as React.CSSProperties}
            >
              <span className="door-frame" aria-hidden>
                <span className="door-inside">
                  {proj.screenshots[0] ? (
                    <Image src={proj.screenshots[0].src} alt="" fill sizes="(min-width: 1024px) 22vw, 45vw" />
                  ) : null}
                </span>
                <span className="door-leaf">
                  <span className="door-panel" />
                  <span className="door-panel" />
                  <span className="door-plate">{proj.title}</span>
                  <span className="door-knob" />
                </span>
              </span>
              <span className="mt-5 block">
                <span className="block font-display text-[1.65rem] leading-tight text-fg">{proj.title}</span>
                <span className="mt-0.5 block text-sm text-fg-muted">{proj.category}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Phones: where you are in the swipe strip; tap a dot to jump. */}
      <div className="mt-5 flex justify-center gap-1 md:hidden">
        {projects.map((proj, i) => (
          <button
            key={proj.slug}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show door ${i + 1}: ${proj.title}`}
            aria-current={active === i}
            className="flex size-11 items-center justify-center"
          >
            <span
              className={`h-1.5 rounded-full transition-all duration-300 ${active === i ? "w-6 bg-ember" : "w-1.5 bg-line-strong"}`}
            />
          </button>
        ))}
      </div>

      <dialog ref={dialog} className="door-dialog" aria-labelledby="door-title" onClose={onClose}>
        {p ? (
          <div style={{ "--accent": p.accent } as React.CSSProperties}>
            <header className="sticky top-0 z-10 border-b border-line bg-void/85 backdrop-blur-md">
              <div className="shell flex h-16 items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm text-fg transition-colors hover:bg-fg/[0.05]"
                  autoFocus
                >
                  <ArrowRight size={16} className="rotate-180" /> Back to the doors
                </button>
                <p className="flex items-center gap-2 text-sm text-fg-muted">
                  <span className="size-2 rounded-full" style={{ background: p.accent }} aria-hidden />
                  {STATUS[p.status]}, {p.year}
                </p>
              </div>
            </header>

            <div className="shell grid gap-12 py-14 max-lg:pt-6 max-lg:pb-32 lg:grid-cols-12 lg:gap-16 lg:py-20">
              <div className="lg:col-span-7">
                {/* Phones: the picture comes first. */}
                <div className="mb-8 lg:hidden">{media}</div>
                <p className="flex items-center gap-3 text-sm text-fg-muted">
                  <span className="h-px w-10" style={{ background: p.accent }} aria-hidden />
                  {p.category}
                </p>
                <h2 id="door-title" className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.98] text-fg">
                  {p.title}
                </h2>
                <p className="mt-5 max-w-[42ch] text-xl leading-snug text-fg">{p.tagline}</p>

                <div className="mt-8 flex flex-wrap items-center gap-3 max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-20 max-lg:mt-0 max-lg:flex-nowrap max-lg:justify-center max-lg:gap-2 max-lg:border-t max-lg:border-line max-lg:bg-void/90 max-lg:px-3 max-lg:pt-3 max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:backdrop-blur-md">
                  {p.demoUrl ? (
                    <ButtonLink href={p.demoUrl} variant="primary" external>
                      <span className="max-lg:hidden">Open live demo</span>
                      <span className="lg:hidden">Live demo</span> <ArrowRight size={16} />
                    </ButtonLink>
                  ) : null}
                  {p.githubUrl ? (
                    <ButtonLink href={p.githubUrl} external>
                      <GithubIcon size={16} /> Code
                    </ButtonLink>
                  ) : null}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-ember-soft underline-offset-4 hover:underline"
                  >
                    <span className="max-lg:hidden">Full case study</span>
                    <span className="lg:hidden">Case study</span> <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="mt-14 grid gap-10 sm:grid-cols-2">
                  <div>
                    <h3 className="font-display text-2xl text-fg">The problem</h3>
                    <p className="mt-3 text-fg-muted">{p.problem}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-fg">What I built</h3>
                    <p className="mt-3 text-fg-muted">{p.solution}</p>
                  </div>
                </div>

                {p.results?.length ? (
                  <div className="mt-12">
                    <h3 className="font-display text-2xl text-fg">Results</h3>
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                      {p.results.map((r) => (
                        <li key={r} className="border-t border-line pt-4 text-[0.97rem] text-fg-muted">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
                <div className="max-lg:hidden">{media}</div>

                <h3 className="mt-10 font-display text-2xl text-fg">Key features</h3>
                <ul className="mt-4 space-y-3">
                  {p.features.slice(0, 6).map((f) => (
                    <li key={f} className="flex gap-3 text-[0.97rem] text-fg-muted">
                      <span className="mt-[0.65em] h-px w-3 shrink-0" style={{ background: p.accent }} aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 font-display text-2xl text-fg">Stack</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[0.72rem] text-fg-muted">
                      {t}
                    </li>
                  ))}
                </ul>

                <p className="mt-10 border-t border-line pt-5 text-sm text-fg-muted">
                  {p.team ? `${p.team}. ` : ""}
                  {p.contribution}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
