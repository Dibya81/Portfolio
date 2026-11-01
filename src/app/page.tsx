import { ExperienceProvider } from "@/components/effects/ExperienceProvider";
import { UniverseRoot } from "@/components/universe/UniverseRoot";
import { HUD } from "@/components/navigation/HUD";
import { ScrollProgress } from "@/components/navigation/ScrollProgress";
import { WorldHint } from "@/components/navigation/WorldHint";
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
      <UniverseRoot />
      <HUD />
      <ScrollProgress />
      <WorldHint />
      <main id="main" className="relative z-10">
        <Gateway />
        <Core />
        <Laboratory />
        <Projects />
        <Foundry />
        <Archive />
        <Connection />
        <BeyondCode />
      </main>
      <SiteFooter />
    </ExperienceProvider>
  );
}
