import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.category}`,
    description: `${p.tagline} ${p.problem}`.slice(0, 300),
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} · ${profile.name}`, description: p.tagline, url: `/projects/${p.slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacentProjects(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.tagline,
    url: `${siteUrl}/projects/${project.slug}`,
    codeRepository: project.githubUrl,
    programmingLanguage: project.technologies.slice(0, 6),
    author: { "@type": "Person", name: profile.name, url: siteUrl },
  };

  return (
    <>
      <PageHeader />
      <main id="main">
        <ProjectDetail project={project} prev={prev} next={next} />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
