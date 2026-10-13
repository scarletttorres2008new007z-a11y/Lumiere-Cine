/* ==========================================================================
   Lumière Ciné — Galería y visor de imágenes
   ========================================================================== */

document.addEventListener('lumiere:ready', () => {
  const list = document.getElementById('gallery');
  const box = document.getElementById('lightbox');
  if (!list || !box) return;

  const photos = window.LUMIERE.galeria;
  const esc = Lumiere.escapeHTML;
  let current = 0;

  document.getElementById('gallery-count').textContent = photos.length;
  box.querySelector('[data-lb-total]').textContent = photos.length;

  list.innerHTML = photos
    .map(
      (p, i) => `
      <li class="reveal break-inside-avoid" style="transition-delay:${(i % 3) * 80}ms">
        <button type="button" class="group relative block w-full overflow-hidden rounded-2xl bg-ink-800 text-left" data-open="${i}">
          <img src="${p.src}" alt="${esc(p.alt)}" loading="lazy" class="w-full transition duration-700 group-hover:scale-105">
          <span class="absolute inset-x-0 bottom-0 translate-y-2 bg-ink-950/85 p-5 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <span class="block font-display text-xl text-cream-50">${esc(p.titulo)}</span>
            <span class="block text-sm text-cream-300">${esc(p.texto)}</span>
          </span>
        </button>
      </li>`
    )
    .join('');

  const show = (i) => {
    current = (i + photos.length) % photos.length;
    const p = photos[current];
    const img = box.querySelector('[data-lb-img]');
    img.src = p.src;
    img.alt = p.alt;
    box.querySelector('[data-lb-title]').textContent = p.titulo;
    box.querySelector('[data-lb-text]').textContent = p.texto;
    box.querySelector('[data-lb-index]').textContent = current + 1;
  };

  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open]');
    if (!btn) return;
    show(Number(btn.dataset.open));
    box.showModal();
    document.body.classList.add('overflow-hidden');
  });

  box.addEventListener('click', (e) => {
    const step = e.target.closest('[data-lb-step]');
    if (step) return show(current + Number(step.dataset.lbStep));
    if (e.target.closest('[data-lb-close]')) box.close();
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  // Deslizar en pantallas táctiles
  let startX = null;
  box.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  box.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  box.addEventListener('close', () => document.body.classList.remove('overflow-hidden'));
});
