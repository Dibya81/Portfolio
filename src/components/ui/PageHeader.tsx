import Link from "next/link";
import { profile } from "@/data/profile";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export function PageHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-void/90 backdrop-blur-sm">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-display text-2xl leading-none text-fg" aria-label={`${profile.name} — home`}>
          DB<span className="text-ember">.</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 sm:gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
