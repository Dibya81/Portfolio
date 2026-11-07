import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CertificateGallery } from "@/components/ui/CertificateGallery";
import { certificates, education, recognition } from "@/data/profile";

const d = (n: number) => ({ "--d": n }) as React.CSSProperties;

/** 03 · About: who I am in two sentences, where I study, what I've won. */
export function Core() {
  return (
    <section id="about" data-station aria-labelledby="about-title" className="relative py-16 md:py-[16svh]">
      <div className="shell">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              world="About"
              id="about-title"
              title={
                <>
                  Software that meets the physical world, <em className="text-ember-soft">and has to be trusted.</em>
                </>
              }
            />
            <p data-reveal style={d(1)} className="mt-8 max-w-[46ch] text-lg leading-relaxed text-fg">
              B.Tech CSE student at REVA University, Bengaluru, originally from Nepal. I build where software meets hardware:
              kiosks, plants and sensors that can&apos;t afford to fail.
            </p>
          </div>

          <div className="grid gap-4 lg:col-span-5 lg:pt-12">
            <article data-reveal style={d(1)} className="panel p-6">
              <p className="meta">Education</p>
              <p className="mt-3 font-display text-2xl leading-tight">{education.institution}</p>
              <p className="mt-1 text-sm text-fg-muted">
                {education.degree}, {education.period.replace("–", "-")}
              </p>
            </article>
            {recognition.map((r, i) => (
              <Link
                key={r.title}
                href={`/projects/${r.project}`}
                data-reveal
                style={d(i + 2)}
                className="panel group block p-6 transition-colors hover:border-line-strong"
              >
                <p className="font-display text-2xl leading-tight text-ember-soft">{r.title}</p>
                <p className="mt-1 flex items-center justify-between gap-3 text-sm text-fg-muted">
                  {r.short}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-20" data-reveal>
          <h3 className="meta mb-5">Certificates</h3>
          <CertificateGallery items={certificates} />
        </div>
      </div>
    </section>
  );
}
