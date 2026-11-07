import Link from "next/link";
import { profile } from "@/data/profile";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-void">
      <div className="shell flex flex-col gap-4 py-8 text-sm text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5">
            <li><Link className="inline-flex min-h-11 items-center hover:text-fg" href="/projects">Projects</Link></li>
            <li><Link className="inline-flex min-h-11 items-center hover:text-fg" href="/resume">Resume</Link></li>
            <li><a className="inline-flex min-h-11 items-center hover:text-fg" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a className="inline-flex min-h-11 items-center hover:text-fg" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </nav>
        <p className="font-mono text-xs">Built with Next.js in Bengaluru</p>
      </div>
    </footer>
  );
}
