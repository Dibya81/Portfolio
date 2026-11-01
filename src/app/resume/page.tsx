import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DownloadIcon } from "@/components/ui/Icons";
import { profile } from "@/data/profile";
import resume from "@/data/resume.json";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}: technical lead at MIMO, projects and skills.`,
  alternates: { canonical: "/resume" },
};

type Link = { label: string; href?: string };

function Links({ links }: { links?: Link[] }) {
  if (!links?.length) return null;
  return (
    <>
      {links.map((l, i) => (
        <span key={l.label}>
          {i > 0 ? " · " : ""}
          {l.href ? (
            <a href={l.href} className="text-ember-soft underline decoration-line underline-offset-4 hover:decoration-ember" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {l.label}
            </a>
          ) : (
            l.label
          )}
        </span>
      ))}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 sm:grid sm:grid-cols-4 sm:gap-8">
      <h2 className="meta">{title}</h2>
      <div className="mt-3 sm:col-span-3 sm:mt-0">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.95rem] text-fg-muted marker:text-ember">
      {items.map((b) => (
        <li key={b}>{b}</li>
      ))}
    </ul>
  );
}

/** Web version of the resume. Same source as the PDF (src/data/resume.json → npm run resume:build). */
export default function ResumePage() {
  return (
    <>
      <PageHeader />
      <main id="main" className="shell max-w-5xl py-16 sm:py-20">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[clamp(3rem,7vw,5rem)] leading-[0.95]">{resume.name}</h1>
            <p className="mt-3 text-fg-muted">{resume.title}</p>
            <p className="mt-2 text-sm text-fg-faint">
              <Links links={resume.contact} />
            </p>
          </div>
          <div>
            <ButtonLink href={profile.resumePdf} download variant="primary">
              <DownloadIcon size={16} /> Download PDF
            </ButtonLink>
          </div>
        </header>

        <div className="mt-12">
          <Section title="Summary">
            <p className="text-fg-muted">{resume.summary}</p>
          </Section>

          <Section title="Experience">
            {resume.experience.map((x) => (
              <article key={x.org}>
                <p className="font-display text-2xl">{x.role} — {x.org}</p>
                <p className="meta mt-1">{x.period} · {x.location}</p>
                <p className="mt-2 text-sm text-fg-faint">
                  {x.context} <Links links={x.links} />
                </p>
                <Bullets items={x.bullets} />
              </article>
            ))}
          </Section>

          <Section title="Projects">
            <div className="space-y-7">
              {resume.projects.map((p) => (
                <article key={p.name}>
                  <p className="font-display text-xl">{p.name}</p>
                  <p className="mt-1 text-sm text-fg-faint">
                    {p.stack} · <Links links={p.links} />
                  </p>
                  <Bullets items={p.bullets} />
                </article>
              ))}
            </div>
          </Section>

          <Section title="Education">
            {resume.education.map((e) => (
              <article key={e.school}>
                <p className="font-display text-2xl">{e.school}</p>
                <p className="text-fg">{e.degree}</p>
                <p className="font-mono text-xs text-fg-faint">{e.period} · {e.location}</p>
                <p className="mt-2 text-sm text-fg-muted">{e.detail}</p>
              </article>
            ))}
          </Section>

          <Section title="Skills">
            {resume.skills.map((s) => (
              <p key={s.group} className="mt-2 first:mt-0 text-fg-muted">
                <span className="text-fg">{s.group}:</span> {s.items}
              </p>
            ))}
          </Section>

          <Section title="Achievements">
            <Bullets items={resume.achievements} />
          </Section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
