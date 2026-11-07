import { ExperienceProvider } from "@/components/effects/ExperienceProvider";
import { HUD } from "@/components/navigation/HUD";
import { ThemeRope } from "@/components/effects/ThemeRope";
import { Gateway } from "@/components/sections/Gateway";
import { Core } from "@/components/sections/Core";
import { Laboratory } from "@/components/sections/Laboratory";
import { Projects } from "@/components/sections/Projects";
import { Foundry } from "@/components/sections/Foundry";
import { Archive } from "@/components/sections/Archive";
import { Connection } from "@/components/sections/Connection";
import { BeyondCode } from "@/components/sections/BeyondCode";
import { SiteFooter } from "@/components/ui/SiteFooter";

export default function Home() {
  return (
    <ExperienceProvider>
      <HUD />
      <ThemeRope />
      <main id="main" className="relative z-10">
        <Gateway />
        <Foundry />
        <Core />
        <Laboratory />
        <Projects />
        <Archive />
        <BeyondCode />
        <Connection />
      </main>
      <SiteFooter />
    </ExperienceProvider>
  );
}
