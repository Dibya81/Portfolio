import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { languages, skillGroups } from "@/data/skills";
import { getProject } from "@/data/projects";

function EvidenceLink({ slug }: { slug: string }) {
  if (slug === "mimo") {
    return (
      <a href="#experience" className="rounded-full border border-ember/30 px-2 py-0.5 font-mono text-[0.65rem] text-ember-soft hover:border-ember">
        MIMO
      </a>
    );
  }
  const project = getProject(slug);
  if (!project) return null;
  return (
    <Link
      href={`/projects/${slug}`}
      className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.65rem] text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      {project.title}
    </Link>
  );
}

/** 03 · Laboratory — skills, each backed by the projects that use it. */
export function Laboratory() {
  return (
    <section id="skills" data-station aria-labelledby="skills-title" className="relative py-[16svh]">
      <div className="shell">
        <div className="lg:ml-auto lg:w-[62%]">
          <SectionHeading
            index={2}
            world="Laboratory"
            id="skills-title"
            title={
              <>
                Skills, with <em className="text-ember-soft">receipts.</em>
              </>
            }
            lead="Every skill links to the projects whose code uses it — click through and check."
          />

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fg-muted">
            <span className="meta">Languages</span>
            {languages.map((l, i) => (
              <span key={l} className="text-fg">
                {l}
                {i < languages.length - 1 ? <span className="ml-3 text-fg-faint">·</span> : null}
              </span>
            ))}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {skillGroups.map((g) => (
              <article key={g.id} className="panel p-6" aria-labelledby={`skill-${g.id}`}>
                <h3 id={`skill-${g.id}`} className="font-display text-2xl leading-tight">{g.title}</h3>
                <p className="mt-1 text-sm text-fg-muted">{g.summary}</p>
                <ul className="mt-5 space-y-3.5">
                  {g.skills.map((s) => (
                    <li key={s.name} className="border-t border-line pt-3.5 first:border-t-0 first:pt-0">
                      <p className="text-[0.95rem] text-fg">{s.name}</p>
                      {s.evidence.length ? (
                        <p className="mt-1.5 flex flex-wrap gap-1.5" aria-label={`Used in`}>
                          {s.evidence.map((slug) => (
                            <EvidenceLink key={slug} slug={slug} />
                          ))}
                        </p>
                      ) : (
                        <p className="mt-1 font-mono text-[0.65rem] text-fg-faint">Tooling</p>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
