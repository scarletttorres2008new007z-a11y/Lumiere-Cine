/* ==========================================================================
   Lumière Ciné — Galería: cinta de película, hoja de contactos y visor
   ========================================================================== */

document.addEventListener('lumiere:ready', () => {
  const reel = document.getElementById('reel');
  const sheet = document.getElementById('gallery');
  const filters = document.getElementById('gallery-filters');
  const box = document.getElementById('lightbox');
  if (!reel || !sheet || !box) return;

  const photos = window.LUMIERE.galeria;
  const esc = Lumiere.escapeHTML;
  const pad = (n) => String(n).padStart(2, '0');
  let current = 0;
  let order = photos.map((_, i) => i); // índices visibles en el visor

  /* ---------------- Cinta ---------------- */
  reel.innerHTML = photos
    .map(
      (p, i) => `
      <li class="w-[78vw] shrink-0 snap-center sm:w-[30rem]">
        <button type="button" class="group block w-full text-left" data-open="${i}">
          <span class="relative block overflow-hidden rounded-md bg-ink-800">
            <img src="${p.src}" alt="${esc(p.alt)}" ${i > 2 ? 'loading="lazy"' : ''} class="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105">
          </span>
          <span class="mt-2 flex items-baseline justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold-400">
            <span>Fotograma ${pad(i + 1)}</span><span class="truncate text-muted">${esc(p.titulo)}</span>
          </span>
        </button>
      </li>`
    )
    .join('');

  document.querySelector('[data-reel-total]').textContent = pad(photos.length);
  const pos = document.querySelector('[data-reel-pos]');
  const bar = document.querySelector('[data-reel-bar]');
  const updateBar = () => {
    const max = reel.scrollWidth - reel.clientWidth;
    const ratio = max > 0 ? reel.scrollLeft / max : 0;
    bar.style.width = `${Math.max(4, ratio * 100)}%`;
    pos.textContent = pad(Math.min(photos.length, Math.round(ratio * (photos.length - 1)) + 1));
  };
  reel.addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  document.querySelectorAll('[data-reel]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const frame = reel.querySelector('li');
      reel.scrollBy({ left: Number(btn.dataset.reel) * (frame.offsetWidth + 12), behavior: 'smooth' });
    })
  );

  // Arrastrar con el mouse
  let drag = null;
  reel.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    drag = { x: e.clientX, left: reel.scrollLeft, moved: false };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) {
      drag.moved = true;
      reel.classList.add('is-dragging');
    }
    reel.scrollLeft = drag.left - dx;
  });
  window.addEventListener('pointerup', () => {
    if (drag?.moved) reel.dataset.justDragged = '1';
    drag = null;
    reel.classList.remove('is-dragging');
    setTimeout(() => delete reel.dataset.justDragged, 50);
  });

  /* ---------------- Hoja de contactos ---------------- */
  const cats = ['Todas', ...new Set(photos.map((p) => p.categoria))];
  let active = 'Todas';

  filters.innerHTML = cats
    .map((c) => `<button type="button" class="chip shrink-0" data-cat="${esc(c)}" aria-pressed="${c === active}">${esc(c)}</button>`)
    .join('');

  const renderSheet = () => {
    order = photos.map((_, i) => i).filter((i) => active === 'Todas' || photos[i].categoria === active);
    // La primera foto ocupa 2x2 y la última se estira para que la cuadrícula cierre sin huecos
    const big = order.length > 3;
    const cells = order.length + (big ? 3 : 0);
    const lgRest = cells % 4;
    const smRest = cells % 2;
    var spanFor = (k) => {
      if (k === 0 && big) return 'col-span-2 row-span-2';
      if (k !== order.length - 1) return '';
      return [smRest ? 'col-span-2' : '', ['', 'lg:col-span-4', 'lg:col-span-3', 'lg:col-span-2'][lgRest]].join(' ');
    };
    sheet.innerHTML = order
      .map(
        (i, k) => `
        <li class="reveal ${spanFor(k)}" style="transition-delay:${(k % 4) * 60}ms">
          <button type="button" class="group relative block h-full w-full overflow-hidden rounded-lg bg-ink-800" data-open="${i}">
            <img src="${photos[i].src}" alt="${esc(photos[i].alt)}" loading="lazy" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">
            <span class="absolute left-2 top-2 rounded bg-cream-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink-950">${pad(i + 1)}</span>
            <span class="absolute inset-x-0 bottom-0 translate-y-full bg-ink-950 p-3 text-left transition duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <span class="block text-[10px] font-bold uppercase tracking-[0.2em] text-carmine-400">${esc(photos[i].categoria)}</span>
              <span class="block truncate font-display text-lg text-cream-50">${esc(photos[i].titulo)}</span>
            </span>
          </button>
        </li>`
      )
      .join('');
    Lumiere.initReveal(sheet);
  };

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    active = btn.dataset.cat;
    filters.querySelectorAll('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    renderSheet();
  });
  renderSheet();

  /* ---------------- Visor ---------------- */
  box.querySelector('[data-lb-total]').textContent = photos.length;

  const show = (i) => {
    current = (i + photos.length) % photos.length;
    const p = photos[current];
    const img = box.querySelector('[data-lb-img]');
    img.src = p.src;
    img.alt = p.alt;
    box.querySelector('[data-lb-cat]').textContent = p.categoria;
    box.querySelector('[data-lb-title]').textContent = p.titulo;
    box.querySelector('[data-lb-text]').textContent = p.texto;
    box.querySelector('[data-lb-index]').textContent = current + 1;
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open]');
    if (!btn || reel.dataset.justDragged) return;
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
