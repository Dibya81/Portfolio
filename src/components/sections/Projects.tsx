import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryPreviewLazy } from "@/components/gallery/GalleryLoaders";
import { galleryItems, moreCount } from "@/components/gallery/items";

/** Projects: a walkable window into the 3D gallery; the character leads into /gallery. */
export function Projects() {
  const items = galleryItems();
  return (
    <section id="projects" data-station aria-labelledby="projects-title" className="relative py-16 md:py-[16svh]">
      <div className="shell">
        <SectionHeading
          world="Projects"
          id="projects-title"
          title={
            <>
              Walk the <em className="text-ember-soft">gallery.</em>
            </>
          }
          lead={`${items.length} projects hung in a 3D room. Take a walk, or click the character to step inside.`}
        />
        <GalleryPreviewLazy items={items} moreCount={moreCount()} />
      </div>
    </section>
  );
}
