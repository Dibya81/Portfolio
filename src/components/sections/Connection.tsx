import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, PinIcon, XIcon } from "@/components/ui/Icons";
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
  const cls = "panel flex min-h-16 items-center gap-4 px-5 py-4 transition-colors";
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
    <section id="contact" data-station aria-labelledby="contact-title" className="relative flex min-h-svh items-center py-[16svh]">
      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="meta flex items-center justify-center gap-3">
            <span className="text-ember">07</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            <span>Connection</span>
          </p>
          <h2 id="contact-title" className="mt-5 font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1] text-balance-safe">
            Let&apos;s build something that <em className="text-ember-soft">has to work.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-fg-muted">
            Open to internship opportunities and engineering collaborations. Email is the fastest way to reach me.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`mailto:${profile.email}`} variant="primary">
              <MailIcon size={16} /> {profile.email}
            </ButtonLink>
            <ButtonLink href="/resume">View resume</ButtonLink>
            <ButtonLink href={profile.resumePdf} download>
              <DownloadIcon size={16} /> PDF
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ContactRow icon={<MailIcon />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactRow icon={<PhoneIcon />} label="Phone" value={profile.phone} href={profile.phoneHref} />
          <ContactRow icon={<GithubIcon />} label="GitHub" value="github.com/Dibya81" href={profile.links.github} external />
          <ContactRow icon={<LinkedinIcon />} label="LinkedIn" value="in/dibya-bhusal" href={profile.links.linkedin} external />
          <ContactRow icon={<XIcon />} label="X" value="@dibya_bhusal" href={profile.links.x} external />
          <ContactRow icon={<PinIcon />} label="Location" value={profile.location} />
        </div>
      </div>
    </section>
  );
}
