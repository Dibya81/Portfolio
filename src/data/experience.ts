import type { ExperienceEntry } from "@/types";

/**
 * MIMO (Vision Printt Technologies). Joined as IoT Hardware Intern (offer letter,
 * 8 Sep 2026); promoted to Technical Lead after getting the down kiosks working
 * again by fixing the backend and the Pi print listener (stated by Dibya).
 * Every problem below traces to a commit by Dibya81 in the production
 * repository (snowjug/mimo-test-dep2) or to the incident reports written
 * during the internship. Figures are quoted from those commits/reports.
 */
export const mimoInternship: ExperienceEntry = {
  organization: "MIMO",
  legalName: "Vision Printt Technologies",
  kind: "Startup · joined as IoT Hardware Intern, Sep 2026 · promoted to Technical Lead",
  role: "Technical Lead",
  period: "Sep 2026 - present",
  location: "Bengaluru",
  summary:
    "MIMO runs self-service print kiosks on college campuses. Students upload a file from their phone, pay by UPI, and a Raspberry Pi inside the kiosk prints it when they type a 4-digit code.",
  story:
    "I joined as an IoT hardware intern. When the kiosks stopped working, I fixed the backend end to end and reworked the Pi print listener, and was promoted to Technical Lead. I now own the production system: the Pi listener, the Firebase backend, payments and refunds, security and CI.",
  highlights: [
    { value: "2", label: "print kiosks live on campuses" },
    { value: "125 → 2", label: "simultaneous downloads on a 1 GB Pi" },
    { value: "~7k", label: "requests/hour at the lunch peak" },
    { value: "534", label: "backend tests passing" },
  ],
  links: [
    { label: "printmimo.tech", href: "https://printmimo.tech" },
    { label: "Production repository", href: "https://github.com/snowjug/mimo-test-dep2" },
  ],
  fixes: [
    { title: "Kiosk lag", line: "Capped 125 parallel downloads to 2 on a 1 GB Pi." },
    { title: "Wrong file at pickup", line: "Atomic print codes, one job at a time." },
    { title: "Refunds", line: "Every failed print refunded exactly once." },
    { title: "Security", line: "Closed an auth bypass, locked down public data rules." },
  ],
  problems: [
    { title: "Kiosk lag", body: "traced it to 125 downloads running at once on a 1 GB Raspberry Pi and capped it at 2, with cache cleanup and 15 regression tests." },
    { title: "Wrong file at pickup", body: "two customers could get the same print code; made code allocation atomic and the Pi print one job at a time." },
    { title: "False refunds", body: "slow CUPS answers no longer count as printer failures; raised API capacity from 10 to 50 instances for a ~7,000 requests/hour lunch peak." },
    { title: "Payments", body: "each failed print is refunded exactly once, and the Cashfree webhook is signature-verified and idempotent." },
    { title: "Production outages", body: "restored uploads, the 12 lost payment and WhatsApp settings, and Office-file conversion after a bad deploy." },
    { title: "Security", body: "closed an auth bypass, removed hardcoded secrets, locked down public Firestore/Storage rules and fixed 13 audit findings." },
    { title: "Team", body: "lead engineering for 10 contributors, with CI/CD deploy gates, secret scanning, coverage checks and code-review rules." },
  ],
  stack: [
    "Raspberry Pi · Python listener",
    "CUPS · lpstat",
    "Firebase Cloud Functions (Node 22, Express 5)",
    "Cloud Firestore · Storage",
    "React · Vite",
    "Cloud Run (LibreOffice converter)",
    "Cashfree · WhatsApp Cloud API",
    "GitHub Actions",
  ],
  screenshots: [],
};
