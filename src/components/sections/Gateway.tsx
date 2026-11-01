import { PreservedScroll } from "@/components/effects/PreservedScroll";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowRight } from "@/components/ui/Icons";
import { profile } from "@/data/profile";

/** 01 · Gateway — the preserved portrait sequence, then the fly-out into the universe. */
export function Gateway() {
  return (
    <section id="home" data-station aria-labelledby="hero-name" className="gateway">
      <div className="gateway-sticky">
        <PreservedScroll />
        <div className="gateway-vignette" aria-hidden />

        <div className="shell relative z-10 h-full">
          {/* Block 1 — visible on load (range 0–0.22, as in the original) */}
          <div className="hero-block inset-x-[clamp(1rem,4vw,3rem)] bottom-[11svh] max-w-3xl" data-hero-range="0,0.22" data-visible="true">
            <p className="meta text-fg-muted">[ {profile.role} · {profile.focus} ]</p>
            <h1 id="hero-name" className="mt-4 font-display text-[clamp(3.25rem,10vw,8.5rem)] leading-[0.92] tracking-[-0.02em] text-fg">
              Dibya <em className="text-ember-soft">Bhusal</em>
            </h1>
            <p className="mt-5 max-w-[46ch] text-[1.075rem] leading-relaxed text-fg/85">{profile.headline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href="#projects" variant="primary">
                Explore projects <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="/resume">Resume</ButtonLink>
              <ButtonLink href="#contact" variant="text">Contact</ButtonLink>
            </div>
            <p className="meta mt-10 flex items-center gap-3" aria-hidden>
              <span className="inline-block h-8 w-px bg-gradient-to-b from-ember to-transparent" /> Scroll to enter
            </p>
          </div>

          {/* Block 2 — range 0.30–0.55 */}
          <div className="hero-block left-[clamp(1rem,4vw,3rem)] top-[30%] max-w-md" data-hero-range="0.3,0.55" data-visible="false">
            <p className="meta">What I build</p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.02]">
              Multi-agent AI that runs on-prem — <em className="text-ember-soft">and shows its work.</em>
            </h2>
            <p className="mt-4 text-fg-muted">
              Local models with distinct roles, permission-aware retrieval, and a validator that has the final say.
            </p>
          </div>

          {/* Block 3 — range 0.60–0.85 */}
          <div className="hero-block right-[clamp(1rem,4vw,3rem)] top-[30%] max-w-md text-right" data-hero-range="0.6,0.85" data-visible="false">
            <p className="meta">How I build</p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,4.6vw,3.75rem)] leading-[1.02]">
              Honest numbers. Verified paths. <em className="text-ember-soft">Fail closed.</em>
            </h2>
            <p className="mt-4 text-fg-muted">
              Every project here says what was measured, what was simulated, and what isn&apos;t finished yet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
