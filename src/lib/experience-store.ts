/**
 * Shared experience state — the single source of truth for scroll.
 *
 * One native `scroll` listener drives everything: the preserved image
 * sequence, the HUD, hash sync and the 3D camera. No smooth-scroll library.
 * React reads it through `useExperience(selector)`; the 3D scene reads it
 * inside `useFrame` via `getExperience()` without re-rendering.
 */
import { useSyncExternalStore } from "react";
import { STATION_COUNT } from "@/data/navigation";

export interface ExperienceState {
  /** 0..1 over the whole document. */
  progress: number;
  /** Station whose box contains the viewport centre. */
  sectionIndex: number;
  /** 0..1 — viewport centre travelling through each station. */
  sectionProgress: number[];
  /** 0..1 — sticky-pin progress (top reaches viewport top → bottom reaches viewport bottom). */
  pinProgress: number[];
  /** -1..1 pointer position, for parallax. */
  pointer: { x: number; y: number };
  reducedMotion: boolean;
  webgl: boolean;
  /** Hint shown by the HUD when hovering an interactive 3D object. */
  hint: string | null;
}

type Listener = () => void;

const zeros = () => Array.from({ length: STATION_COUNT }, () => 0);

const state: ExperienceState = {
  progress: 0,
  sectionIndex: 0,
  sectionProgress: zeros(),
  pinProgress: zeros(),
  pointer: { x: 0, y: 0 },
  reducedMotion: false,
  webgl: false,
  hint: null,
};

let snapshot: ExperienceState = { ...state };
const listeners = new Set<Listener>();
const invalidators = new Set<() => void>();

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function emit() {
  snapshot = {
    ...state,
    sectionProgress: state.sectionProgress.slice(),
    pinProgress: state.pinProgress.slice(),
    pointer: { ...state.pointer },
  };
  listeners.forEach((l) => l());
  if (typeof document === "undefined" || !document.hidden) invalidators.forEach((fn) => fn());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getExperience(): ExperienceState {
  return snapshot;
}

/** Register a render invalidator (the R3F canvas) called on every state change. */
export function onInvalidate(fn: () => void) {
  invalidators.add(fn);
  return () => {
    invalidators.delete(fn);
  };
}

export function setExperience(patch: Partial<Pick<ExperienceState, "webgl" | "hint">>) {
  let changed = false;
  for (const [k, v] of Object.entries(patch) as [keyof typeof patch, never][]) {
    if (state[k] !== v) {
      (state as unknown as Record<string, unknown>)[k] = v;
      changed = true;
    }
  }
  if (changed) emit();
}

const serverSnapshot = snapshot;

export function useExperience<T>(selector: (s: ExperienceState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getExperience()),
    () => selector(serverSnapshot),
  );
}

// ───────────────────────── measurement ─────────────────────────

interface Box {
  top: number;
  height: number;
}

let sections: HTMLElement[] = [];
let boxes: Box[] = [];

function measure() {
  const y = window.scrollY;
  boxes = sections.map((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + y, height: el.offsetHeight };
  });
}

function compute() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  state.progress = max > 0 ? clamp01(y / max) : 0;

  const centre = y + vh * 0.5;
  let active = 0;
  boxes.forEach((b, i) => {
    state.sectionProgress[i] = b.height > 0 ? clamp01((centre - b.top) / b.height) : 0;
    const pinSpan = b.height - vh;
    state.pinProgress[i] = pinSpan > 0 ? clamp01((y - b.top) / pinSpan) : clamp01((y - b.top) / Math.max(b.height, 1));
    if (centre >= b.top) active = i;
  });
  state.sectionIndex = active;
}

/** Attach the single scroll listener. Returns a cleanup. */
export function startExperience(): () => void {
  sections = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  state.reducedMotion = motionQuery.matches;

  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      compute();
      emit();
    });
  };
  const remeasure = () => {
    measure();
    schedule();
  };

  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    state.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    state.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    schedule();
  };
  const onMotion = (e: MediaQueryListEvent) => {
    state.reducedMotion = e.matches;
    schedule();
  };
  const onVisibility = () => {
    if (!document.hidden) schedule();
  };

  const ro = new ResizeObserver(remeasure);
  ro.observe(document.body);

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", remeasure, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  motionQuery.addEventListener("change", onMotion);
  document.addEventListener("visibilitychange", onVisibility);

  measure();
  compute();
  emit();

  return () => {
    cancelAnimationFrame(frame);
    ro.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", remeasure);
    window.removeEventListener("pointermove", onPointer);
    motionQuery.removeEventListener("change", onMotion);
    document.removeEventListener("visibilitychange", onVisibility);
    sections = [];
    boxes = [];
  };
}

/**
 * Continuous station coordinate for the camera: station i is framed when its
 * section's centre progress is 0.5. Returns 0..STATION_COUNT-1.
 */
export function stationCoordinate(s: ExperienceState): number {
  const i = s.sectionIndex;
  const v = i + (s.sectionProgress[i] - 0.5);
  return Math.min(Math.max(v, 0), STATION_COUNT - 1);
}
