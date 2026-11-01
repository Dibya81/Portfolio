/**
 * Everything else: every other project on GitHub (Dibya81) and on Dibya's machine
 * that isn't already a flagship or archive case study. One line each, taken from the
 * project's own README or repository. "local" = not published on GitHub yet.
 *
 * Deliberately left out: forks (eventyay, AegisCore), Pressline (user's request),
 * zenni_bhai (personal data), coursework folders and projects named after classmates.
 */
export type WorkCategory = "AI" | "Full-stack" | "IoT" | "Security" | "Web3" | "Web";

export interface WorkItem {
  name: string;
  description: string;
  tech: string[];
  category: WorkCategory;
  year: string;
  /** Public repository, if published. */
  repo?: string;
  live?: string;
  /** True when the project exists only on Dibya's machine. */
  local?: boolean;
}

export const allWork: WorkItem[] = [
  // ── AI ──
  {
    name: "SwarmLearn",
    description: "A swarm of ₹300 ESP32-C3 boards that train a neural network on-chip and learn together through federated learning over a self-built wireless mesh. All 14 phases run in a deterministic simulator; hardware runs are still pending.",
    tech: ["C", "ESP-NOW", "Federated learning", "Python"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "SupportPilot",
    description: "A self-improving AI support agent for an open-source project: answers questions with citations, triages new GitHub issues, flags duplicates and learns from maintainer corrections. In phase 2 (RAG MVP).",
    tech: ["Python", "RAG", "PostgreSQL + pgvector", "Redis", "Docker"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "JARVIS",
    description: "Personal assistant run from Telegram or a HUD app through an always-on Linux hub that controls both computers. Risky actions need single-use approval codes; includes a desktop app, wake-word voice and a knowledge-graph memory.",
    tech: ["Python", "Electron", "MCP", "Telegram"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "Dasha",
    description: "A fully local, private personal-intelligence assistant that knows your context, controls your machine and learns from each interaction.",
    tech: ["Python", "Local LLMs"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "Agentic Hybrid Graph RAG",
    description: "An 8-node agentic RAG pipeline that combines vector search, graph traversal, SQL queries and live web retrieval.",
    tech: ["FastAPI", "LangGraph", "ChromaDB", "Neo4j", "Ollama"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "CancerGraphNet",
    description: "A multimodal graph neural network that predicts compound bioactivity (pChEMBL) against cancer protein targets; test R² 0.386, reported as-is.",
    tech: ["PyTorch", "GNN (GIN)", "RDKit"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "HealthCore",
    description: "An autonomous healthcare agent platform for patient management, diagnostic analysis and clinical scheduling on local LLMs.",
    tech: ["Python", "Multi-agent", "Local LLMs"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "AlphaOracle",
    description: "A fine-tuned financial reasoning model with a quantization benchmark showing which precision is enough, built for an AMD MI300X hackathon.",
    tech: ["Fine-tuning", "Quantization", "AMD MI300X"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "RoutineIQ",
    description: "A smart timetable builder using Welsh-Powell and DSATUR graph colouring, with a local Llama 3 model for natural-language requests.",
    tech: ["Graph colouring", "Ollama", "Python"],
    category: "AI",
    year: "2026",
    local: true,
  },
  {
    name: "Object Risk Detection",
    description: "My first ML project: a Flask backend with a single-page camera dashboard that flags risky objects.",
    tech: ["Python", "Flask", "Computer vision"],
    category: "AI",
    year: "2025",
    local: true,
  },
  {
    name: "local-ai",
    description: "Experiments with running AI models locally.",
    tech: ["HTML", "JavaScript"],
    category: "AI",
    year: "2025",
    repo: "https://github.com/Dibya81/local-ai",
  },

  // ── Full-stack ──
  {
    name: "MIMO platform redesign",
    description: "A redesign of MIMO's kiosk platform with a FastAPI backend, a Raspberry Pi agent, print-recovery rules and a failure-case test matrix.",
    tech: ["Python", "FastAPI", "Raspberry Pi", "CUPS"],
    category: "Full-stack",
    year: "2026",
    repo: "https://github.com/Dibya81/mimo",
  },
  {
    name: "OM School Stationery",
    description: "An e-commerce platform for school stationery with customer, shopkeeper and admin roles.",
    tech: ["Node.js", "Express", "TypeScript", "MongoDB", "JWT"],
    category: "Full-stack",
    year: "2025",
    local: true,
  },
  {
    name: "projectSIH",
    description: "Health project for the Smart India Hackathon.",
    tech: ["HTML", "JavaScript"],
    category: "Full-stack",
    year: "2025",
    repo: "https://github.com/Dibya81/projectSIH",
  },
  {
    name: "aptops",
    description: "A web frontend backed by Supabase.",
    tech: ["Supabase", "JavaScript"],
    category: "Full-stack",
    year: "2025",
    repo: "https://github.com/Dibya81/aptops",
  },
  {
    name: "LibMaster",
    description: "A library management system built for coursework.",
    tech: ["Java", "Maven", "SQL"],
    category: "Full-stack",
    year: "2025",
    local: true,
  },

  // ── IoT & security ──
  {
    name: "SecureIoT",
    description: "A zero-trust industrial monitoring platform where every sensor packet is verified before it is acted on.",
    tech: ["IoT", "Zero trust", "Web dashboard"],
    category: "IoT",
    year: "2025",
    local: true,
  },
  {
    name: "Educational Body Scanner",
    description: "A camera-powered X-ray and ultrasound simulator that teaches children about the human body and healthy eating, built for Montessori and primary classrooms.",
    tech: ["JavaScript", "Camera", "Computer vision"],
    category: "Web",
    year: "2026",
    local: true,
  },
  {
    name: "Ares-X",
    description: "A prompt-injection security project with a FastAPI backend and a React frontend.",
    tech: ["FastAPI", "React", "Vite"],
    category: "Security",
    year: "2025",
    local: true,
  },

  // ── Web3 ──
  {
    name: "Aptos (original hackathon entry)",
    description: "The original team entry (team of four) for the Aptos agent-delegation hackathon; later rebuilt solo as Aptos Synapse.",
    tech: ["TypeScript", "Move", "Aptos"],
    category: "Web3",
    year: "2026",
    repo: "https://github.com/Dibya81/Aptos",
  },
  {
    name: "TruthMint",
    description: "Turns AI-generated claims into verifiable Knowledge NFTs anchored on the Flare Network to fight hallucinations.",
    tech: ["Solidity", "Flare", "React"],
    category: "Web3",
    year: "2026",
    local: true,
  },

  // ── Web ──
  {
    name: "Quire landing page",
    description: "A scroll-driven landing page for a print-cost estimation and document-intelligence product.",
    tech: ["React", "Vite", "Scroll animation"],
    category: "Web",
    year: "2026",
    local: true,
  },
  {
    name: "Hand-gesture experiments",
    description: "Browser demos controlled with hand gestures through the webcam.",
    tech: ["JavaScript", "Webcam"],
    category: "Web",
    year: "2025",
    local: true,
  },
  {
    name: "Earlier portfolios",
    description: "Previous versions of this portfolio.",
    tech: ["HTML", "CSS", "JavaScript"],
    category: "Web",
    year: "2025",
    repo: "https://github.com/Dibya81/my-fullstack-portfolio",
  },
];
