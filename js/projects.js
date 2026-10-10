/* projects.js — Fetch projects.json and render project cards */
'use strict';

function buildTechStack(tech) {
  return Object.entries(tech)
    .map(([, items]) => items.map(t => `<span class="tech-tag">${t}</span>`).join(''))
    .join('');
}

function buildFeatures(features) {
  return features.map(f => `<li>${f}</li>`).join('');
}

function buildCard(project) {
  const featuredBadge = project.featured
    ? `<span class="featured-badge">⭐ Featured</span>` : '';
  const flowHtml = project.flow
    ? `<div class="project-flow">⟶ ${project.flow}</div>` : '';
  const featuredClass = project.featured ? ' featured' : '';

  return `
    <div class="glass-card project-card${featuredClass} fade-up" data-tilt data-tilt-max="6" style="position:relative;overflow:visible">
      <div class="project-card-header">
        <div>
          ${featuredBadge}
          <h3 class="project-title">${project.title}</h3>
          <p class="project-subtitle">${project.subtitle}</p>
        </div>
        <div class="project-num">${String(project.id).padStart(2,'0')}</div>
      </div>
      <p class="project-desc">${project.description}</p>
      ${flowHtml}
      <ul class="features-list">${buildFeatures(project.features)}</ul>
      <div class="tech-stack">${buildTechStack(project.tech)}</div>
      <div class="project-links" style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${project.demo ? `<a href="${project.demo.startsWith('http') ? project.demo : 'https://' + project.demo}" target="_blank" rel="noopener" class="btn-link primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          Live Demo
        </a>` : ''}
        ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub
        </a>` : (!project.demo ? `<a href="https://github.com/Dibya81" target="_blank" rel="noopener" class="btn-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          GitHub
        </a>` : '')}
      </div>
    </div>`;
}

export async function initProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const res  = await fetch('./data/projects.json');
    const data = await res.json();

    container.innerHTML = `<div class="projects-grid stagger">${
      data.map(buildCard).join('')
    }</div>`;

    // Trigger fade-up after render
    requestAnimationFrame(() => {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
        });
      }, { threshold: 0.06 });
      container.querySelectorAll('.fade-up').forEach(el => io.observe(el));
    });
  } catch (err) {
    container.innerHTML = '<p class="muted">Could not load projects. Serve this site with a local server.</p>';
  }
}
