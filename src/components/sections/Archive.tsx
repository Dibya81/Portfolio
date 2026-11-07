import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/Icons";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ShowMore } from "@/components/projects/ShowMore";
import { archiveProjects } from "@/data/projects";

/** 06 · Archive — everything beyond the four flagships, collapsed behind "Show more". */
export function Archive() {
  return (
    <section id="archive" data-station aria-labelledby="archive-title" className="relative py-16 md:py-[16svh]">
      <div className="shell">
        <SectionHeading
          index={5}
          world="More work"
          id="archive-title"
          title={
            <>
              More work, <em className="text-ember-soft">labelled honestly.</em>
            </>
          }
          lead="Fraud detection, vision safety, healthcare agents and more."
        />
        <ShowMore count={archiveProjects.length}>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archiveProjects.map((p, i) => (
              <li key={p.slug} data-reveal style={{ "--d": i % 3 } as React.CSSProperties}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="/projects" variant="text">
              Full list with filters, including everything on GitHub <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </ShowMore>
      </div>
    </section>
  );
}
