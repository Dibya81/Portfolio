# Dibya Bhusal — Emerging Tech Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live_Demo-dibya81.github.io%2FPortfolio-c8ff00?style=for-the-badge&logo=githubpages&logoColor=black)](https://dibya81.github.io/Portfolio/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A scrollytelling personal portfolio website engineered with pure HTML5, Vanilla CSS, and modern ES Modules. Features a 120-frame canvas scroll animation, interactive certificate lightbox, live project showcase, and a 3D Spider-Man interactive experience.

---

## 🌐 Live Website

- **Production URL**: [https://dibya81.github.io/Portfolio/](https://dibya81.github.io/Portfolio/)
- **Alternate / Spider-Man View**: [https://dibya81.github.io/Portfolio/spider-porfolio-main/dist/index.html](https://dibya81.github.io/Portfolio/spider-porfolio-main/dist/index.html)

---

## ✨ Key Features

- **🎞️ Canvas Scrollytelling Sequence**: 120-frame animation synchronized to page scroll using high-performance HTML5 `<canvas>` and DPR scaling.
- **💎 Glassmorphic Dark UI**: Curated dark palette with neon cyber accents (`#c8ff00`), backdrop blur filters, smooth micro-interactions, and magnetic buttons.
- **📜 Interactive Certificate Marquee & Lightbox**: Auto-scrolling, drag-to-pause certificate carousel with high-resolution lightbox modal support (including keyboard `Escape` dismissal).
- **🚀 Dynamic Project Engine**: Asynchronously loads and renders projects from `data/projects.json` with multi-model AI tags, architecture flows, and live demo buttons.
- **⚡ Technical Skills Grid**: Dynamic skill categories loaded from `data/skills.json` spanning Languages, Web, Blockchain, Cybersecurity, IoT, and Dev Tools.
- **🏏 Extracurricular & Media Gallery**: High-res photography and video gallery highlighting state-level cricket representation and moments.
- **🕸️ Embedded 3D Spider-Man Experience**: Pre-built Three.js / React application accessible directly from the navbar and hero section.
- **📱 Responsive & Accessible Navigation**: Full desktop glass topbar and mobile sliding menu with active section scroll-spy.
- **☁️ Zero-Config Hosting**: Configured with `.nojekyll` and custom `404.html` for GitHub Pages, Vercel, and Netlify.

---

## 📁 Repository Structure

```
portfolio/
├── index.html                    # Main website entry point
├── 404.html                      # Custom 404 page for static hosts
├── .nojekyll                     # GitHub Pages Jekyll bypass flag
├── .gitignore                    # Git ignore file (excludes node_modules)
├── README.md                     # Documentation
├── css/
│   ├── style.css                 # Base variables, reset, typography
│   ├── layout.css                # Grid systems, sections, responsive rules
│   ├── components.css            # Glass cards, buttons, marquee, lightbox
│   └── animations.css            # Keyframes, fade-ups, glow effects
├── js/
│   ├── main.js                   # Canvas orchestration, tilt, lightbox, video controls
│   ├── navigation.js             # Nav scroll-spy, active states, mobile hamburger
│   ├── projects.js               # Fetches & renders data/projects.json
│   ├── skills.js                 # Fetches & renders data/skills.json
│   └── contact.js                # Contact interactions & clipboard helpers
├── data/
│   ├── projects.json             # Structured project portfolio data
│   └── skills.json               # Structured technical skill sets
├── sequence/                     # 120 frames for scroll-linked animation
│   └── frame_000_delay-0.066s.png ... frame_119_delay-0.066s.png
├── images/                       # Certificate scans and achievement awards
├── cricket/                      # Cricket match photos & MP4 video clips
├── photography/                  # High-resolution landscape and urban shots
├── resume/
│   └── Resume.pdf                # Downloadable / viewable resume
├── sections/                     # Modular HTML section components (reference)
└── spider-porfolio-main/         # Bonus 3D Three.js interactive portfolio
    └── dist/                     # Pre-bundled production build
```

---

## 🛠️ Tech Stack

- **Markup**: HTML5 (Semantic, accessible, SEO meta tags)
- **Styling**: Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism, Micro-animations)
- **Scripting**: Modern Vanilla JavaScript (ES Modules, Canvas API, IntersectionObserver, Async/Await)
- **Data Layer**: Clean decoupled JSON schemas (`projects.json`, `skills.json`)
- **Hosting**: GitHub Pages (Static hosting with zero build step required)

---

## 🚀 Running Locally

Because ES Modules and JSON `fetch()` requests require the HTTP protocol, run the project with any local web server:

### Option 1: Python (Built-in)
```bash
# Python 3
python3 -m http.server 8080
```

### Option 2: Node.js (npx)
```bash
# Using serve
npx serve .

# Or using live-server
npx live-server
```

### Option 3: VS Code
Install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.

Then open: `http://localhost:8080` (or the port displayed in your terminal).

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete scrollytelling portfolio ready for hosting"
   git branch -M main
   git remote add origin https://github.com/Dibya81/Portfolio.git
   git push -u origin main --force
   ```
2. In your GitHub repository:
   - Navigate to **Settings** → **Pages**
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**
   - Select branch: `main` / folder: `/ (root)`
   - Click **Save**
3. Your portfolio will be live at `https://dibya81.github.io/Portfolio/` in ~1-2 minutes!

---

## 🌟 Featured Projects Highlighted

1. **Consensus Bedrock Engine** — AWS Bedrock / Lambda / DynamoDB / React multi-agent consensus system.
2. **NeighborHealth AI** — Hyperlocal disease outbreak prediction platform (FastAPI, XGBoost, Supabase, Leaflet.js).
3. **Phantom (TRI-ZEROTRO)** — Autonomous trust ecosystem with LangGraph AI threat agents anchored on Solana.
4. **Aptos Synapse** — Decentralized AI Agent Delegation Protocol on the Aptos Blockchain.

---

## 📬 Contact & Connect

- **Name**: Dibya Bhusal
- **Email**: [dibyabhusal81@gmail.com](mailto:dibyabhusal81@gmail.com)
- **Phone**: [+91 9035504514](tel:+919035504514)
- **LinkedIn**: [linkedin.com/in/dibya-bhusal](https://www.linkedin.com/in/dibya-bhusal)
- **GitHub**: [github.com/Dibya81](https://github.com/Dibya81)
- **Location**: Surkhet, Nepal · Bengaluru, India

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to explore, learn from, and adapt the code for your own work.
