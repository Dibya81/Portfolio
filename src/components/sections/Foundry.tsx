import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { mimoInternship as job } from "@/data/experience";

/** 05 · Foundry — technical lead at MIMO, told as problems solved. */
export function Foundry() {
  const meta = [job.role, job.period, job.location].filter(Boolean).join(" · ");
  return (
    <section id="experience" data-station aria-labelledby="experience-title" className="relative py-[16svh]">
      <div className="shell">
        <div className="lg:w-[62%]">
          <SectionHeading
            index={4}
            world="Foundry"
            id="experience-title"
            title={
              <>
                Technical lead at <em className="text-ember-soft">{job.organization}.</em>
              </>
            }
          />
          <p className="meta mt-5 text-fg-muted">
            {job.kind}
            {job.legalName ? ` · ${job.legalName}` : ""}
          </p>
          <p className="mt-1 font-display text-2xl">{meta}</p>
          <p className="mt-6 max-w-[52ch] text-fg-muted">{job.summary}</p>
          {job.links?.length ? (
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {job.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ember-soft underline decoration-line underline-offset-4 hover:decoration-ember"
                >
                  {l.label} ↗
                </a>
              ))}
            </p>
          ) : null}
        </div>

        {job.highlights?.length ? (
          <dl className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:w-[68%]">
            {job.highlights.map((h) => (
              <div key={h.label} className="panel flex flex-col-reverse p-5">
                <dt className="mt-1 text-sm text-fg-muted">{h.label}</dt>
                <dd className="font-display text-3xl text-ember-soft">{h.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="panel mt-8 p-6 sm:p-8 lg:w-[68%]">
          <h3 className="meta">Major issues I solved</h3>
          <ul className="mt-5 space-y-3.5">
            {job.problems.map((pr) => (
              <li key={pr.title} className="flex gap-3 text-[0.97rem] leading-relaxed text-fg-muted">
                <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-ember" />
                <span>
                  <span className="text-fg">{pr.title}:</span> {pr.body}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 lg:w-[68%]" aria-label="Stack">
          {job.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>

      </div>
    </section>
  );
}
