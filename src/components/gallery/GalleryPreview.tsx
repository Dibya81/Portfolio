"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import World from "./World";
import { Joystick, useMedia, useMovementKeys } from "./controls";
import { buildSlots, clearInput, usePalette, type GalleryItem } from "./shared";

/**
 * Landing-page window into the gallery. Walkable in place (keys while hovered
 * or focused, joystick on touch); clicking the character opens /gallery.
 * Renders only while on screen.
 */
export default function GalleryPreview({ items, moreCount }: { items: GalleryItem[]; moreCount: number }) {
  const palette = usePalette();
  const slots = useMemo(() => buildSlots(items.length), [items.length]);
  const touch = useMedia("(hover: none)");
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);
  const hover = useRef(false);
  const focus = useRef(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useMovementKeys(enabled);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setMounted(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sync = () => {
    enabled.current = touch ? visible : hover.current || focus.current;
    if (!enabled.current) clearInput();
  };
  useEffect(sync);

  useEffect(() => {
    router.prefetch("/gallery");
  }, [router]);

  return (
    <div
      ref={box}
      tabIndex={0}
      aria-label="Interactive 3D preview of the projects gallery. Use W A S D or the arrow keys to walk. Click the character to enter the full gallery."
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") {
          hover.current = true;
          sync();
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          hover.current = false;
          sync();
        }
      }}
      onFocus={() => {
        focus.current = true;
        sync();
      }}
      onBlur={() => {
        focus.current = false;
        sync();
      }}
      className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[2rem] border border-line bg-void outline-none ring-ember focus-visible:ring-2 max-md:aspect-[4/5]"
    >
      {mounted ? (
        <World
          items={items}
          slots={slots}
          moreCount={moreCount}
          mode="preview"
          palette={palette}
          enabled={enabled}
          active={visible}
          onCharacterClick={() => router.push("/gallery")}
          labelRef={label}
        />
      ) : null}
      <div ref={label} aria-hidden className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-300">
        <span className="gallery-bubble whitespace-nowrap rounded-full bg-fg px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-void shadow-lg">
          {touch ? "Tap me to enter" : "Click me to enter"}
        </span>
      </div>

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full border border-line bg-void/60 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fg-muted backdrop-blur-md md:left-6 md:top-6">
        <span className="size-1.5 animate-pulse rounded-full bg-ember" /> Live 3D gallery
      </div>

      {touch ? (
        <Joystick className="absolute bottom-4 left-4 size-24" />
      ) : (
        <p className="pointer-events-none absolute bottom-6 left-6 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-fg-muted">
          Hover, then WASD or arrows to walk
        </p>
      )}

      <Link
        href="/gallery"
        className="absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-ember px-5 text-sm font-medium text-on-accent shadow-lg transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6"
      >
        Enter the gallery <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
