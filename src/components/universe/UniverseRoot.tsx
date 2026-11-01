"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isLowPowerDevice, supportsWebGL } from "@/lib/capabilities";
import { Backdrop } from "./Backdrop";

// The 3D bundle is code-split and never rendered on the server.
const UniverseCanvas = dynamic(() => import("./UniverseCanvas"), { ssr: false });

/**
 * Capability gate: mounts the single WebGL canvas after first paint (idle),
 * or keeps the CSS backdrop if WebGL isn't available. On phones / low-power
 * devices the universe is hidden behind the Gateway portrait at load, so the
 * 3D bundle waits for the first interaction instead of competing with LCP.
 */
export function UniverseRoot() {
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timer: number | undefined;
    const mountWhenIdle = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setMountCanvas(true), { timeout: 1500 });
      else timer = window.setTimeout(() => setMountCanvas(true), 400);
    };

    const events = ["scroll", "touchstart", "pointerdown", "keydown"] as const;
    const onFirstInteraction = () => {
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
      mountWhenIdle();
    };

    if (isLowPowerDevice() && window.scrollY < 10) {
      events.forEach((e) => window.addEventListener(e, onFirstInteraction, { passive: true, once: true }));
    } else {
      mountWhenIdle();
    }

    return () => {
      events.forEach((e) => window.removeEventListener(e, onFirstInteraction));
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Backdrop />
      {mountCanvas ? <UniverseCanvas /> : null}
    </>
  );
}
