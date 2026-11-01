"use client";

import { useExperience } from "@/lib/experience-store";

/** CSS backdrop: always underneath, and the whole world when WebGL is unavailable. */
const tints = [
  "radial-gradient(ellipse at 50% 40%, #0b1020 0%, #05070d 70%)",
  "radial-gradient(ellipse at 80% 35%, #ff7a3d1f 0%, transparent 45%), radial-gradient(ellipse at 70% 70%, #5b8cff1a 0%, transparent 50%), #05070d",
  "radial-gradient(ellipse at 20% 40%, #5b8cff26 0%, transparent 48%), #05070d",
  "radial-gradient(ellipse at 80% 30%, #ff7a3d1a 0%, transparent 42%), radial-gradient(ellipse at 85% 75%, #c38bff1a 0%, transparent 40%), #05070d",
  "radial-gradient(ellipse at 80% 50%, #ff7a3d29 0%, transparent 46%), #07060a",
  "radial-gradient(ellipse at 50% 90%, #5b8cff1a 0%, transparent 55%), #05070d",
  "radial-gradient(ellipse at 50% 50%, #ff7a3d24 0%, transparent 45%), #05070d",
];

export function Backdrop() {
  const index = useExperience((s) => s.sectionIndex);
  return <div aria-hidden className="backdrop" style={{ background: tints[index] ?? tints[0] }} />;
}
