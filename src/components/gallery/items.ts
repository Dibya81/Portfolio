import { archiveProjects, galleryProjects } from "@/data/projects";
import type { GalleryItem } from "./shared";

/** Server-side: the serialisable slice of each gallery project the client needs. */
export function galleryItems(): GalleryItem[] {
  return galleryProjects.map((p) => {
    const shot = p.screenshots[0];
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      tagline: p.tagline,
      problem: p.problem,
      year: p.year,
      status: p.status,
      accent: p.accent,
      technologies: p.technologies,
      demoUrl: p.demoUrl,
      githubUrl: p.githubUrl,
      image: shot ? { src: shot.src, width: shot.width, height: shot.height, alt: shot.alt } : undefined,
    };
  });
}

export const moreCount = () => archiveProjects.length;
