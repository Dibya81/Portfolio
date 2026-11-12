import type { Metadata } from "next";
import Link from "next/link";
import { GalleryExperienceLazy } from "@/components/gallery/GalleryLoaders";
import { galleryItems, moreCount } from "@/components/gallery/items";

export const metadata: Metadata = {
  title: "Projects gallery",
  description: "Walk through Dibya Bhusal's projects in a 3D gallery: industrial AI, public-health ML, Web3 agents, security, IoT and computer vision.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const items = galleryItems();
  return (
    <main id="main" className="fixed inset-0">
      <h1 className="sr-only">Projects gallery</h1>
      {/* Plain list for screen readers and crawlers; the 3D room is visual. */}
      <ul className="sr-only">
        {items.map((p) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`}>
              {p.title}: {p.tagline}
            </Link>
          </li>
        ))}
      </ul>
      <GalleryExperienceLazy items={items} moreCount={moreCount()} />
    </main>
  );
}
