import type { SkillGroup } from "@/types";

/**
 * Skills are listed with the projects whose repositories show them in use.
 * "mimo" links to the MIMO experience in the Foundry section.
 */
export const languages = ["Python", "TypeScript", "JavaScript", "Java", "SQL", "C", "C++", "Move", "Kotlin"];

export const skillGroups: SkillGroup[] = [
  {
    id: "agents",
    title: "AI & agents",
    summary: "Multi-agent systems that run locally, show their reasoning and stop when they're unsure.",
    skills: [
      { name: "Multi-agent orchestration", evidence: ["project-117", "aptos-synapse", "phantom", "stockrescue"] },
      { name: "Local LLMs with Ollama", evidence: ["project-117", "aptos-synapse", "consensus-engine", "cyberwatch"] },
      { name: "LangGraph", evidence: ["phantom", "stockrescue", "mediflow"] },
      { name: "Retrieval (LanceDB · BM25 · pgvector)", evidence: ["project-117", "phantom"] },
      { name: "Prompt-injection defense", evidence: ["project-117", "aptos-synapse"] },
      { name: "AWS Bedrock", evidence: ["mediflow"] },
    ],
  },
  {
    id: "data",
    title: "ML & data",
    summary: "Real data, leakage-free evaluation and numbers that survive a re-run.",
    skills: [
      { name: "Time-series forecasting & backtesting", evidence: ["neighborhealth"] },
      { name: "Conformal intervals · SHAP", evidence: ["neighborhealth"] },
      { name: "OCR & document pipelines", evidence: ["neighborhealth", "kavach", "documentvault"] },
      { name: "Anomaly detection (scikit-learn)", evidence: ["cyberwatch", "aipas"] },
      { name: "Computer vision (OpenCV · YOLO)", evidence: ["kavach", "sitesentinel"] },
    ],
  },
  {
    id: "backend",
    title: "Backend & data stores",
    summary: "APIs with state machines, idempotency and migrations — the boring parts that keep money and machines safe.",
    skills: [
      { name: "FastAPI", evidence: ["project-117", "neighborhealth", "phantom", "stockrescue", "documentvault"] },
      { name: "Node.js · Express", evidence: ["mimo", "consensus-engine", "aptos-synapse", "nutriscan"] },
      { name: "Firebase · Firestore · Cloud Functions", evidence: ["mimo"] },
      { name: "Payments & idempotent webhooks (Cashfree)", evidence: ["mimo"] },
      { name: "SQLAlchemy · Alembic", evidence: ["project-117", "costty", "aipas"] },
      { name: "PostgreSQL · Supabase", evidence: ["documentvault", "costty", "stockrescue", "kavach"] },
      { name: "SQLite (WAL) · Redis · DynamoDB", evidence: ["project-117", "consensus-engine"] },
      { name: "MQTT", evidence: ["sitesentinel", "cyberwatch", "aipas"] },
    ],
  },
  {
    id: "frontend",
    title: "Frontend & 3D",
    summary: "Interfaces from field apps to 3D digital twins.",
    skills: [
      { name: "React · Next.js · TypeScript", evidence: ["project-117", "neighborhealth", "mimo"] },
      { name: "Three.js · React Three Fiber", evidence: ["stockrescue", "cybercloud", "aipas"] },
      { name: "Tailwind CSS", evidence: ["project-117", "costty", "cybercloud"] },
      { name: "Kotlin · Jetpack Compose", evidence: ["project-117"] },
      { name: "Monorepos (pnpm · Turborepo)", evidence: [] },
    ],
  },
  {
    id: "security",
    title: "Security",
    summary: "Fail closed, verify server-side, keep an audit trail.",
    skills: [
      { name: "RBAC & permission-aware retrieval", evidence: ["project-117"] },
      { name: "Firestore / Storage rules hardening", evidence: ["mimo"] },
      { name: "Hash-chained audit logs · Ed25519 signing", evidence: ["project-117", "sitesentinel"] },
      { name: "Default-deny egress", evidence: ["project-117"] },
      { name: "Threat intel feeds (HIBP · NVD · CERT-In)", evidence: ["phantom"] },
      { name: "IIoT intrusion detection", evidence: ["cyberwatch"] },
      { name: "Nmap · Wireshark · Kali Linux", evidence: [] },
    ],
  },
  {
    id: "web3",
    title: "Web3",
    summary: "On-chain records where verifiability actually matters.",
    skills: [
      { name: "Solana · Anchor", evidence: ["phantom"] },
      { name: "Aptos · Move", evidence: ["aptos-synapse"] },
      { name: "IPFS", evidence: ["phantom"] },
      { name: "Stellar", evidence: ["stellar-balance-checker"] },
    ],
  },
  {
    id: "hardware",
    title: "Hardware & ops",
    summary: "Edge devices, printers and the pipelines that ship them.",
    skills: [
      { name: "Raspberry Pi · CUPS", evidence: ["mimo"] },
      { name: "ESP32", evidence: ["aipas"] },
      { name: "Docker", evidence: ["project-117", "neighborhealth"] },
      { name: "GitHub Actions CI/CD", evidence: ["mimo", "neighborhealth", "stockrescue"] },
      { name: "Prometheus · Grafana", evidence: ["project-117"] },
    ],
  },
];
