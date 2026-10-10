/* navigation.js — Top navbar: active state, scroll style, hamburger */
'use strict';

/* ── Text Scramble (re-exported for use on section headings) ── */
const CHARS = '!<>-_\\/[]{}—=+*^?#@&%$01';
export class TextScramble {
  constructor(el) {
    this.el = el; this.queue = []; this.frame = 0;
    this.resolve = null; this.frameRequest = null;
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const len = Math.max(old.length, newText.length);
    return new Promise(res => {
      this.resolve = res; this.queue = [];
      for (let i = 0; i < len; i++) {
        const from = old[i] || '', to = newText[i] || '';
        const start = Math.floor(Math.random() * 20);
        const end   = start + Math.floor(Math.random() * 22);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0; this.update();
    });
  }
  update() {
    let output = '', complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) { complete++; output += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = CHARS[Math.floor(Math.random() * CHARS.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:rgba(200,255,0,0.55)">${char}</span>`;
      } else { output += from; }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) { this.resolve(); }
    else { this.frame++; this.frameRequest = requestAnimationFrame(this.update); }
  }
}

export function initNavigation() {
  const topbar     = document.getElementById('topbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks   = document.querySelectorAll('[data-target]');
  const sections   = document.querySelectorAll('section[id]');
  const progressBar = document.getElementById('progress-bar');

  /* ── Set active nav link ── */
  function setActive(id) {
    navLinks.forEach(el => el.classList.toggle('active', el.dataset.target === id));
  }

  /* ── Scroll: glass topbar + progress + Home fix ── */
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    topbar?.classList.toggle('scrolled', scrolled);
    if (progressBar) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / total * 100) + '%';
    }
    /* Force "Home" active when near top (hero is a div, not a section) */
    if (window.scrollY < window.innerHeight * 0.3) setActive('hero');
  }, { passive: true });

  /* ── Hamburger ── */
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open', open);
  });
  mobileMenu?.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  /* ── Smooth scroll on nav click ── */
  navLinks.forEach(el => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.dataset.target);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Active link via IntersectionObserver (for non-hero sections) ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => io.observe(s));

  /* ── Scramble effect on section h2 titles on scroll into view ── */
  const scrambleIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.scrambled) return;
      el.dataset.scrambled = '1';
      const real = el.textContent.trim();
      new TextScramble(el).setText(real);
      scrambleIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.section-title').forEach(el => scrambleIO.observe(el));
}

