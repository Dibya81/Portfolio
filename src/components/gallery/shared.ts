/**
 * Shared pieces of the 3D project gallery: the serialisable item shape, the
 * room layout, the theme palette and the movement input (keyboard + touch
 * joystick write into one mutable object that the render loop reads, so input
 * never re-renders React).
 */
import { useSyncExternalStore } from "react";

export interface GalleryItem {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  problem: string;
  year: string;
  status: "live" | "development" | "archived";
  accent: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  image?: { src: string; width: number; height: number; alt: string };
}

// ---------- room layout (metres; the hall runs down -Z) ----------
export const HALL = { halfW: 5, zFront: 11, zBack: -30, height: 6 };
export const WALK = { minX: -3.65, maxX: 3.65, minZ: -28.3, maxZ: 2.2 };
export const START: [number, number] = [0, 1.2];

export interface Slot {
  kind: "project" | "more";
  item: number; // index into items (-1 for "more")
  side: -1 | 1; // -1 left wall, 1 right wall
  z: number;
  spot: [number, number]; // x, z of the floor circle in front of the frame
}

/** Nine projects alternate left/right down the hall; the last right-hand slot is "More work". */
export function buildSlots(count: number): Slot[] {
  const slots: Slot[] = [];
  for (let i = 0; i < count; i++) {
    const side: -1 | 1 = i % 2 === 0 ? -1 : 1;
    const z = -5 - Math.floor(i / 2) * 5;
    slots.push({ kind: "project", item: i, side, z, spot: [side * 3.05, z] });
  }
  const side: -1 | 1 = count % 2 === 0 ? -1 : 1;
  const z = -5 - Math.floor(count / 2) * 5;
  slots.push({ kind: "more", item: -1, side, z, spot: [side * 3.05, z] });
  return slots;
}

// ---------- palette (follows the site theme) ----------
export interface Palette {
  light: boolean;
  fog: string;
  wall: string;
  floor: string;
  ceiling: string;
  rail: string;
  frame: string;
  mat: string;
  body: string;
  visor: string;
  print: string;
  ring: string;
  text: string;
  skylight: string;
}

export const EMBER = "#ff6a2b";

const LIGHT: Palette = {
  light: true,
  fog: "#ebe9e4",
  wall: "#f3f1ec",
  floor: "#e7e4de",
  ceiling: "#f7f6f2",
  rail: "#151413",
  frame: "#141312",
  mat: "#fbfaf6",
  body: "#171614",
  visor: EMBER,
  print: "#6b665e",
  ring: "#24221f",
  text: "#151413",
  skylight: "#ffffff",
};
const DARK: Palette = {
  light: false,
  fog: "#0e0d0c",
  wall: "#1d1c1a",
  floor: "#161514",
  ceiling: "#121110",
  rail: "#4a4640",
  frame: "#0a0908",
  mat: "#efece5",
  body: "#ece7dd",
  visor: EMBER,
  print: "#625c55",
  ring: "#77716a",
  text: "#ece7dd",
  skylight: "#3a332a",
};

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readLight = () => document.documentElement.dataset.theme === "light";

export function usePalette(): Palette {
  const light = useSyncExternalStore(subscribeTheme, readLight, () => false);
  return light ? LIGHT : DARK;
}

// ---------- input ----------
export const input = {
  keys: new Set<string>(),
  joy: { x: 0, y: 0 }, // -1..1, y down = towards the camera
};

const KEYMAP: Record<string, string> = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

export function keyAction(code: string) {
  return KEYMAP[code];
}

/** Movement vector on the floor plane (x right, z towards the camera), length <= 1. */
export function readMove() {
  const k = input.keys;
  let x = (k.has("right") ? 1 : 0) - (k.has("left") ? 1 : 0) + input.joy.x;
  let z = (k.has("down") ? 1 : 0) - (k.has("up") ? 1 : 0) + input.joy.y;
  const len = Math.hypot(x, z);
  if (len > 1) {
    x /= len;
    z /= len;
  }
  return { x, z };
}

export function clearInput() {
  input.keys.clear();
  input.joy.x = 0;
  input.joy.y = 0;
}
