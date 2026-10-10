/* contact.js — Contact form copy-to-clipboard helpers */
'use strict';

export function initContact() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async () => {
      const text = el.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
        const orig = el.textContent;
        el.textContent = 'Copied!';
        setTimeout(() => { el.textContent = orig; }, 1500);
      } catch {}
    });
  });
}
