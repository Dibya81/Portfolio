"use client";

import { useEffect, type ReactNode } from "react";
import { getExperience, startExperience, subscribe } from "@/lib/experience-store";
import { stations } from "@/data/navigation";

/**
 * Starts the single scroll listener for the page and keeps the URL hash in
 * sync with the active station (replaceState — no history spam, no jumps).
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  useEffect(() => startExperience(), []);

  useEffect(() => {
    let last = getExperience().sectionIndex;
    let userScrolled = false;
    const markScrolled = () => {
      userScrolled = true;
    };
    window.addEventListener("wheel", markScrolled, { passive: true, once: true });
    window.addEventListener("touchmove", markScrolled, { passive: true, once: true });
    window.addEventListener("keydown", markScrolled, { once: true });

    const unsubscribe = subscribe(() => {
      const i = getExperience().sectionIndex;
      if (i === last) return;
      last = i;
      if (!userScrolled) return;
      const url = i === 0 ? window.location.pathname + window.location.search : `#${stations[i].id}`;
      window.history.replaceState(window.history.state, "", url);
    });

    return () => {
      unsubscribe();
      window.removeEventListener("wheel", markScrolled);
      window.removeEventListener("touchmove", markScrolled);
      window.removeEventListener("keydown", markScrolled);
    };
  }, []);

  return <>{children}</>;
}
