import { Portrait } from "@/components/effects/Portrait";
import { RoleRotator } from "@/components/effects/RoleRotator";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/Icons";

const ROLES = ["Technical Lead", "Backend engineer", "IoT builder", "AI agent builder"] as const;

/** Letters rendered as spans so each can rise in with a stagger (see .rise in globals.css). */
function Rise({ text, offset = 0, className = "" }: { text: string; offset?: number; className?: string }) {
  return (
    <span className={`rise block ${className}`} aria-hidden>
      {Array.from(text).map((c, i) => (
        <span key={i} style={{ "--i": i + offset } as React.CSSProperties}>
          {c}
        </span>
      ))}
    </span>
  );
}

/**
 * 01 · Hero. Name + rotating role on the left, the portrait on the right.
 * The section is taller than the screen and pins, so scrolling through it
 * turns the head in the portrait before the page moves on.
 */
export function Gateway() {
  return (
    <section id="home" data-station aria-labelledby="hero-name" className="gateway">
      <div className="gateway-sticky">
        <div className="gateway-glow" aria-hidden />
        {/*
          Phone: name → photo → role & buttons, so the face is on the first screen.
          Desktop (lg): text in the left 7 columns (two rows), photo spanning both
          rows on the right, exactly as before.
        */}
        <div className="shell relative grid gap-x-16 lg:grid-cols-12 lg:pt-16">
          <div className="lg:col-span-7 lg:row-start-1 lg:self-end">
            <p className="text-lg text-fg-muted">Hi, I&apos;m</p>
            <h1
              id="hero-name"
              aria-label="Dibya Bhusal"
              className="mt-1 pb-2 font-display text-[clamp(3.75rem,11vw,9.5rem)] leading-[0.92] tracking-[-0.02em] text-fg"
            >
              <Rise text="Dibya" />
              <Rise text="Bhusal" offset={5} className="italic text-ember-soft" />
            </h1>
          </div>

          <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center">
            <div data-reveal="media" style={{ "--d": 2, borderRadius: "2rem" } as React.CSSProperties} className="mx-auto max-w-[24rem] lg:max-w-none">
              <Portrait />
            </div>
          </div>

          <div className="lg:col-span-7 lg:row-start-2 lg:self-start">
            <p data-reveal style={{ "--d": 1 } as React.CSSProperties} className="mt-8 flex w-fit flex-wrap items-center gap-3 text-xl text-fg">
              I&apos;m a <RoleRotator words={ROLES} />
            </p>
            <p data-reveal style={{ "--d": 2 } as React.CSSProperties} className="mt-6 max-w-[46ch] text-[1.075rem] leading-relaxed text-fg-muted">
              I lead the tech behind MIMO&apos;s campus print kiosks, and build local AI agents, IoT systems and on-chain tools.
            </p>
            <div data-reveal style={{ "--d": 3 } as React.CSSProperties} className="mt-9 flex w-fit flex-wrap items-center gap-3">
              <ButtonLink href="#projects" variant="primary">
                See my work <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/resume">Resume</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
