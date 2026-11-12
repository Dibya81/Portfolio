"use client";

import dynamic from "next/dynamic";

/** Client-only, code-split entry points (three.js never ships with the first paint). */
export const GalleryPreviewLazy = dynamic(() => import("./GalleryPreview"), {
  ssr: false,
  loading: () => <div className="mt-12 aspect-[16/9] animate-pulse rounded-[2rem] border border-line bg-fg/[0.03] max-md:aspect-[4/5]" />,
});

export const GalleryExperienceLazy = dynamic(() => import("./GalleryExperience"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-void" />,
});
