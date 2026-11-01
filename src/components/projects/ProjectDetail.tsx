import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusPill } from "@/components/ui/StatusPill";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft, ArrowRight, ArrowUpRight, GithubIcon } from "@/components/ui/Icons";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import type { Project } from "@/types";

function Block({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-10 lg:grid lg:grid-cols-12 lg:gap-10">
      <h2 id={id} className="meta lg:col-span-3 lg:pt-1.5">{title}</h2>
      <div className="mt-4 lg:col-span-9 lg:mt-0">{children}</div>
    </section>
  );
}

function Bullets({ items, accent }: { items: string[]; accent: string }) {
  return (
    <ul className="space-y-3 text-fg-muted">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function ProjectDetail({ project: p, prev, next }: { project: Project; prev?: Project; next?: Project }) {
  return (
    <article>
      {/* Hero */}
      <header
        className="relative overflow-hidden border-b border-line"
        style={{ background: `radial-gradient(ellipse at 80% 0%, ${p.accent}22, transparent 55%), radial-gradient(ellipse at 0% 100%, #5b8cff14, transparent 50%)` }}
      >
        <div className="shell py-16 sm:py-24">
          <Link href="/projects" className="meta inline-flex min-h-11 items-center gap-2 hover:text-fg">
            <ArrowLeft size={14} /> All projects
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs" style={{ color: p.accent }}>{p.category}</span>
            <StatusPill status={p.status} />
            <span className="meta">{p.year}</span>
            {p.team ? <span className="meta">· {p.team}</span> : null}
          </div>
          <h1 className="mt-5 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-[-0.01em]">{p.title}</h1>
          <p className="mt-5 max-w-[48ch] text-xl text-fg/85">{p.tagline}</p>
          {p.recognition?.length ? (
            <p className="mt-5 flex flex-wrap gap-2">
              {p.recognition.map((r) => (
                <Tag key={r} tone="accent">★ {r}</Tag>
              ))}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {p.demoUrl ? (
              <ButtonLink href={p.demoUrl} external variant="primary" ariaLabel={`${p.title} live demo (opens in a new tab)`}>
                Live demo <ArrowUpRight size={16} />
              </ButtonLink>
            ) : null}
            {p.githubUrl ? (
              <ButtonLink href={p.githubUrl} external variant={p.demoUrl ? "ghost" : "primary"} ariaLabel={`${p.title} source on GitHub (opens in a new tab)`}>
                <GithubIcon size={16} /> Source code
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </header>

      <div className="shell py-8">
        <Block title="Problem" id="problem">
          <p className="max-w-[68ch] text-lg text-fg/90">{p.problem}</p>
        </Block>

        <Block title="Solution" id="solution">
          <p className="max-w-[68ch] text-fg-muted">{p.solution}</p>
        </Block>

        {p.architectureFlow || p.architectureImage || p.architecture ? (
          <Block title="Architecture" id="architecture">
            {p.architecture ? <p className="mb-8 max-w-[68ch] text-fg-muted">{p.architecture}</p> : null}
            <div className="grid gap-8 xl:grid-cols-5">
              {p.architectureFlow ? (
                <div className="panel p-6 xl:col-span-2">
                  <ArchitectureDiagram steps={p.architectureFlow} accent={p.accent} title={p.title} />
                </div>
              ) : null}
              {p.architectureImage ? (
                <figure className={p.architectureFlow ? "xl:col-span-3" : "xl:col-span-5"}>
                  <a href={p.architectureImage.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-line">
                    <Image
                      src={p.architectureImage.src}
                      alt={p.architectureImage.alt}
                      width={p.architectureImage.width}
                      height={p.architectureImage.height}
                      sizes="(min-width: 1280px) 50vw, 92vw"
                      className="w-full"
                    />
                  </a>
                  <figcaption className="meta mt-3">Architecture diagram from the repository · opens full size</figcaption>
                </figure>
              ) : null}
            </div>
          </Block>
        ) : null}

        <Block title="Key features" id="features">
          <Bullets items={p.features} accent={p.accent} />
        </Block>

        {p.decisions?.length ? (
          <Block title="Engineering decisions" id="decisions">
            <Bullets items={p.decisions} accent={p.accent} />
          </Block>
        ) : null}

        {p.results?.length ? (
          <Block title="Verified results" id="results">
            <Bullets items={p.results} accent={p.accent} />
          </Block>
        ) : null}

        {p.limitations?.length ? (
          <Block title="Known limitations" id="limitations">
            <Bullets items={p.limitations} accent="#6b7590" />
          </Block>
        ) : null}

        <Block title="My contribution" id="contribution">
          <p className="max-w-[68ch] text-fg/90">{p.contribution}</p>
        </Block>

        <Block title="Stack" id="stack">
          <div className="flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </Block>

        {p.screenshots.length ? (
          <Block title="Screenshots" id="screenshots">
            <div className="grid gap-6 md:grid-cols-2">
              {p.screenshots.map((s) => (
                <figure key={s.src} className={s.width / s.height > 1.9 ? "md:col-span-2" : ""}>
                  <div className="overflow-hidden rounded-xl border border-line">
                    <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width: 768px) 46vw, 92vw" className="w-full" />
                  </div>
                  {s.caption ? <figcaption className="mt-2 text-sm text-fg-muted">{s.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </Block>
        ) : null}

        <nav aria-label="More projects" className="mt-6 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="panel group flex min-h-24 flex-col justify-center p-5 hover:border-line-strong">
              <span className="meta flex items-center gap-2"><ArrowLeft size={13} /> Previous</span>
              <span className="mt-1 font-display text-2xl">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="panel group flex min-h-24 flex-col items-end justify-center p-5 text-right hover:border-line-strong">
              <span className="meta flex items-center gap-2">Next <ArrowRight size={13} /></span>
              <span className="mt-1 font-display text-2xl">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
}
