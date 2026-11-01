"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { isLowPowerDevice } from "@/lib/capabilities";
import { setExperience } from "@/lib/experience-store";
import { UniverseScene } from "./UniverseScene";

/**
 * THE single WebGL canvas for the main experience. Fixed behind the HTML,
 * renders on demand only (idle = zero frames), receives pointer events from
 * the document body so the HTML stays fully interactive on top.
 */
export default function UniverseCanvas() {
  const router = useRouter();
  const low = useMemo(() => isLowPowerDevice(), []);
  const [dpr, setDpr] = useState(low ? 1 : 1.5);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return () => setExperience({ webgl: false, hint: null });
  }, []);

  return (
    <Canvas
      aria-hidden
      frameloop="demand"
      dpr={dpr}
      gl={{ antialias: !low, powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: 55, near: 0.1, far: 220, position: [0, 0.3, 9] }}
      eventSource={document.body}
      eventPrefix="client"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#05070d");
        const canvas = gl.domElement;
        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          setExperience({ webgl: false, hint: null });
        });
        canvas.addEventListener("webglcontextrestored", () => setExperience({ webgl: true }));
        setExperience({ webgl: true });
        requestAnimationFrame(() => setVisible(true));
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(low ? 1 : 1.5)} />
      <UniverseScene low={low} onNavigate={(slug) => router.push(`/projects/${slug}`)} />
    </Canvas>
  );
}
