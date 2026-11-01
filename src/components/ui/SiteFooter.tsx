import Link from "next/link";
import { profile } from "@/data/profile";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-void">
      <div className="shell flex flex-col gap-4 py-8 text-sm text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link className="hover:text-fg" href="/projects">Projects</Link></li>
            <li><Link className="hover:text-fg" href="/resume">Resume</Link></li>
            <li><a className="hover:text-fg" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a className="hover:text-fg" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </nav>
        <p className="font-mono text-xs">Next.js · React Three Fiber · built in Bengaluru</p>
      </div>
    </footer>
  );
}
