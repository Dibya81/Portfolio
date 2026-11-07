import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, XIcon } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

function ContactRow({ icon, label, value, href, external }: { icon: ReactNode; label: string; value: string; href?: string; external?: boolean }) {
  const inner = (
    <>
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ember-soft">{icon}</span>
      <span className="min-w-0">
        <span className="meta block">{label}</span>
        <span className="block break-words text-fg [overflow-wrap:anywhere]">{value}</span>
      </span>
    </>
  );
  const cls = "panel flex min-h-16 items-center gap-4 px-5 py-4 transition-colors max-sm:py-3";
  if (!href) return <div className={cls}>{inner}</div>;
  return (
    <a href={href} className={`${cls} hover:border-line-strong`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  );
}

/** 07 · Connection — contact and resume. */
export function Connection() {
  return (
    <section id="contact" data-station aria-labelledby="contact-title" className="relative flex items-center py-16 md:min-h-svh md:py-[16svh]">
      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          <h2 id="contact-title" data-reveal="type" className="mx-auto w-fit font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1] text-balance-safe">
            Let&apos;s build something that <em className="text-ember-soft">has to work.</em>
          </h2>
          <p data-reveal style={{ "--d": 1 } as React.CSSProperties} className="mx-auto mt-6 w-fit max-w-[52ch] text-fg-muted">
            Open to internships and collaborations. Email is fastest.
          </p>
          <div data-reveal style={{ "--d": 2 } as React.CSSProperties} className="mx-auto mt-8 flex w-fit flex-wrap justify-center gap-3 max-sm:w-full">
            <ButtonLink href={`mailto:${profile.email}`} variant="primary" className="max-sm:w-full max-sm:justify-center">
              <MailIcon size={16} /> {profile.email}
            </ButtonLink>
            <ButtonLink href="/resume" className="max-sm:w-full max-sm:justify-center">View resume</ButtonLink>
          </div>
        </div>

        <div data-reveal style={{ "--d": 3 } as React.CSSProperties} className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          <ContactRow icon={<PhoneIcon />} label="Phone" value={profile.phone} href={profile.phoneHref} />
          <ContactRow icon={<GithubIcon />} label="GitHub" value="github.com/Dibya81" href={profile.links.github} external />
          <ContactRow icon={<LinkedinIcon />} label="LinkedIn" value="in/dibya-bhusal" href={profile.links.linkedin} external />
          <ContactRow icon={<XIcon />} label="X" value="@dibya_bhusal" href={profile.links.x} external />
        </div>
      </div>
    </section>
  );
}
