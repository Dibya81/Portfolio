"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { onInvalidate } from "@/lib/experience-store";
import { CameraRig } from "./CameraRig";
import { Starfield } from "./Starfield";
import { Stations } from "./Stations";
import { RevealLayer } from "./RevealLayer";

export function UniverseScene({ low, onNavigate }: { low: boolean; onNavigate: (slug: string) => void }) {
  const invalidate = useThree((s) => s.invalidate);

  // Every experience-state change (scroll, pointer, resize) requests one frame.
  useEffect(() => onInvalidate(() => invalidate()), [invalidate]);

  return (
    <>
      <color attach="background" args={["#05070d"]} />
      <fogExp2 attach="fog" args={["#05070d", 0.032]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 10, 6]} intensity={1.2} color="#c9d6ff" />
      <Starfield count={low ? 900 : 2400} />
      <Stations low={low} onNavigate={onNavigate} />
      <CameraRig />
      <RevealLayer />
    </>
  );
}
