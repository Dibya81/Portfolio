"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CloseIcon } from "./Icons";

interface Certificate {
  src: string;
  title: string;
  width: number;
  height: number;
}

export function CertificateGallery({ items }: { items: readonly Certificate[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Certificate | null>(null);

  const open = (c: Certificate) => {
    setActive(c);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      {/* Continuous horizontal loop: the list is rendered twice and the track slides by 50%.
          Pauses on hover/focus; with reduced motion it becomes a plain swipeable row. */}
      <div className="cert-marquee relative -mx-4 overflow-hidden px-4 sm:mx-0 sm:px-0" role="region" aria-label="Certificates">
        <ul className="cert-track flex w-max gap-3">
          {[...items, ...items].map((c, i) => {
            const clone = i >= items.length;
            return (
              <li key={`${c.src}-${i}`} className="w-[15rem] shrink-0 sm:w-[17rem]" aria-hidden={clone || undefined}>
                <button
                  type="button"
                  onClick={() => open(c)}
                  tabIndex={clone ? -1 : undefined}
                  className="group block w-full overflow-hidden rounded-xl border border-line bg-ink text-left transition-colors hover:border-line-strong"
                  aria-label={`View certificate: ${c.title}`}
                >
                  <Image
                    src={c.src}
                    alt=""
                    width={c.width}
                    height={c.height}
                    sizes="17rem"
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <span className="block truncate px-3 py-2.5 text-xs leading-snug text-fg-muted">{c.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="cert-dialog m-auto max-h-[92vh] w-[min(92vw,64rem)] rounded-2xl border border-line bg-ink p-0 text-fg"
        aria-label={active?.title ?? "Certificate"}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onClose={() => setActive(null)}
      >
        {active ? (
          <figure>
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
              <figcaption className="text-sm text-fg-muted">{active.title}</figcaption>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted hover:bg-white/5 hover:text-fg"
                aria-label="Close"
                autoFocus
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <Image
              src={active.src}
              alt={active.title}
              width={active.width}
              height={active.height}
              sizes="92vw"
              className="max-h-[78vh] w-full object-contain"
            />
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
