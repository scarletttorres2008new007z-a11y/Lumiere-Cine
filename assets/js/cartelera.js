/* ==========================================================================
   Lumière Ciné — Filtros de la cartelera
   ========================================================================== */

document.addEventListener('lumiere:ready', () => {
  const grid = document.getElementById('movie-grid');
  const filters = document.getElementById('genre-filters');
  const search = document.getElementById('movie-search');
  const empty = document.getElementById('movie-empty');
  if (!grid || !filters) return;

  const genres = [...new Set(window.LUMIERE.cartelera.flatMap((m) => m.generos))];
  let active = 'Todas';

  filters.innerHTML = ['Todas', ...genres]
    .map((g) => `<button type="button" class="chip shrink-0" data-genre="${Lumiere.escapeHTML(g)}" aria-pressed="${g === active}">${Lumiere.escapeHTML(g)}</button>`)
    .join('');

  const apply = () => {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    grid.querySelectorAll('article').forEach((card) => {
      const matchGenre = active === 'Todas' || card.dataset.genres.split('|').includes(active);
      const matchText = !q || card.dataset.title.includes(q);
      const show = matchGenre && matchText;
      card.hidden = !show;
      if (show) visible++;
    });
    empty.hidden = visible > 0;
  };

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-genre]');
    if (!btn) return;
    active = btn.dataset.genre;
    filters.querySelectorAll('[data-genre]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    apply();
  });

  search.addEventListener('input', apply);
});
