"use client";

import { useFrame } from "@react-three/fiber";
import { Color, Fog, FogExp2, Vector3 } from "three";
import { getExperience, stationCoordinate } from "@/lib/experience-store";
import { cameraCurve, LOOK_OFFSETS, lookCurve, STATION_LAST, STATION_TINTS } from "./path";

const EPS = 1e-5;

// Scratch objects (single camera rig per page) — no allocations per frame.
const targetPos = new Vector3();
const targetLook = new Vector3();
const currentLook = new Vector3(0, 0, 0);
const targetTint = new Color();
const currentTint = new Color("#05070d");

/**
 * Scroll → camera. Reads the shared store inside useFrame (no React renders),
 * eases toward the target with frame-rate independent damping, and keeps
 * requesting frames only until it has settled.
 */
export function CameraRig() {
  useFrame((state, rawDelta) => {
    const { camera, scene } = state;
    const s = getExperience();
    const coord = stationCoordinate(s);
    const u = coord / STATION_LAST;

    cameraCurve.getPoint(u, targetPos);
    lookCurve.getPoint(u, targetLook);

    // Frame each station opposite its HTML column; shrink on narrow screens.
    const i = Math.floor(coord);
    const f = coord - i;
    const offset = LOOK_OFFSETS[i] + (LOOK_OFFSETS[Math.min(i + 1, STATION_LAST)] - LOOK_OFFSETS[i]) * f;
    const aspect = state.size.width / Math.max(state.size.height, 1);
    targetLook.x += offset * Math.min(aspect / 1.6, 1);

    if (!s.reducedMotion) {
      targetPos.x += s.pointer.x * 0.6;
      targetPos.y -= s.pointer.y * 0.35;
    }

    const delta = Math.min(rawDelta, 0.1);
    const k = s.reducedMotion ? 1 : 1 - Math.exp(-3.2 * delta);

    camera.position.lerp(targetPos, k);
    currentLook.lerp(targetLook, k);
    camera.lookAt(currentLook);

    // Station tint for background + fog.
    targetTint.copy(STATION_TINTS[i]).lerp(STATION_TINTS[Math.min(i + 1, STATION_LAST)], f);
    currentTint.lerp(targetTint, k);
    if (scene.background instanceof Color) scene.background.copy(currentTint);
    if (scene.fog instanceof FogExp2 || scene.fog instanceof Fog) scene.fog.color.copy(currentTint);

    const colorDelta =
      Math.abs(currentTint.r - targetTint.r) + Math.abs(currentTint.g - targetTint.g) + Math.abs(currentTint.b - targetTint.b);
    const moving =
      camera.position.distanceToSquared(targetPos) > EPS || currentLook.distanceToSquared(targetLook) > EPS || colorDelta > 1e-4;
    if (moving && !document.hidden) state.invalidate();
  });

  return null;
}
