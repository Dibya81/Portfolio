import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificateGallery } from "@/components/ui/CertificateGallery";
import { certificates, education, profile, recognition } from "@/data/profile";

/** 02 · Core — who I am, education, recognition, certificates. */
export function Core() {
  return (
    <section id="about" data-station aria-labelledby="about-title" className="relative py-[16svh]">
      <div className="shell">
        <div className="lg:w-[58%]">
          <SectionHeading
            index={1}
            world="Core"
            id="about-title"
            title={
              <>
                Software that meets the physical world — <em className="text-ember-soft">and has to be trusted.</em>
              </>
            }
          />
          <div className="panel mt-10 space-y-5 p-6 text-fg-muted sm:p-8">
            {profile.about.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <dl className="grid gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="meta">Based</dt>
                <dd className="mt-1 text-fg">{profile.location}</dd>
              </div>
              <div>
                <dt className="meta">Studying</dt>
                <dd className="mt-1 text-fg">B.Tech CSE · REVA University</dd>
              </div>
              <div>
                <dt className="meta">Currently</dt>
                <dd className="mt-1 text-fg">
                  <a href="#experience" className="underline decoration-ember/50 underline-offset-4 hover:text-ember-soft">
                    Technical lead, MIMO
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:w-[58%] lg:grid-cols-2">
          <article className="panel p-6 sm:p-7" aria-labelledby="edu-title">
            <p className="meta">Education</p>
            <h3 id="edu-title" className="mt-3 font-display text-2xl leading-tight">{education.institution}</h3>
            <p className="mt-1 text-sm text-fg">{education.degree}</p>
            <p className="text-sm text-fg-muted">{education.specialisation}</p>
            <p className="mt-2 font-mono text-xs text-fg-faint">{education.period} · {education.location}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Relevant coursework">
              {education.coursework.map((c) => (
                <li key={c} className="rounded-full border border-line px-2.5 py-1 text-[0.72rem] text-fg-muted">{c}</li>
              ))}
            </ul>
          </article>

          <article className="panel p-6 sm:p-7" aria-labelledby="rec-title">
            <p className="meta">Recognition</p>
            <h3 id="rec-title" className="sr-only">Recognition</h3>
            <ul className="mt-3 space-y-5">
              {recognition.map((r) => (
                <li key={r.title}>
                  <p className="font-display text-2xl leading-tight text-ember-soft">{r.title}</p>
                  <p className="mt-1 text-sm text-fg-muted">
                    {r.detail}{" "}
                    <Link href={`/projects/${r.project}`} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-ember">
                      Case study
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="mt-20">
          <h3 className="meta mb-5">Certificates</h3>
          <CertificateGallery items={certificates} />
        </div>

      </div>
    </section>
  );
}
