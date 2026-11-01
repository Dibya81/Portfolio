#!/usr/bin/env node
/**
 * Builds the one-page, ATS-friendly resume from src/data/resume.json.
 *
 *   npm run resume:build   → resume/Dibya_Bhusal_Resume.{html,pdf}
 *                            + public/resume/Dibya_Bhusal_Resume.pdf
 *
 * Layout rules (from resume research): single column, no tables,
 * no graphics or skill bars, standard section headings, real selectable text,
 * clickable links, A4, one page.
 *
 * Needs Google Chrome (or set CHROME_PATH). No npm dependencies.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "src/data/resume.json"), "utf8"));
const outDir = join(root, "resume");
const base = data.name.replace(/\s+/g, "_") + "_Resume";
const htmlPath = join(outDir, `${base}.html`);
const pdfPath = join(outDir, `${base}.pdf`);
const publicPdf = join(root, "public/resume", `${base}.pdf`);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const link = (l) => (l.href ? `<a href="${esc(l.href)}">${esc(l.label)}</a>` : esc(l.label));
const links = (ls = []) => ls.map(link).join(" · ");
const bullets = (bs) => `<ul>${bs.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(data.name)} — Resume</title>
<meta name="author" content="${esc(data.name)}">
<meta name="description" content="${esc(data.title)}">
<style>
  @page { size: A4; margin: 10mm 12.5mm 9mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { margin: 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 9.4pt; line-height: 1.28; color: #111; }
  a { color: inherit; text-decoration: none; }
  h1 { font-size: 21pt; margin: 0; letter-spacing: 0.2px; }
  .title { font-size: 10.5pt; margin: 1px 0 3px; color: #333; }
  .contact { font-size: 9pt; color: #222; }
  .contact a { color: #1a4fb4; }
  h2 { font-size: 10.2pt; text-transform: uppercase; letter-spacing: 0.9px; margin: 7px 0 2.5px; padding-bottom: 1.5px; border-bottom: 0.8px solid #111; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .row b { font-size: 10pt; }
  .right { white-space: nowrap; font-size: 9pt; color: #222; }
  .sub { font-style: italic; color: #333; font-size: 9pt; }
  .sub a, .links a { color: #1a4fb4; font-style: normal; }
  .entry { margin-top: 4px; break-inside: avoid; }
  ul { margin: 1.5px 0 0; padding-left: 13px; }
  li { margin: 0.5px 0; }
  p { margin: 0; }
  .skills p { margin: 1px 0; }
</style>
</head>
<body>
<header>
  <h1>${esc(data.name)}</h1>
  <p class="title">${esc(data.title)}</p>
  <p class="contact">${links(data.contact)}</p>
</header>

<h2>Summary</h2>
<p>${esc(data.summary)}</p>

<h2>Education</h2>
${data.education
  .map(
    (e) => `<div class="entry">
  <div class="row"><b>${esc(e.school)}</b><span class="right">${esc(e.period)}</span></div>
  <div class="row"><span>${esc(e.degree)}</span><span class="right">${esc(e.location)}</span></div>
  ${e.detail ? `<p class="sub">${esc(e.detail)}</p>` : ""}
</div>`,
  )
  .join("")}

<h2>Experience</h2>
${data.experience
  .map(
    (x) => `<div class="entry">
  <div class="row"><b>${esc(x.role)} — ${esc(x.org)}</b><span class="right">${esc(x.period)}</span></div>
  <div class="row"><span class="sub">${esc(x.context)}${x.links?.length ? " " + links(x.links) : ""}</span><span class="right">${esc(x.location)}</span></div>
  ${bullets(x.bullets)}
</div>`,
  )
  .join("")}

<h2>Projects</h2>
${data.projects
  .map(
    (p) => `<div class="entry">
  <div class="row"><span><b>${esc(p.name)}</b> <span class="sub">| ${esc(p.stack)}</span></span><span class="right links">${links(p.links)}</span></div>
  ${bullets(p.bullets)}
</div>`,
  )
  .join("")}

<h2>Technical Skills</h2>
<div class="skills">${data.skills.map((s) => `<p><b>${esc(s.group)}:</b> ${esc(s.items)}</p>`).join("")}</div>

<h2>Achievements</h2>
${bullets(data.achievements)}
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(htmlPath, html);

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = chromeCandidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome not found; wrote HTML only:", htmlPath);
  process.exit(1);
}

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--user-data-dir=${join(outDir, ".chrome")}`,
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ],
  { stdio: "ignore" },
);
mkdirSync(dirname(publicPdf), { recursive: true });
copyFileSync(pdfPath, publicPdf);
console.log(`HTML ${htmlPath}\nPDF  ${pdfPath} (${(statSync(pdfPath).size / 1024).toFixed(0)} KB)\nCopy ${publicPdf}`);
