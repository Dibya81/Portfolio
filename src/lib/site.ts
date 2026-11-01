/**
 * Absolute site URL for metadata, sitemap and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL in production; Vercel's production URL is used
 * automatically when available.
 */
export const siteUrl: string =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const siteTitle = "Dibya Bhusal — Software Engineer";
export const siteDescription =
  "Dibya Bhusal builds systems that have to be trusted: on-prem multi-agent AI, honest ML, verifiable Web3 and safe edge devices. Explore projects, experience and contact.";
