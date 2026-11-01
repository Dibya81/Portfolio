import { ButtonLink } from "@/components/ui/ButtonLink";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { ArrowRight, ArrowUpRight, GithubIcon } from "@/components/ui/Icons";
import { RevealSlot } from "@/components/effects/RevealSlot";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import type { Project } from "@/types";

export function ProjectShowcase({ project: p, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article aria-labelledby={`showcase-${p.slug}`} className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
      <div className={`panel p-6 sm:p-8 lg:col-span-6 ${flip ? "lg:order-2" : ""}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs" style={{ color: p.accent }}>
            Flagship {String(index + 1).padStart(2, "0")}
          </span>
          <span className="meta">{p.category}</span>
          <StatusPill status={p.status} />
        </div>
        <h3 id={`showcase-${p.slug}`} className="mt-4 font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1]">
          {p.title}
        </h3>
        <p className="mt-3 text-lg text-fg/85">{p.tagline}</p>

        {p.recognition?.length ? (
          <p className="mt-4 flex flex-wrap gap-2">
            {p.recognition.map((r) => (
              <Tag key={r} tone="accent">★ {r}</Tag>
            ))}
          </p>
        ) : null}

        <ul className="mt-6 space-y-2.5 text-[0.95rem] text-fg-muted">
          {(p.results?.length ? p.results.slice(0, 2) : []).concat(p.features.slice(0, 3)).slice(0, 4).map((f) => (
            <li key={f} className="flex gap-3">
              <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-line pt-5 text-sm text-fg-muted">
          <span className="meta mr-2">Contribution</span>
          {p.contribution}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {p.technologies.slice(0, 8).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {p.technologies.length > 8 ? <Tag>+{p.technologies.length - 8}</Tag> : null}
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          <ButtonLink href={`/projects/${p.slug}`} variant="primary">
            Case study <ArrowRight size={16} />
          </ButtonLink>
          {p.demoUrl ? (
            <ButtonLink href={p.demoUrl} external ariaLabel={`${p.title} live demo (opens in a new tab)`}>
              Live demo <ArrowUpRight size={15} />
            </ButtonLink>
          ) : null}
          {p.githubUrl ? (
            <ButtonLink href={p.githubUrl} external ariaLabel={`${p.title} source on GitHub (opens in a new tab)`}>
              <GithubIcon size={15} /> Code
            </ButtonLink>
          ) : null}
        </div>
      </div>

      <div className={`lg:col-span-6 ${flip ? "lg:order-1" : ""} lg:sticky lg:top-24`}>
        {p.reveal ? (
          <RevealSlot pair={p.reveal} title={p.title} />
        ) : p.architectureFlow ? (
          <div className="panel p-6 sm:p-8">
            <p className="meta mb-5">How it works</p>
            <ArchitectureDiagram steps={p.architectureFlow} accent={p.accent} title={p.title} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
