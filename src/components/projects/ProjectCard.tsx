import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { Tag } from "@/components/ui/Tag";
import { ArrowUpRight, GithubIcon } from "@/components/ui/Icons";
import type { Project } from "@/types";

/** Compact project card. The title link covers the card; secondary links sit above it. */
export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="panel group relative flex h-full flex-col p-6 transition-colors hover:border-line-strong">
      <div className="flex items-center justify-between gap-3">
        <span className="meta truncate">{p.category}</span>
        <StatusPill status={p.status} />
      </div>
      <h3 className="mt-4 font-display text-[1.75rem] leading-tight">
        <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none">
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-[0.95rem] text-fg-muted">{p.tagline}</p>
      {p.team ? <p className="mt-3 font-mono text-[0.68rem] text-fg-faint">{p.team}</p> : null}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.technologies.slice(0, 4).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <div className="relative z-10 mt-5 flex gap-4 text-sm">
        {p.demoUrl ? (
          <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-fg-muted hover:text-fg" aria-label={`${p.title} live demo (opens in a new tab)`}>
            Demo <ArrowUpRight size={14} />
          </a>
        ) : null}
        {p.githubUrl ? (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-fg-muted hover:text-fg" aria-label={`${p.title} source on GitHub (opens in a new tab)`}>
            <GithubIcon size={14} /> Code
          </a>
        ) : null}
      </div>
    </article>
  );
}
