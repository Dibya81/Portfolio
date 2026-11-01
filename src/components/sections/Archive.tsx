import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/Icons";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { archiveProjects } from "@/data/projects";

/** 06 · Archive — everything else, honestly labelled. */
export function Archive() {
  return (
    <section id="archive" data-station aria-labelledby="archive-title" className="relative py-[16svh]">
      <div className="shell">
        <SectionHeading
          index={5}
          world="Archive"
          id="archive-title"
          title={
            <>
              More work, <em className="text-ember-soft">labelled honestly.</em>
            </>
          }
          lead="Team projects say so, prototypes say what's simulated, and anything unfinished is marked."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {archiveProjects.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <ButtonLink href="/projects">
            Explore all projects <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
