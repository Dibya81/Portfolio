"use client";

import { usePathname } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { isMuted, setMuted, sfx, subscribeSound, unlockSound } from "@/lib/sound";

const CLICKABLE =
  'a[href], button, [role="button"], summary, select, label[for], input[type="checkbox"], input[type="radio"], input[type="submit"]';

/** `data-sound` on an element (or an ancestor) picks its sound; "off" silences it. */
function play(kind: string | undefined) {
  switch (kind) {
    case "off":
      return;
    case "open":
      return sfx.open();
    case "close":
      return sfx.close();
    case "next":
      return sfx.swoosh(1);
    case "prev":
      return sfx.swoosh(-1);
    case "enter":
      return sfx.enter();
    default:
      return sfx.tap();
  }
}

const soundOf = (el: Element) => (el.closest("[data-sound]") as HTMLElement | null)?.dataset.sound;

/**
 * Site-wide: unlocks audio on the first gesture, ticks on every click of a
 * button or link, and a whisper on mouse hover. Also renders the floating
 * mute toggle (the gallery has its own in its top bar).
 */
export function SoundLayer() {
  const path = usePathname();

  useEffect(() => {
    let hovered: Element | null = null;
    const unlock = () => unlockSound();
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(CLICKABLE);
      if (!el || (el as HTMLButtonElement).disabled) return;
      play(soundOf(el));
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.(CLICKABLE) ?? null;
      if (el && el !== hovered && soundOf(el) !== "off") sfx.hover();
      hovered = el;
    };
    const opts = { capture: true, passive: true } as const;
    window.addEventListener("pointerdown", unlock, opts);
    window.addEventListener("keydown", unlock, opts);
    window.addEventListener("click", onClick, opts);
    window.addEventListener("pointerover", onOver, opts);
    return () => {
      window.removeEventListener("pointerdown", unlock, opts);
      window.removeEventListener("keydown", unlock, opts);
      window.removeEventListener("click", onClick, opts);
      window.removeEventListener("pointerover", onOver, opts);
    };
  }, []);

  if (path?.startsWith("/gallery")) return null;
  return <SoundToggle className="no-print fixed bottom-4 left-4 z-40 md:bottom-6 md:left-6" />;
}

/** Pill with live equaliser bars; click to mute / unmute (remembered). */
export function SoundToggle({ className = "" }: { className?: string }) {
  const off = useSyncExternalStore(subscribeSound, isMuted, () => false);
  return (
    <button
      type="button"
      data-sound={off ? undefined : "off"}
      aria-pressed={!off}
      aria-label={off ? "Turn sound on" : "Turn sound off"}
      onClick={() => {
        unlockSound();
        setMuted(!off);
        if (off) sfx.tap(); // confirm it's back
      }}
      className={`inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong bg-void/60 px-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-fg-muted backdrop-blur-md transition-colors hover:text-fg ${className}`}
    >
      <span aria-hidden className={`sound-bars ${off ? "is-off" : ""}`}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>{off ? "Sound off" : "Sound on"}</span>
    </button>
  );
}
