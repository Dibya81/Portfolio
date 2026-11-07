import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectDoors, type DoorProject } from "@/components/projects/ProjectDoors";
import { flagshipProjects } from "@/data/projects";

/** 05 · Projects: four flagships, one per domain, each behind a door. */
export function Projects() {
  const doors: DoorProject[] = flagshipProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    tagline: p.tagline,
    year: p.year,
    accent: p.accent,
    problem: p.problem,
    solution: p.solution,
    technologies: p.technologies,
    features: p.features,
    results: p.results,
    status: p.status,
    githubUrl: p.githubUrl,
    demoUrl: p.demoUrl,
    screenshots: p.screenshots,
    contribution: p.contribution,
    team: p.team,
  }));

  return (
    <section id="projects" data-station aria-labelledby="projects-title" className="relative py-16 md:py-[16svh]">
      <div className="shell">
        <SectionHeading
          world="Projects"
          id="projects-title"
          title={
            <>
              Pick a door. <em className="text-ember-soft">Walk in.</em>
            </>
          }
          lead="Four flagships, one per domain. Open a door."
        />
        <ProjectDoors projects={doors} />
      </div>
    </section>
  );
}
