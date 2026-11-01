import { CatmullRomCurve3, Color, Vector3 } from "three";

/**
 * One continuous camera path through the seven stations.
 * Stations alternate sides so they sit opposite the HTML content column:
 * Core (content left) → right, Laboratory (content right) → left, etc.
 */
export const CAMERA_POINTS: [number, number, number][] = [
  [0, 0.3, 9], // Gateway — in front of the portal
  [-1.2, -2, -14], // Core
  [1.2, -4, -38], // Laboratory
  [-1.2, -6, -62], // Project Universe
  [1.0, -5.2, -87], // Foundry — above the print line, looking down onto it
  [0, -9.5, -110], // Archive
  [0, -12, -134], // Connection
];

export const STATION_POSITIONS: [number, number, number][] = [
  [0, 0, 0], // portal ring the camera flies through
  [5.8, -2, -24],
  [-6.4, -4, -48],
  [6.2, -6, -74],
  [6.6, -8.4, -97],
  [0, -14, -124],
  [0, -12, -152],
];

/**
 * Horizontal look offset per station (world units at desktop aspect).
 * Negative → camera aims left of the station, so it appears on the right of
 * the screen (content column on the left), and vice versa.
 */
export const LOOK_OFFSETS = [0, -6.4, 6.6, 0, -7.4, 0, 0];

/** Background / fog tint per station (subtle — the void stays dominant). */
export const STATION_TINTS = ["#05070d", "#060a17", "#050b14", "#08081a", "#0d0907", "#05070d", "#0b0710"].map((c) => new Color(c));

export const cameraCurve = new CatmullRomCurve3(CAMERA_POINTS.map((p) => new Vector3(...p)), false, "centripetal");
export const lookCurve = new CatmullRomCurve3(STATION_POSITIONS.map((p) => new Vector3(...p)), false, "centripetal");

export const STATION_LAST = CAMERA_POINTS.length - 1;
