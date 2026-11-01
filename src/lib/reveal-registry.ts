/**
 * Registry connecting DOM reveal slots (in the HTML layer) to the WebGL
 * reveal pass inside the single shared canvas. A slot owns its pointer state;
 * the canvas reads it every frame and positions a quad over the slot.
 */

export interface RevealSlotState {
  id: string;
  el: HTMLElement;
  product: string;
  architecture: string;
  /** Target pointer in slot UV space (0..1, y up). */
  target: { x: number; y: number };
  /** 0 or 1 — the hover target the shader eases toward. */
  hoverTarget: number;
}

type Listener = () => void;

const slots = new Map<string, RevealSlotState>();
const listeners = new Set<Listener>();
let invalidate: (() => void) | null = null;

export function registerRevealSlot(slot: RevealSlotState) {
  slots.set(slot.id, slot);
  listeners.forEach((l) => l());
  invalidate?.();
  return () => {
    slots.delete(slot.id);
    listeners.forEach((l) => l());
    invalidate?.();
  };
}

export function getRevealSlots(): RevealSlotState[] {
  return Array.from(slots.values());
}

export function subscribeRevealSlots(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setRevealInvalidator(fn: (() => void) | null) {
  invalidate = fn;
}

export function requestRevealFrame() {
  invalidate?.();
}
