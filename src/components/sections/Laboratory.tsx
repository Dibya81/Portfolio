import { SectionHeading } from "@/components/ui/SectionHeading";
import { languages, skillGroups } from "@/data/skills";

/** 04 · Skills: group names and the tools in each. Nothing else. */
export function Laboratory() {
  return (
    <section id="skills" data-station aria-labelledby="skills-title" className="relative py-16 md:py-[16svh]">
      <div className="shell">
        <SectionHeading
          world="Skills"
          id="skills-title"
          title={
            <>
              What I <em className="text-ember-soft">work with.</em>
            </>
          }
        />

        <ul data-reveal style={{ "--d": 1 } as React.CSSProperties} className="mt-10 flex w-fit flex-wrap gap-2" aria-label="Languages">
          {languages.map((l) => (
            <li key={l} className="rounded-full bg-fg px-4 py-1.5 text-sm font-medium text-void">
              {l}
            </li>
          ))}
        </ul>

        <div className="no-scrollbar mt-10 gap-4 md:columns-2 xl:columns-3 max-md:-mx-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:items-start max-md:gap-3 max-md:overflow-x-auto max-md:scroll-px-4 max-md:px-4 max-md:py-3">
          {skillGroups.map((g, i) => (
            <article
              key={g.id}
              data-reveal
              style={{ "--d": i % 3 } as React.CSSProperties}
              className="panel mb-4 break-inside-avoid p-6 max-md:mb-0 max-md:w-[80vw] max-md:shrink-0 max-md:snap-start"
              aria-labelledby={`skill-${g.id}`}
            >
              <h3 id={`skill-${g.id}`} className="font-display text-2xl leading-tight">
                {g.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <li key={s.name} className="rounded-full border border-line px-3 py-1 text-[0.82rem] text-fg-muted">
                    {s.name}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
