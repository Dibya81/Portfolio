import type { Station } from "@/types";

/** Order matters: it is the camera path through the universe. */
export const stations: Station[] = [
  { id: "home", world: "Gateway", label: "Home" },
  { id: "about", world: "Core", label: "About" },
  { id: "skills", world: "Laboratory", label: "Skills" },
  { id: "projects", world: "Project Universe", label: "Projects" },
  { id: "experience", world: "Foundry", label: "Experience" },
  { id: "archive", world: "Archive", label: "More work" },
  { id: "contact", world: "Connection", label: "Contact" },
];

export const STATION_COUNT = stations.length;
