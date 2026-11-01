import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { StatusPill } from "@/components/ui/StatusPill";
import { ArrowRight } from "@/components/ui/Icons";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { AllWorkList } from "@/components/projects/AllWorkList";
import { archiveProjects, flagshipProjects } from "@/data/projects";
import { allWork } from "@/data/allWork";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project by Dibya Bhusal: on-prem multi-agent AI, public-health forecasting, Aptos and Solana systems, IoT, security tools and experiments, with verified contributions and honest status.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader />
      <main id="main" className="shell py-16 sm:py-20">
        <p className="meta">Archive</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.95]">Projects</h1>
        <p className="mt-5 max-w-[60ch] text-fg-muted">
          All {flagshipProjects.length + archiveProjects.length + allWork.length} projects: flagships first, then more case studies, then everything else on GitHub and on my machine. Team projects are marked and prototypes say what is simulated.
        </p>

        <section aria-labelledby="flagships" className="mt-14">
          <h2 id="flagships" className="meta mb-5">Flagships</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {flagshipProjects.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="panel group flex h-full flex-col p-7 transition-colors hover:border-line-strong"
                  style={{ backgroundImage: `radial-gradient(ellipse at 100% 0%, ${p.accent}1f, transparent 60%)` }}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs" style={{ color: p.accent }}>
                      {String(i + 1).padStart(2, "0")} · {p.category}
                    </span>
                    <StatusPill status={p.status} />
                  </span>
                  <span className="mt-5 font-display text-4xl leading-none">{p.title}</span>
                  <span className="mt-3 flex-1 text-fg-muted">{p.tagline}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-ember-soft">
                    Read the case study <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="all-projects" className="mt-20">
          <h2 id="all-projects" className="meta mb-5">More work</h2>
          <ProjectFilter projects={archiveProjects} />
        </section>

        <section id="everything" aria-labelledby="everything-title" className="mt-20 scroll-mt-24">
          <h2 id="everything-title" className="meta mb-2">Everything else</h2>
          <p className="mb-6 max-w-[60ch] text-sm text-fg-muted">
            Experiments, hackathon builds and work in progress. &ldquo;Local&rdquo; projects live on my machine and aren&rsquo;t published yet.
          </p>
          <AllWorkList items={allWork} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
