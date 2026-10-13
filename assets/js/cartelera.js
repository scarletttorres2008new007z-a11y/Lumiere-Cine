/* ==========================================================================
   Lumière Ciné — Cartelera: días, tablero de funciones, filtros y vistas
   ========================================================================== */

document.addEventListener('lumiere:ready', () => {
  const { cartelera } = window.LUMIERE;
  const L = window.Lumiere;
  const esc = L.escapeHTML;

  const dayPicker = document.getElementById('day-picker');
  const board = document.getElementById('board');
  const grid = document.getElementById('movie-grid');
  const filters = document.getElementById('genre-filters');
  const search = document.getElementById('movie-search');
  const empty = document.getElementById('movie-empty');
  const boardView = document.getElementById('board-view');
  const posterView = document.getElementById('poster-view');

  const state = { genre: 'Todas', query: '', view: 'board' };

  document.querySelector('[data-stat="films"]').textContent = cartelera.length;
  document.querySelector('[data-stat="shows"]').textContent = cartelera.reduce((n, m) => n + m.horarios.length, 0);

  /* ---------------- Días ---------------- */
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
  const fmt = (opts, d) => new Intl.DateTimeFormat('es-SV', opts).format(d).replace('.', '');

  const renderDays = () => {
    const current = L.getDate().toDateString();
    dayPicker.innerHTML = days
      .map((d, i) => {
        const on = d.toDateString() === current;
        return `
        <button type="button" role="radio" aria-checked="${on}" data-day="${i}"
          class="day-stub ${on ? 'is-active' : ''}">
          <span class="text-[11px] font-bold uppercase tracking-[0.2em]">${i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : fmt({ weekday: 'short' }, d)}</span>
          <span class="font-display text-4xl leading-none">${d.getDate()}</span>
          <span class="text-[11px] uppercase tracking-wider opacity-70">${fmt({ month: 'short' }, d)}</span>
        </button>`;
      })
      .join('');
  };

  dayPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-day]');
    if (!btn) return;
    L.setDate(days[Number(btn.dataset.day)]);
    renderDays();
    renderBoard(true);
    markPastChips();
  });

  /* ---------------- Tablero ---------------- */
  const matches = (m) =>
    (state.genre === 'Todas' || m.generos.includes(state.genre)) && (!state.query || m.titulo.toLowerCase().includes(state.query));

  function availability(m, h) {
    const taken = L.occupiedSeats(m.id, h).size;
    const free = L.TOTAL_SEATS - taken;
    const pct = Math.round((taken / L.TOTAL_SEATS) * 100);
    if (L.isPast(h)) return { free, pct, label: 'Función iniciada', tone: 'muted', past: true };
    if (free <= 12) return { free, pct, label: `Últimos ${free} lugares`, tone: 'hot' };
    if (free <= 35) return { free, pct, label: `Quedan ${free} lugares`, tone: 'warm' };
    return { free, pct, label: `${free} lugares libres`, tone: 'ok' };
  }

  function renderBoard(flip = false) {
    document.querySelector('[data-board-date]').textContent = L.dateLabel();
    const shows = cartelera
      .filter(matches)
      .flatMap((m) => m.horarios.map((h) => ({ m, h, a: availability(m, h) })))
      .sort((x, y) => x.h.localeCompare(y.h));

    board.innerHTML = shows
      .map(({ m, h, a }, i) => {
        const bar = { hot: 'bg-carmine-500', warm: 'bg-gold-500', ok: 'bg-cream-100', muted: 'bg-ink-600' }[a.tone];
        const text = { hot: 'text-carmine-400', warm: 'text-gold-400', ok: 'text-cream-300', muted: 'text-muted' }[a.tone];
        return `
        <li class="grid grid-cols-[4.5rem_1fr] items-center gap-x-4 gap-y-3 px-5 py-5 transition hover:bg-ink-850 sm:px-6 md:grid-cols-[6rem_1fr_7rem_12rem_9rem] ${a.past ? 'opacity-50' : ''}">
          <span class="flap-time ${flip ? 'flip' : ''}" style="animation-delay:${i * 45}ms">${h.split('').map((c) => `<span>${c}</span>`).join('')}</span>
          <button type="button" class="flex min-w-0 items-center gap-4 text-left" data-detail="${m.id}">
            <img src="${m.poster}" alt="" class="hidden h-14 w-10 shrink-0 rounded object-cover sm:block">
            <span class="min-w-0">
              <span class="block truncate font-display text-xl text-cream-50 hover:text-carmine-400">${esc(m.titulo)}</span>
              <span class="block truncate text-xs text-muted">${m.generos.map(esc).join(' · ')}</span>
            </span>
          </button>
          <span class="col-start-2 text-sm text-cream-300 md:col-start-auto"><span class="md:hidden text-muted">Sala: </span>${esc(m.sala.replace('Sala ', ''))}</span>
          <span class="col-start-2 space-y-1.5 md:col-start-auto">
            <span class="block h-1.5 overflow-hidden rounded-full bg-ink-700"><span class="block h-full ${bar}" style="width:${a.pct}%"></span></span>
            <span class="block text-xs font-medium ${text}">${a.label}</span>
          </span>
          <span class="col-start-2 md:col-start-auto md:text-right">
            ${
              a.past
                ? '<span class="text-xs uppercase tracking-wider text-muted">Finalizada</span>'
                : `<button type="button" class="btn-primary btn-sm" data-buy="${m.id}" data-time="${h}">${L.money(L.priceFor(m))} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>`
            }
          </span>
        </li>`;
      })
      .join('');
    empty.hidden = shows.length > 0;
  }

  /* ---------------- Pósters ---------------- */
  function applyPosterFilter() {
    let visible = 0;
    grid.querySelectorAll('article').forEach((card) => {
      const show =
        (state.genre === 'Todas' || card.dataset.genres.split('|').includes(state.genre)) &&
        (!state.query || card.dataset.title.includes(state.query));
      card.hidden = !show;
      if (show) visible++;
    });
    if (state.view === 'posters') empty.hidden = visible > 0;
  }

  function markPastChips() {
    grid.querySelectorAll('.chip[data-time]').forEach((chip) => {
      const past = L.isPast(chip.dataset.time);
      chip.classList.toggle('line-through', past);
      chip.classList.toggle('opacity-40', past);
      chip.disabled = past;
    });
  }

  /* ---------------- Filtros y vista ---------------- */
  const genres = [...new Set(cartelera.flatMap((m) => m.generos))];
  filters.innerHTML = ['Todas', ...genres]
    .map((g) => `<button type="button" class="chip shrink-0" data-genre="${esc(g)}" aria-pressed="${g === state.genre}">${esc(g)}</button>`)
    .join('');

  const refresh = () => {
    renderBoard();
    applyPosterFilter();
  };

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-genre]');
    if (!btn) return;
    state.genre = btn.dataset.genre;
    filters.querySelectorAll('[data-genre]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    refresh();
  });

  document.querySelector('[data-clear]').addEventListener('click', () => {
    state.genre = 'Todas';
    state.query = '';
    search.value = '';
    filters.querySelectorAll('[data-genre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.genre === 'Todas')));
    refresh();
    search.focus();
  });

  search.addEventListener('input', () => {
    state.query = search.value.trim().toLowerCase();
    refresh();
  });

  document.querySelectorAll('[data-view]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      document.querySelectorAll('[data-view]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      boardView.hidden = state.view !== 'board';
      posterView.hidden = state.view !== 'posters';
      if (state.view === 'posters') L.initReveal(posterView);
      refresh();
    })
  );

  /* ---------------- Reloj ---------------- */
  const clock = document.querySelector('[data-clock]');
  const tick = () =>
    (clock.textContent = new Intl.DateTimeFormat('es-SV', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/El_Salvador' }).format(new Date()));
  tick();
  setInterval(tick, 15000);

  renderDays();
  renderBoard(true);
  markPastChips();
});
