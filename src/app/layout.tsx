import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { profile, education } from "@/data/profile";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s — Dibya Bhusal" },
  description: siteDescription,
  applicationName: "Dibya Bhusal",
  authors: [{ name: profile.name, url: profile.links.github }],
  keywords: [
    "Dibya Bhusal",
    "software engineer",
    "multi-agent AI",
    "local LLM",
    "cybersecurity",
    "Web3",
    "Solana",
    "Aptos",
    "IoT",
    "FastAPI",
    "Next.js",
    "startup founder",
    "technical lead",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Dibya Bhusal",
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, creator: "@dibya_bhusal" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
    { media: "(prefers-color-scheme: light)", color: "#f2f1ed" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: "Software Engineer",
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.x],
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institution },
  knowsAbout: ["Multi-agent AI", "Cybersecurity", "Blockchain", "Internet of Things", "Machine learning"],
};

/**
 * Runs before first paint: picks the saved theme (or the OS preference) so
 * there is no flash, and marks JS as running so scroll-reveal styles apply.
 */
const themeScript = `(function(){var d=document.documentElement;var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.dataset.theme=t;d.classList.add("js")})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
