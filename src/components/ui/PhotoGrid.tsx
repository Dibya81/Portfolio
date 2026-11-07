"use client";

import Image from "next/image";
import { useState } from "react";

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const PHONE_FIRST = 3; // photos shown on phones before "See more"

/**
 * Photography grid.
 * Desktop/tablet (sm+): every photo in a 3-column grid, unchanged.
 * Phones: the first three stacked vertically, full width; "See more" shows the rest.
 */
export function PhotoGrid({ photos }: { photos: readonly Photo[] }) {
  const [all, setAll] = useState(false);
  const extra = photos.length - PHONE_FIRST;

  return (
    <>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-2">
        {photos.map((ph, i) => (
          <li key={ph.src} className={!all && i >= PHONE_FIRST ? "max-sm:hidden" : undefined}>
            <Image
              src={ph.src}
              alt={ph.alt}
              width={ph.width}
              height={ph.height}
              sizes="(min-width: 1024px) 15vw, (min-width: 640px) 30vw, 90vw"
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          </li>
        ))}
      </ul>
      {extra > 0 ? (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-line-strong text-sm text-fg transition-colors hover:bg-fg/[0.05] sm:hidden"
        >
          {all ? "Show less" : `See ${extra} more photos`}
        </button>
      ) : null}
    </>
  );
}
