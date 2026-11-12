"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import World from "./World";
import { Joystick, Key, useMedia, useMovementKeys } from "./controls";
import { SoundToggle } from "@/components/effects/SoundLayer";
import { sfx, startMusic, stopMusic } from "@/lib/sound";
import { buildSlots, clearInput, usePalette, type GalleryItem, type Slot } from "./shared";

/** Full-screen gallery: walk the hall, stop on a circle, press Enter for details. */
export default function GalleryExperience({ items, moreCount }: { items: GalleryItem[]; moreCount: number }) {
  const palette = usePalette();
  const slots = useMemo(() => buildSlots(items.length), [items.length]);
  const touch = useMedia("(hover: none)");
  const [spot, setSpot] = useState<number | null>(null);
  const [detail, setDetail] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [posters, setPosters] = useState<string[]>([]);
  const ready = posters.length > 0;
  const enabled = useRef(true);
  const teleport = useRef<number | null>(null);

  useMovementKeys(enabled);
  useEffect(() => {
    enabled.current = detail === null && !menu;
    if (!enabled.current) clearInput();
  }, [detail, menu]);

  // Ambient score while you're in the hall (starts once audio is unlocked).
  useEffect(() => {
    startMusic();
    return () => stopMusic();
  }, []);

  // The gallery owns the viewport: no page scroll behind it.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  const go = useCallback(
    (i: number) => {
      const n = (i + slots.length) % slots.length;
      teleport.current = n;
      setDetail(n);
    },
    [slots.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (detail !== null) {
          sfx.close();
          setDetail(null);
        } else {
          if (menu) sfx.close();
          else sfx.open();
          setMenu((m) => !m);
        }
      } else if (e.key === "Enter" && !menu) {
        // Without this, Chrome also "clicks" whatever gets focus next (the panel's close button).
        e.preventDefault();
        if (detail !== null) {
          sfx.close();
          setDetail(null);
        } else if (spot !== null) {
          sfx.open();
          setDetail(spot);
        }
      } else if (detail !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        sfx.swoosh(dir);
        go(detail + dir);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, menu, spot, go]);

  const onReady = useCallback((urls: string[]) => setPosters(urls), []);
  // A soft chime when you step onto a frame's circle (not while a panel is open).
  const onSpot = useCallback((i: number | null) => {
    setSpot(i);
    if (i !== null && enabled.current) sfx.chime();
  }, []);

  return (
    <div className="fixed inset-0 bg-void text-fg">
      <World
        items={items}
        slots={slots}
        moreCount={moreCount}
        mode="full"
        palette={palette}
        enabled={enabled}
        teleportRef={teleport}
        active
        onSpot={onSpot}
        onReady={onReady}
      />

      {/* loader */}
      <div
        aria-hidden={ready}
        className={`pointer-events-none absolute inset-0 grid place-items-center bg-void transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      >
        <div className="text-center">
          <p className="font-display text-5xl">Dibya Bhusal</p>
          <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-fg-muted">Hanging the frames…</p>
        </div>
      </div>

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 md:p-6">
        <Link
          href="/#projects"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-void/60 px-4 text-sm backdrop-blur-md transition-colors hover:bg-fg/[0.08]"
        >
          <span aria-hidden>←</span> Back to site
        </Link>
        <p className="hidden font-mono text-[0.7rem] uppercase tracking-[0.3em] text-fg-muted md:block">Projects gallery</p>
        <div className="flex items-center gap-2">
          <SoundToggle className="max-sm:px-3 max-sm:[&>span:last-child]:hidden" />
          <button
            type="button"
            data-sound="open"
            onClick={() => setMenu(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-void/60 px-4 text-sm backdrop-blur-md transition-colors hover:bg-fg/[0.08]"
          >
            Menu {touch ? null : <Key>Esc</Key>}
          </button>
        </div>
      </header>

      {/* see-details prompt */}
      {spot !== null && detail === null && !menu ? (
        <button
          type="button"
          data-sound="open"
          onClick={() => setDetail(spot)}
          className="gallery-in absolute left-1/2 top-20 inline-flex min-h-11 -translate-x-1/2 items-center gap-3 rounded-full bg-fg px-5 text-sm font-medium text-void shadow-xl md:top-24"
        >
          See details {touch ? <span aria-hidden>→</span> : <kbd className="rounded border border-void/30 px-1.5 font-mono text-xs">↵</kbd>}
        </button>
      ) : null}

      {/* controls legend (keyboard) */}
      {!touch ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex items-end justify-center gap-10 text-sm text-fg-muted">
          <div className="flex items-end gap-3">
            <span>Move</span>
            <div className="grid grid-cols-3 gap-1">
              <span />
              <Key>↑</Key>
              <span />
              <Key>←</Key>
              <Key>↓</Key>
              <Key>→</Key>
            </div>
            <span className="font-mono text-[0.7rem]">or WASD</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Menu</span>
            <Key>Esc</Key>
          </div>
          <div className="flex items-center gap-3">
            <span>See details</span>
            <Key>↵</Key>
          </div>
        </div>
      ) : (
        <>
          <Joystick className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-5 size-32" />
          <p className="pointer-events-none absolute bottom-[max(2rem,env(safe-area-inset-bottom))] right-5 max-w-[10rem] text-right font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.14em] text-fg-muted">
            Drag the pad to walk. Stand on a circle to look closer.
          </p>
        </>
      )}

      {detail !== null ? (
        <DetailPanel
          slot={slots[detail]}
          item={slots[detail].kind === "project" ? items[slots[detail].item] : null}
          poster={posters[slots[detail].kind === "project" ? slots[detail].item : items.length]}
          moreCount={moreCount}
          onClose={() => setDetail(null)}
          onPrev={() => go(detail - 1)}
          onNext={() => go(detail + 1)}
        />
      ) : null}

      {menu ? (
        <div role="dialog" aria-modal="true" aria-label="Gallery menu" className="gallery-in absolute inset-0 z-30 overflow-y-auto bg-void/95 backdrop-blur-md">
          <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center px-6 py-20">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-fg-muted">Jump to a frame</p>
            <ol className="mt-6 divide-y divide-line border-y border-line">
              {slots.map((sl, i) => (
                <li key={i}>
                  <button
                    type="button"
                    data-sound="next"
                    onClick={() => {
                      teleport.current = i;
                      setMenu(false);
                    }}
                    className="flex min-h-14 w-full items-baseline gap-4 py-3 text-left transition-colors hover:text-ember-soft"
                  >
                    <span className="w-8 font-mono text-xs text-fg-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-2xl md:text-3xl">{sl.kind === "project" ? items[sl.item].title : "More work"}</span>
                    <span className="ml-auto hidden text-sm text-fg-muted sm:block">{sl.kind === "project" ? items[sl.item].category : `${moreCount} more projects`}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" data-sound="close" onClick={() => setMenu(false)} className="inline-flex min-h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-void">
                Keep walking
              </button>
              <Link href="/" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm">
                Back to site
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DetailPanel({
  slot,
  item,
  poster,
  moreCount,
  onClose,
  onPrev,
  onNext,
}: {
  slot: Slot;
  item: GalleryItem | null;
  poster?: string;
  moreCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus(), [slot]);
  const img = item?.image?.src ?? poster;
  const arrow =
    "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-void/70 text-lg backdrop-blur-md transition-colors hover:bg-fg/[0.08]";

  return (
    <div role="dialog" aria-modal="true" aria-label={item ? item.title : "More work"} className="absolute inset-0 z-20 overflow-y-auto bg-void/[0.93] backdrop-blur-sm">
      <button
        ref={closeRef}
        type="button"
        data-sound="close"
        onClick={onClose}
        aria-label="Close details"
        className="fixed right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-line-strong bg-void/70 text-xl md:right-6 md:top-6"
      >
        ×
      </button>
      <button type="button" data-sound="prev" onClick={onPrev} aria-label="Previous frame" className={`${arrow} left-3 max-md:hidden md:left-6`}>
        ←
      </button>
      <button type="button" data-sound="next" onClick={onNext} aria-label="Next frame" className={`${arrow} right-3 max-md:hidden md:right-6`}>
        →
      </button>

      <div
        key={`${slot.z}${slot.side}`}
        className="gallery-in mx-auto grid min-h-full max-w-6xl items-center gap-8 px-5 pb-28 pt-20 md:px-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:pb-20"
      >
        {img ? (
          <figure className="overflow-hidden rounded-xl border border-line bg-fg/[0.03] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={item?.image?.alt ?? (item ? `${item.title} poster` : "More work")} className="block w-full" />
          </figure>
        ) : (
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-fg/[0.05]" />
        )}

        {item ? (
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ember-soft">
              {item.category} · {item.year}
            </p>
            <h2 className="mt-3 font-display text-5xl leading-[1.05] md:text-6xl">{item.title}</h2>
            <p className="mt-4 text-lg text-fg">{item.tagline}</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-fg-muted">{item.problem}</p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {item.technologies.map((t) => (
                <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] text-fg-muted">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/projects/${item.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-ember px-5 text-sm font-medium text-on-accent">
                Full case study
              </Link>
              {item.demoUrl ? (
                <a href={item.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm">
                  Live demo ↗
                </a>
              ) : null}
              {item.githubUrl ? (
                <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm">
                  Code ↗
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-ember-soft">The rest of the shelf</p>
            <h2 className="mt-3 font-display text-5xl md:text-6xl">More work</h2>
            <p className="mt-4 text-lg text-fg-muted">
              {moreCount} more projects, from document platforms and healthcare agents to blockchain tools and a chat app over raw Java sockets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/#archive" className="inline-flex min-h-11 items-center rounded-full bg-ember px-5 text-sm font-medium text-on-accent">
                See them on the site
              </Link>
              <Link href="/projects" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm">
                Full list with filters
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* phone: prev / next bar */}
      <div className="fixed inset-x-0 bottom-0 flex gap-3 border-t border-line bg-void/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <button type="button" data-sound="prev" onClick={onPrev} className="min-h-11 flex-1 rounded-full border border-line-strong text-sm">
          ← Previous
        </button>
        <button type="button" data-sound="next" onClick={onNext} className="min-h-11 flex-1 rounded-full border border-line-strong text-sm">
          Next →
        </button>
      </div>
    </div>
  );
}
