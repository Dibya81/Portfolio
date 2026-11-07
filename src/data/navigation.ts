import type { Station } from "@/types";

/** Scroll order of the page; the header shows the active section's label. */
export const stations: Station[] = [
  { id: "home", world: "Home", label: "Home" },
  { id: "experience", world: "Experience", label: "Experience" },
  { id: "about", world: "About", label: "About" },
  { id: "skills", world: "Skills", label: "Skills" },
  { id: "projects", world: "Projects", label: "Projects" },
  { id: "archive", world: "More work", label: "More work" },
  { id: "contact", world: "Contact", label: "Contact" },
];

export const STATION_COUNT = stations.length;

