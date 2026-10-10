/* main.js — Orchestrates canvas, text scramble, tilt, particles, AOS, Lenis */
'use strict';

import { initNavigation } from './navigation.js';
import { initProjects }   from './projects.js';
import { initSkills }     from './skills.js';
import { initContact }    from './contact.js';

/* ═══════════════════════════════════════
   CANVAS / IMAGE SEQUENCE
═══════════════════════════════════════ */
const TOTAL_FRAMES = 120;
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas?.getContext('2d');
const images = new Array(TOTAL_FRAMES);
let currentFrame = 0;
let rafId        = null;

function frameSrc(i) {
  return `./sequence/frame_${String(i).padStart(3,'0')}_delay-0.066s.png`;
}

/* ═══════════════════════════════════════
   LIGHTBOX & GALLERIES
═══════════════════════════════════════ */
window.openLightbox = function(src, caption) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-caption');
  if (!lb || !lbImg) return;

  lbImg.src = src;
  lbCap.innerText = caption || '';
  lb.classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock scroll
};

window.closeLightbox = function() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = ''; // Unlock scroll
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ═══════════════════════════════════════
   VIDEO GALLERY INTERACTION
═══════════════════════════════════════ */
window.toggleVideo = function(container) {
  if (!container) return;
  const video = container.querySelector('video');
  if (!video) return;

  if (video.paused) {
    document.querySelectorAll('.video-item video').forEach(v => {
      if (v !== video) {
        v.pause();
        v.closest('.video-item')?.classList.remove('playing');
      }
    });
    video.play();
    container.classList.add('playing');
  } else {
    video.pause();
    container.classList.remove('playing');
  }
};

/* ═══════════════════════════════════════
   MARQUEE DRAG & PAUSE
═══════════════════════════════════════ */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  const outer = document.getElementById('marquee-outer');
  if (!track || !outer) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  outer.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('paused');
    startX = e.pageX - outer.offsetLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('paused');
  });

  outer.addEventListener('mouseleave', () => {
    if (!isDown) track.classList.remove('paused');
  });

  outer.addEventListener('mouseenter', () => {
    track.classList.add('paused');
  });

  outer.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    // Dragging logic could be added here if we want manual scrub,
    // but for now, hover/click pause is most intuitive.
  });
}

function drawFrame(img) {
  if (!img?.complete || !img.naturalWidth || !ctx) return;
  // ctx has ctx.scale(dpr,dpr) applied → drawing coords are in CSS pixels.
  // canvas.width/height are in physical pixels → divide by DPR to get CSS pixels.
  const dpr  = Math.min(window.devicePixelRatio || 1, 2);
  const cw   = canvas.width  / dpr;   // CSS pixel width
  const ch   = canvas.height / dpr;   // CSS pixel height
  const iw   = img.naturalWidth;
  const ih   = img.naturalHeight;
  const scale = Math.min(cw / iw, ch / ih); // contain: full image, no crop, no zoom
  const dw   = iw * scale;
  const dh   = ih * scale;
  const dx   = (cw - dw) / 2;         // center horizontally
  const dy   = (ch - dh) / 2;         // center vertically
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  drawFrame(images[currentFrame]);
}

function preloadImages(onProgress) {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = frameSrc(i);
    img.decoding = 'async';
    img.onload = img.onerror = () => {
      if (img.complete) images[i] = img;
      onProgress();
      if (i === 0 && img.complete) drawFrame(img);
    };
  }
}

/* ═══════════════════════════════════════
   TEXT SCRAMBLE EFFECT
═══════════════════════════════════════ */
const CHARS = '!<>-_\\/[]{}—=+*^?#@&%$01';

class TextScramble {
  constructor(el) {
    this.el = el;
    this.queue = [];
    this.frame = 0;
    this.resolve = null;
    this.frameRequest = null;
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    return new Promise(res => {
      this.resolve = res;
      this.queue = [];
      for (let i = 0; i < len; i++) {
        const from  = old[i] || '';
        const to    = newText[i] || '';
        const start = Math.floor(Math.random() * 30);
        const end   = start + Math.floor(Math.random() * 30);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
    });
  }
  update() {
    let output = '', complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = CHARS[Math.floor(Math.random() * CHARS.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:rgba(200,255,0,0.55)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frame++;
      this.frameRequest = requestAnimationFrame(this.update);
    }
  }
}

/* ═══════════════════════════════════════
   VANILLA TILT (3D Card Effect)
═══════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const maxTilt = parseFloat(card.dataset.tiltMax) || 10;
      const rx = (-y / (rect.height / 2)) * maxTilt;
      const ry = ( x / (rect.width  / 2)) * maxTilt;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;

      /* Glare */
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        glare.style.cssText = `
          position:absolute;inset:0;border-radius:inherit;pointer-events:none;
          background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 65%);
          transition:background 0.1s;z-index:2;
        `;
        card.style.position = card.style.position || 'relative';
        card.appendChild(glare);
      }
      const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      glare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.14) 0%, transparent 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glare = card.querySelector('.tilt-glare');
      if (glare) glare.style.background = 'transparent';
    });
    card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
    card.style.willChange = 'transform';
  });
}

/* ═══════════════════════════════════════
   PARTICLES (Cyber Aura behind About)
═══════════════════════════════════════ */
function initParticles() {
  const about = document.getElementById('about');
  if (!about) return;

  const c = document.createElement('canvas');
  c.style.cssText = `
    position:absolute;inset:0;width:100%;height:100%;
    pointer-events:none;z-index:0;opacity:0.35;
  `;
  about.style.position = 'relative';
  about.prepend(c);

  const ctx2  = c.getContext('2d');
  const N     = 55;
  const nodes = [];
  let W, H;

  function resize() {
    W = c.width  = about.offsetWidth;
    H = c.height = about.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  for (let i = 0; i < N; i++) {
    nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1,
    });
  }

  function tick() {
    ctx2.clearRect(0, 0, W, H);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      ctx2.beginPath();
      ctx2.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx2.fillStyle = '#c8ff00';
      ctx2.fill();
    });

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx2.beginPath();
          ctx2.moveTo(nodes[i].x, nodes[i].y);
          ctx2.lineTo(nodes[j].x, nodes[j].y);
          ctx2.strokeStyle = `rgba(200,255,0,${1 - dist/130})`;
          ctx2.lineWidth = 0.5;
          ctx2.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
}

/* ═══════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════ */
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.3;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
    btn.style.transition = 'transform 0.3s cubic-bezier(0.16,1,0.3,1)';
  });
}

/* ═══════════════════════════════════════
   SCROLL → CANVAS FRAME
═══════════════════════════════════════ */
function getScrollProgress() {
  const hero = document.getElementById('hero');
  if (!hero) return 0;
  const total = hero.offsetHeight - window.innerHeight;
  return Math.min(Math.max(-hero.getBoundingClientRect().top / total, 0), 1);
}

/* ═══════════════════════════════════════
   HERO OVERLAY
═══════════════════════════════════════ */
const heroSecs = {
  s1: { el: null, start: 0.0, end: 0.22 },
  s2: { el: null, start: 0.3, end: 0.55 },
  s3: { el: null, start: 0.6, end: 0.85 },
};

function inRange(p, s, e) {
  return p >= Math.max(0, s - 0.07) && p <= Math.min(1, e + 0.07);
}

function updateHeroOverlay(p) {
  Object.values(heroSecs).forEach(({ el, start, end }) => {
    if (!el) return;
    const visible = inRange(p, start, end);
    el.classList.toggle('visible', visible);
    const mid = (start + end) / 2;
    el.style.transform = visible
      ? `translateY(${((p - mid) / ((end - start) * 1.5)) * -26}px)`
      : 'translateY(24px)';
  });
}

/* ═══════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════ */
function hideLoader() {
  const ls = document.getElementById('loading-screen');
  if (ls) ls.classList.add('hidden');
}

/* ═══════════════════════════════════════
   MAIN INIT
═══════════════════════════════════════ */
async function init() {
  const loaderFill = document.querySelector('.loader-fill');

  /* Canvas */
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  let loaded = 0;
  preloadImages(() => {
    loaded++;
    const pct = loaded / TOTAL_FRAMES;
    if (loaderFill) loaderFill.style.width = (pct * 100) + '%';
    if (pct >= 1) setTimeout(hideLoader, 300);
  });

  /* Hero overlay sections */
  heroSecs.s1.el = document.getElementById('hsec1');
  heroSecs.s2.el = document.getElementById('hsec2');
  heroSecs.s3.el = document.getElementById('hsec3');
  if (heroSecs.s1.el) heroSecs.s1.el.classList.add('visible');

  /* Scroll handler */
  window.addEventListener('scroll', () => {
    const p = getScrollProgress();
    const frame = Math.min(Math.max(Math.round(p * (TOTAL_FRAMES - 1)), 0), TOTAL_FRAMES - 1);
    if (frame !== currentFrame) {
      currentFrame = frame;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => drawFrame(images[currentFrame]));
    }
    updateHeroOverlay(p);
  }, { passive: true });

  /* Text Scramble on hero name */
  const nameEl = document.getElementById('hero-name');
  if (nameEl) {
    const scrambler = new TextScramble(nameEl);
    const realName  = nameEl.dataset.text || 'Dibya Bhusal.';
    nameEl.innerText = realName;
    setTimeout(() => scrambler.setText(realName), 400);
  }

  /* Modules */
  initNavigation();
  await Promise.all([initProjects(), initSkills()]);
  initContact();
  /* Re-init tilt on dynamically rendered cards */
  requestAnimationFrame(() => initTilt());

  /* Post-render effects */
  requestAnimationFrame(() => {
    initTilt();
    initMagneticButtons();
    initParticles();

    /* AOS-style fade-up via IntersectionObserver */
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

    initMarquee();
  });
}

document.addEventListener('DOMContentLoaded', init);
