/* skills.js — Fetch skills.json and render skill category cards */
'use strict';

export async function initSkills() {
  const container = document.getElementById('skills-container');
  if (!container) return;

  try {
    const res  = await fetch('./data/skills.json');
    const data = await res.json();

    container.innerHTML = `<div class="skills-grid stagger">${
      data.map(cat => `
        <div class="glass-card skill-category-card fade-up">
          <div class="skill-cat-header">
            <span class="skill-icon">${cat.icon}</span>
            <span class="skill-cat-name">${cat.category}</span>
          </div>
          <div class="skill-tags">
            ${cat.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        </div>`).join('')
    }</div>`;

    requestAnimationFrame(() => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08 });
      container.querySelectorAll('.fade-up').forEach(el => io.observe(el));
    });
  } catch (err) {
    container.innerHTML = '<p class="muted">Could not load skills. Serve this site with a local server.</p>';
  }
}
