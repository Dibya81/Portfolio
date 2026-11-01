import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/Icons";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { flagshipProjects } from "@/data/projects";

/** 04 · Project Universe — the five flagships. */
export function Projects() {
  return (
    <section id="projects" data-station aria-labelledby="projects-title" className="relative py-[16svh]">
      <div className="shell">
        <SectionHeading
          index={3}
          world="Project Universe"
          id="projects-title"
          title={
            <>
              Five systems, <em className="text-ember-soft">built to be trusted.</em>
            </>
          }
          lead="Industrial AI that verifies before it acts, a forecast that admits its limits, agents paid on-chain for verified work, and an identity-defense ecosystem. Each one opens into a full case study."
        />

        <div className="mt-16 space-y-24 lg:space-y-32">
          {flagshipProjects.map((p, i) => (
            <ProjectShowcase key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="mt-20">
          <ButtonLink href="/projects">
            All projects <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
