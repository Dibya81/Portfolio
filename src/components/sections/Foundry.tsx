import { SectionHeading } from "@/components/ui/SectionHeading";
import { mimoInternship as job } from "@/data/experience";

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

/**
 * 02 · Experience: Technical Lead at MIMO. Kept short on purpose: one line of
 * story, four numbers, four fixes. The long list lives in the resume.
 */
export function Foundry() {
  return (
    <section id="experience" data-station aria-labelledby="experience-title" className="relative py-16 md:py-[16svh]">
      <div className="shell grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            world="Experience"
            id="experience-title"
            title={
              <>
                Technical Lead at <em className="text-ember-soft">{job.organization}.</em>
              </>
            }
          />
          <p data-reveal style={d(1)} className="mt-6 text-sm text-fg-muted">
            {job.period}, {job.location}
          </p>
          <p data-reveal style={d(2)} className="mt-5 max-w-[40ch] text-lg leading-relaxed text-fg">
            Joined as an IoT intern. When the kiosks went down, I rebuilt the backend and the Pi print listener, and now lead
            the whole production system.
          </p>
          {job.links?.length ? (
            <p data-reveal style={d(3)} className="mt-4 flex w-fit flex-wrap gap-x-6 text-sm">
              {job.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center text-ember-soft underline decoration-line underline-offset-4 transition-colors hover:decoration-ember"
                >
                  {l.label} ↗
                </a>
              ))}
            </p>
          ) : null}
        </div>

        <div className="lg:col-span-7 lg:pt-6">
          {job.highlights?.length ? (
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {job.highlights.map((h, i) => (
                <div key={h.label} data-reveal style={d(i)} className="panel flex flex-col-reverse justify-end p-5 sm:p-6 max-sm:flex-row-reverse max-sm:items-center max-sm:gap-4 max-sm:py-4">
                  <dt className="mt-2 text-sm leading-snug text-fg-muted max-sm:mt-0">{h.label}</dt>
                  <dd className="font-display text-[clamp(2.2rem,3.6vw,3rem)] leading-none text-ember-soft max-sm:min-w-[6.5rem] max-sm:shrink-0 max-sm:text-[2rem]">{h.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {job.fixes?.length ? (
            <ul className="mt-10 grid gap-x-10 gap-y-6 sm:mt-12 sm:grid-cols-2 sm:gap-y-7">
              {job.fixes.map((f, i) => (
                <li key={f.title} data-reveal style={d(i)} className="border-t border-line pt-4">
                  <p className="text-fg">{f.title}</p>
                  <p className="mt-1 text-[0.95rem] text-fg-muted">{f.line}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
