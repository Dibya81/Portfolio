# Dibya Bhusal — Portfolio ("Dibee Universe")

A cinematic, hybrid-3D developer portfolio: readable HTML content in front of one persistent WebGL universe. Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Three.js · React Three Fiber**.

> **The portrait opens into a universe.** The visit starts inside a scroll-driven portrait sequence; when it ends the frame recedes and the camera flies out into seven stations — Gateway, Core, Laboratory, Project Universe, Foundry, Archive, Connection — while all text, links and case studies stay in accessible, server-rendered HTML.

## Highlights

- **One WebGL canvas** for the whole experience, rendered **on demand** (zero frames when idle), code-split and loaded after first paint — deferred until first interaction on phones.
- **Preserved effects**
  - the original **scroll-driven portrait sequence** (now 2.2 MB of WebP instead of 64 MB of PNG, progressively loaded — no blocking loader);
  - the original **Spider-Man shader reveal**, ported into the shared canvas and repurposed as a *product ↔ architecture* reveal on project showcases (CSS fallback without WebGL, keyboard toggle for everyone).
- **Verified content only** — every project claim traces to its repository; team projects and simulated results are labelled.
- **Routes:** `/` · `/projects` (filterable) · `/projects/[slug]` (18 static case studies) · `/resume` · custom 404 · `sitemap.xml` · `robots.txt` · generated Open Graph image.
- **Accessibility:** skip link, landmarks, native `<dialog>` menus (Escape + focus trap), keyboard shortcut `M`, WCAG AA contrast, full `prefers-reduced-motion` mode, functional without WebGL.

## Run locally

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # production build (static)
npm start          # serve the production build
npm run lint       # ESLint (next/core-web-vitals + TypeScript)
npm run typecheck  # tsc --noEmit
npm run resume:build  # regenerate the one-page resume PDF from src/data/resume.json
```

Requires Node.js 20+.

## Project structure

```
src/
  app/          layout, home, projects/, projects/[slug]/, resume/, not-found, sitemap, robots, OG image
  components/
    universe/   UniverseRoot (capability gate) · UniverseCanvas (the one canvas) · CameraRig · Stations · Starfield · RevealLayer · Backdrop
    effects/    ExperienceProvider · PreservedScroll · RevealSlot · revealShaders
    navigation/ HUD · WorldMenu · ScrollProgress · WorldHint
    sections/   Gateway · Core · Laboratory · Projects · Foundry · Archive · Connection
    projects/   ProjectShowcase · ProjectCard · ProjectDetail · ArchitectureDiagram · ProjectFilter
    ui/         shared primitives
  data/         profile · projects · skills · experience · navigation   ← edit content here
  lib/          experience-store (single scroll source of truth) · image-sequence · reveal-registry · capabilities · site
public/         sequence/{desktop,mobile} · projects/ · experience/ · certificates/ · life/ · resume/Dibya_Bhusal_Resume.pdf
legacy/         the previous static site and the Spider-Man prototype (reference only; not built)
```

## Editing content

All content lives in `src/data/`. To update the resume PDF, replace `public/resume/Dibya_Bhusal_Resume.pdf`. The internship role and dates are left `undefined` in `src/data/experience.ts` until confirmed; undefined fields are simply not rendered.

## Deploy (Vercel)

1. Import the repository in Vercel (framework is detected as Next.js; `vercel.json` pins it).
2. Set `NEXT_PUBLIC_SITE_URL` to the final domain (used for canonical URLs, sitemap and Open Graph). Without it, Vercel's production URL is used automatically.
3. Deploy. No secrets or API tokens are needed — project data is a local, verified manifest.

> The previous GitHub Pages setup served the static site from the repo root; that site now lives in `legacy/`. GitHub Pages can't run this app as-is — use Vercel (or add `output: "export"` with unoptimized images for a purely static export).

## Contact

[dibyabhusal81@gmail.com](mailto:dibyabhusal81@gmail.com) · [github.com/Dibya81](https://github.com/Dibya81) · [linkedin.com/in/dibya-bhusal-72401b215](https://www.linkedin.com/in/dibya-bhusal-72401b215)

## License

[MIT](LICENSE)
