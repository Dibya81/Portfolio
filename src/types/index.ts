export type ProjectStatus = "live" | "development" | "archived";

export type ProjectArea = "AI" | "Security" | "Web3" | "IoT" | "Data" | "Full-stack";

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/** Ported Spider-Man shader reveal: product screenshot on top, architecture underneath. */
export interface RevealPair {
  product: string;
  architecture: string;
  productAlt: string;
  architectureAlt: string;
}

export interface ArchitectureStep {
  label: string;
  detail: string;
}

export interface Project {
  slug: string;
  title: string;
  category: string;
  tagline: string;
  year: string;
  area: ProjectArea[];
  accent: string;

  problem: string;
  solution: string;

  technologies: string[];
  features: string[];

  architecture?: string;
  architectureFlow?: ArchitectureStep[];
  architectureImage?: Screenshot;

  decisions?: string[];
  results?: string[];
  limitations?: string[];

  contribution: string;
  team?: string;
  recognition?: string[];

  status: ProjectStatus;
  githubUrl?: string;
  demoUrl?: string;

  screenshots: Screenshot[];
  reveal?: RevealPair;

  featured: boolean;
}

export interface Skill {
  name: string;
  /** Project slugs (or "mimo") whose repositories show this skill in use. */
  evidence: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  summary: string;
  skills: Skill[];
}

export interface ProblemSolved {
  title: string;
  body: string;
}

export interface ExperienceEntry {
  organization: string;
  legalName?: string;
  kind: string;
  highlights?: { value: string; label: string }[];
  links?: { label: string; href: string }[];
  role?: string;
  period?: string;
  location?: string;
  summary: string;
  /** First-person story: how the role started and what is owned now. */
  story?: string;
  /** The few fixes worth showing on the home page, one line each. */
  fixes?: { title: string; line: string }[];
  problems: ProblemSolved[];
  stack: string[];
  screenshots: Screenshot[];
}

export interface Station {
  id: string;
  world: string;
  label: string;
}
