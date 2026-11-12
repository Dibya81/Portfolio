"use client";

import { useEffect, type ReactNode } from "react";
import { startExperience } from "@/lib/experience-store";

/**
 * Starts the single scroll listener for the page. The URL is deliberately not
 * rewritten while scrolling: a #section hash made reloads jump down the page.
 */
export function ExperienceProvider({ children }: { children: ReactNode }) {
  useEffect(() => startExperience(), []);

  // Blueprint reveal: [data-reveal] elements are "built" once as they enter.
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // Blueprint size tag, like a design tool measuring the box it draws.
          const { width, height } = e.boundingClientRect;
          (e.target as HTMLElement).dataset.size = `${Math.round(width)} × ${Math.round(height)}`;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <>{children}</>;
}
