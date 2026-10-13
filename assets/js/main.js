/* ==========================================================================
   Lumière Ciné — Script común a todas las páginas
   - Cabecera, pie de página y telón de entrada
   - Ventanas emergentes: ficha de película, compra con selección de
     asientos, avisos de estreno, membresías y compra rápida
   - Animaciones al hacer scroll, cuentas regresivas y avisos (toast)
   ========================================================================== */

(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const DATA = window.LUMIERE || { cartelera: [], proximos: [], precios: {}, redes: {}, planes: {} };

  const PAGES = [
    { id: 'inicio', href: 'index.html', label: 'Inicio' },
    { id: 'cartelera', href: 'cartelera.html', label: 'Cartelera' },
    { id: 'galeria', href: 'galeria.html', label: 'Galería' },
    { id: 'nosotros', href: 'nosotros.html', label: 'Nosotros' },
    { id: 'autores', href: 'autores.html', label: 'Autores' },
    { id: 'membresia', href: 'membresia.html', label: 'Membresía' },
    { id: 'contacto', href: 'contacto.html', label: 'Contacto' },
  ];

  const SOCIAL_ICONS = { Facebook: 'fa-facebook-f', Instagram: 'fa-instagram', X: 'fa-x-twitter', YouTube: 'fa-youtube', TikTok: 'fa-tiktok' };

  const esc = (str) =>
    String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => `$${n.toFixed(2)}`;
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const priceFor = (movie) => DATA.precios?.[movie.sala] ?? 7.5;
  const findMovie = (id) => [...DATA.cartelera, ...DATA.proximos].find((m) => m.id === id);
  const trailerURL = (movie) => `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.titulo + ' tráiler oficial español')}`;
  const ticketCode = () => 'LC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  // Fecha elegida para comprar (por defecto hoy). La página de cartelera la cambia.
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  let buyDate = startOfDay(new Date());
  const isSameDay = (a, b) => a.toDateString() === b.toDateString();
  const dateLabel = (d = buyDate) => {
    const t = isSameDay(d, new Date())
      ? 'Hoy, ' + new Intl.DateTimeFormat('es-SV', { day: 'numeric', month: 'long' }).format(d)
      : new Intl.DateTimeFormat('es-SV', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
    return t.charAt(0).toUpperCase() + t.slice(1);
  };
  const todayLabel = () => dateLabel();

  // Hora actual en San Salvador, en formato HH:MM
  const nowHHMM = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/El_Salvador' }).format(new Date());
  // Una función ya empezó si es hoy y su hora pasó
  const isPast = (time, d = buyDate) => isSameDay(d, new Date()) && time <= nowHHMM();

  const logo = `
    <a href="index.html" class="group inline-flex items-baseline gap-1.5" aria-label="Lumière Ciné, ir al inicio">
      <span class="font-display text-2xl tracking-wide text-cream-50">Lumière</span>
      <span class="font-display text-2xl italic text-carmine-500">ciné</span>
    </a>`;

  /* ------------------------------------------------------------------------
     Cabecera
     ------------------------------------------------------------------------ */
  function renderHeader(current) {
    const slot = document.querySelector('[data-component="header"]');
    if (!slot) return;

    const links = PAGES.map(
      (p) => `<li><a class="nav-link" href="${p.href}"${p.id === current ? ' aria-current="page"' : ''}>${p.label}</a></li>`
    ).join('');

    const mobileLinks = PAGES.map(
      (p, i) => `
        <li>
          <a href="${p.href}" class="group flex items-center gap-5 border-b border-ink-700 py-4 font-display text-3xl ${
            p.id === current ? 'text-carmine-500' : 'text-cream-50'
          }"${p.id === current ? ' aria-current="page"' : ''}>
            <span class="w-6 font-sans text-xs font-semibold text-muted">0${i + 1}</span>${p.label}
            <i class="fa-solid fa-arrow-right ml-auto text-base text-muted transition group-hover:translate-x-1" aria-hidden="true"></i>
          </a>
        </li>`
    ).join('');

    slot.outerHTML = `
      <a href="#contenido" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-cream-100 focus:px-4 focus:py-2 focus:text-ink-950">Saltar al contenido</a>
      <header id="site-header" class="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300">
        <nav class="container-site flex h-20 items-center justify-between gap-6" aria-label="Principal">
          ${logo}
          <ul class="hidden items-center gap-7 lg:flex">${links}</ul>
          <div class="flex items-center gap-3">
            <button type="button" class="btn-primary btn-sm hidden sm:inline-flex" data-quickbuy>
              <i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas
            </button>
            <button id="menu-toggle" type="button" class="grid h-11 w-11 place-items-center rounded-full border border-ink-600 text-cream-100 transition hover:border-cream-100 lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">
              <i class="fa-solid fa-bars" aria-hidden="true"></i>
            </button>
          </div>
        </nav>
        <div id="mobile-menu" class="fixed inset-0 top-20 z-40 overflow-y-auto bg-ink-950 lg:hidden" hidden>
          <ul class="container-site pb-8 pt-4">${mobileLinks}</ul>
          <div class="container-site pb-10">
            <button type="button" class="btn-primary w-full" data-quickbuy><i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas</button>
          </div>
        </div>
      </header>`;

    const header = document.getElementById('site-header');
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');

    const setSolid = () => {
      const solid = window.scrollY > 24 || !menu.hidden || document.body.dataset.header === 'solid';
      header.classList.toggle('bg-ink-950', solid);
      header.classList.toggle('border-ink-700', solid);
    };

    const setMenu = (open) => {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      toggle.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}" aria-hidden="true"></i>`;
      document.body.classList.toggle('overflow-hidden', open);
      setSolid();
    };

    toggle.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', (e) => e.target.closest('[data-quickbuy]') && setMenu(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) setMenu(false);
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setMenu(false));
    window.addEventListener('scroll', setSolid, { passive: true });
    setSolid();
  }

  /* ------------------------------------------------------------------------
     Pie de página
     ------------------------------------------------------------------------ */
  function renderFooter() {
    const slot = document.querySelector('[data-component="footer"]');
    if (!slot) return;

    const social = Object.entries(DATA.redes || {})
      .map(
        ([name, url]) => `
        <a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="grid h-10 w-10 place-items-center rounded-full border border-ink-600 text-cream-300 transition hover:border-carmine-500 hover:bg-carmine-500 hover:text-white" aria-label="${esc(name)}">
          <i class="fa-brands ${SOCIAL_ICONS[name] || 'fa-link'}" aria-hidden="true"></i>
        </a>`
      )
      .join('');

    const nav = PAGES.map((p) => `<li><a class="text-muted transition hover:text-cream-50" href="${p.href}">${p.label}</a></li>`).join('');

    slot.outerHTML = `
      <footer class="relative overflow-hidden border-t border-ink-700 bg-ink-900">
        <div class="filmstrip" aria-hidden="true"></div>
        <div class="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div class="space-y-5">
            ${logo}
            <p class="max-w-xs text-sm leading-relaxed text-muted">Un cine de autor en San Salvador. Estrenos, clásicos y una experiencia que se siente.</p>
            <div class="flex flex-wrap gap-2.5">${social}</div>
          </div>
          <div>
            <h2 class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-cream-300">Explorar</h2>
            <ul class="grid gap-3 text-sm">${nav}</ul>
          </div>
          <div>
            <h2 class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-cream-300">Visítanos</h2>
            <ul class="grid gap-3 text-sm text-muted">
              <li><a class="flex gap-3 hover:text-cream-50" href="contacto.html#encuentranos"><i class="fa-solid fa-location-dot mt-1 text-carmine-500" aria-hidden="true"></i>San Salvador, El Salvador</a></li>
              <li class="flex gap-3"><i class="fa-solid fa-clock mt-1 text-carmine-500" aria-hidden="true"></i>Lun a Dom, 14:00 a 00:00</li>
              <li><a class="flex gap-3 hover:text-cream-50" href="tel:+50321000000"><i class="fa-solid fa-phone mt-1 text-carmine-500" aria-hidden="true"></i>+503 2100-0000</a></li>
              <li><a class="flex gap-3 hover:text-cream-50" href="mailto:contacto@lumierecine.sv"><i class="fa-solid fa-envelope mt-1 text-carmine-500" aria-hidden="true"></i>contacto@lumierecine.sv</a></li>
            </ul>
          </div>
          <div>
            <h2 class="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-cream-300">Gaceta mensual</h2>
            <p class="mb-4 text-sm text-muted">Estrenos, funciones especiales y beneficios. Nos vemos en la oscuridad.</p>
            <form class="flex flex-col gap-2 sm:flex-row" data-newsletter novalidate>
              <label for="footer-email" class="sr-only">Correo electrónico</label>
              <input id="footer-email" type="email" name="email" placeholder="tu@correo.com" class="input rounded-full" autocomplete="email" required>
              <button type="submit" class="btn-primary shrink-0">Suscribirme</button>
            </form>
          </div>
        </div>
        <div class="container-site">
          <button type="button" class="next-show group" data-next-show></button>
          <p class="footer-word" aria-hidden="true">Lumière <span class="italic text-carmine-500">ciné</span></p>
        </div>
        <div class="border-t border-ink-700">
          <div class="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
            <p>&copy; ${new Date().getFullYear()} Lumière Ciné. Todos los derechos reservados.</p>
            <a href="#" class="inline-flex items-center gap-2 hover:text-cream-50" data-top>Volver arriba <i class="fa-solid fa-arrow-up" aria-hidden="true"></i></a>
          </div>
        </div>
      </footer>
      <div id="toast-region" class="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite"></div>`;

    // Próxima función de hoy (o la primera de mañana)
    const nextBtn = document.querySelector('[data-next-show]');
    const shows = DATA.cartelera.flatMap((m) => m.horarios.map((h) => ({ m, h }))).sort((a, b) => a.h.localeCompare(b.h));
    const today = new Date();
    const next = shows.find(({ h }) => !isPast(h, today));
    const show = next || shows[0];
    if (show) {
      const inner = `
        <span class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400"><span class="h-2 w-2 animate-pulse rounded-full bg-gold-400"></span>${next ? 'Próxima función hoy' : 'Primera función de mañana'}</span>
        <span class="font-display text-2xl text-cream-50 sm:text-3xl"><span class="font-mono text-xl text-carmine-400 sm:text-2xl">${show.h}</span> ${esc(show.m.titulo)}</span>
        <span class="ml-auto hidden items-center gap-2 text-sm font-semibold text-cream-300 transition group-hover:text-white sm:inline-flex">${next ? 'Aparta tu butaca' : 'Ver funciones'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>`;
      nextBtn.outerHTML = next
        ? `<button type="button" class="next-show group" data-buy="${show.m.id}" data-time="${show.h}">${inner}</button>`
        : `<a href="cartelera.html" class="next-show group">${inner}</a>`;
    } else nextBtn.remove();

    document.querySelector('[data-top]').addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     Avisos (toast)
     ------------------------------------------------------------------------ */
  function toast(message, icon = 'fa-circle-check') {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const el = document.createElement('div');
    el.className =
      'pointer-events-auto flex items-center gap-3 rounded-full border border-ink-600 bg-cream-100 px-5 py-3 text-sm font-medium text-ink-950 shadow-2xl animate-rise';
    el.innerHTML = `<i class="fa-solid ${icon} text-carmine-500" aria-hidden="true"></i><span>${esc(message)}</span>`;
    region.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }

  function initNewsletter() {
    document.querySelectorAll('[data-newsletter]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!isEmail(input.value.trim())) {
          input.classList.add('has-error');
          input.focus();
          toast('Escribe un correo válido', 'fa-circle-exclamation');
          return;
        }
        input.classList.remove('has-error');
        form.reset();
        toast('Listo. Te llegará nuestra próxima gaceta.');
      });
    });
  }

  /* ------------------------------------------------------------------------
     Ventana emergente reutilizable
     ------------------------------------------------------------------------ */
  const modal = document.createElement('dialog');
  modal.className = 'dialog';
  modal.setAttribute('aria-labelledby', 'modal-title');

  function openModal(html, { wide = false } = {}) {
    if (!modal.isConnected) document.body.appendChild(modal);
    modal.classList.toggle('dialog-wide', wide);
    modal.innerHTML = html;
    if (!modal.open) {
      modal.showModal();
      document.body.classList.add('overflow-hidden');
    }
    modal.scrollTop = 0;
    modal.querySelector('[autofocus]')?.focus();
  }

  const closeBtn = `
    <button type="button" class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-600 text-cream-300 transition hover:border-cream-100 hover:text-white" data-close aria-label="Cerrar">
      <i class="fa-solid fa-xmark" aria-hidden="true"></i>
    </button>`;

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-close]')) modal.close();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('overflow-hidden');
    modal.innerHTML = '';
  });

  const successBlock = (title, text, extra = '') => `
    <div class="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
      <span class="grid h-16 w-16 place-items-center rounded-full bg-carmine-500 text-2xl text-white"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
      <h2 id="modal-title" class="font-display text-3xl text-cream-50">${title}</h2>
      <p class="max-w-sm text-sm leading-relaxed text-muted">${text}</p>
      ${extra}
      <button type="button" class="btn-light mt-2" data-close>Cerrar</button>
    </div>`;

  /* ------------------------------------------------------------------------
     Ficha de película
     ------------------------------------------------------------------------ */
  function openDetail(movie) {
    const now = Boolean(movie.horarios);
    const genres = movie.generos.map((g) => `<span class="tag">${esc(g)}</span>`).join('');
    const times = now
      ? movie.horarios.map((h) => `<button type="button" class="chip" data-buy="${movie.id}" data-time="${h}">${h}</button>`).join('')
      : '';

    openModal(
      `
      <div class="grid sm:grid-cols-[15rem_1fr]">
        <img src="${movie.poster}" alt="Póster de ${esc(movie.titulo)}" class="aspect-[2/3] h-full w-full object-cover sm:rounded-l-2xl">
        <div class="flex flex-col gap-5 p-6 sm:p-8">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-3">
              <p class="eyebrow">${now ? 'En cartelera' : 'Próximo estreno'}</p>
              <h2 id="modal-title" class="font-display text-4xl leading-none text-cream-50">${esc(movie.titulo)}</h2>
            </div>
            ${closeBtn}
          </div>
          <div class="flex flex-wrap gap-1.5">${genres}</div>
          ${
            now
              ? `<dl class="grid grid-cols-2 gap-4 border-y border-ink-700 py-4 text-sm">
                   <div><dt class="label">Sala</dt><dd class="mt-1 text-cream-50">${esc(movie.sala)}</dd></div>
                   <div><dt class="label">Entrada</dt><dd class="mt-1 text-cream-50">${money(priceFor(movie))}</dd></div>
                 </dl>
                 <div><p class="label mb-3">Funciones de hoy</p><div class="flex flex-wrap gap-2">${times}</div></div>`
              : `<div class="border-y border-ink-700 py-4 text-sm text-cream-300">${
                  movie.estreno ? `Estreno el <strong class="text-cream-50">${formatDate(movie.estreno)}</strong>.` : 'Fecha de estreno por confirmar.'
                } Activa el aviso y te escribimos cuando abra la preventa.</div>`
          }
          <div class="mt-auto flex flex-wrap gap-3">
            ${
              now
                ? `<button type="button" class="btn-primary" data-buy="${movie.id}"><i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas</button>`
                : `<button type="button" class="btn-primary" data-notify="${movie.id}"><i class="fa-solid fa-bell" aria-hidden="true"></i> Avísame del estreno</button>`
            }
            <a href="${trailerURL(movie)}" target="_blank" rel="noopener noreferrer" class="btn-ghost"><i class="fa-solid fa-play" aria-hidden="true"></i> Ver tráiler</a>
          </div>
        </div>
      </div>`,
      { wide: true }
    );
  }

  /* ------------------------------------------------------------------------
     Compra de entradas: función, asientos, datos y boleto
     ------------------------------------------------------------------------ */
  const ROWS = 'ABCDEFGH'.split('');
  const COLS = 12;
  const buy = { movie: null, time: null, qty: 2, seats: [], name: '', email: '' };

  // Asientos ocupados "aleatorios" pero estables para cada función
  function occupiedSeats(movieId, time, d = buyDate) {
    let seed = [...(movieId + time + d.toDateString())].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296);
    // Las funciones nocturnas y del fin de semana se llenan más
    const late = Number(time.slice(0, 2)) >= 19 ? 0.25 : 0;
    const weekend = [0, 5, 6].includes(d.getDay()) ? 0.15 : 0;
    const rate = Math.min(0.92, 0.15 + rand() * 0.45 + late + weekend);
    const set = new Set();
    ROWS.forEach((r) => {
      for (let c = 1; c <= COLS; c++) if (rand() < rate) set.add(r + c);
    });
    return set;
  }
  const TOTAL_SEATS = ROWS.length * COLS;

  const steps = ['Función', 'Asientos', 'Datos', 'Boleto'];
  const stepper = (n) => `
    <ol class="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
      ${steps
        .map(
          (s, i) => `<li class="flex items-center gap-2 ${i <= n ? 'text-cream-50' : 'text-muted'}">
            <span class="grid h-6 w-6 place-items-center rounded-full ${i < n ? 'bg-carmine-500 text-white' : i === n ? 'border border-carmine-500 text-carmine-400' : 'border border-ink-600'}">${i < n ? '<i class="fa-solid fa-check text-[10px]" aria-hidden="true"></i>' : i + 1}</span>
            <span class="hidden sm:inline">${s}</span>
          </li>${i < steps.length - 1 ? '<li class="h-px flex-1 bg-ink-600" aria-hidden="true"></li>' : ''}`
        )
        .join('')}
    </ol>`;

  const buyHeader = (n) => `
    <div class="space-y-5 border-b border-ink-700 p-6">
      <div class="flex items-start gap-4">
        <img src="${buy.movie.poster}" alt="" class="h-20 w-[3.4rem] shrink-0 rounded-md object-cover">
        <div class="min-w-0 flex-1">
          <h2 id="modal-title" class="truncate font-display text-2xl leading-tight text-cream-50">${esc(buy.movie.titulo)}</h2>
          <p class="mt-1 text-sm text-muted">${esc(buy.movie.sala)} · ${todayLabel()}${buy.time ? ' · ' + buy.time : ''}</p>
        </div>
        ${closeBtn}
      </div>
      ${stepper(n)}
    </div>`;

  const buyFooter = (label, action, enabled, back) => `
    <div class="flex items-center justify-between gap-4 rounded-b-2xl border-t border-ink-700 bg-ink-850 p-6">
      <div>
        <p class="label">Total</p>
        <p class="font-display text-3xl text-cream-50">${money(buy.qty * priceFor(buy.movie))}</p>
      </div>
      <div class="flex gap-2">
        ${back ? `<button type="button" class="btn-ghost" data-step="${back}" aria-label="Volver"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>` : ''}
        <button type="${action === 'submit' ? 'submit' : 'button'}" class="btn-primary" ${action !== 'submit' ? `data-step="${action}"` : ''} ${enabled ? '' : 'disabled'}>
          ${label} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>`;

  function buyStep1() {
    const m = buy.movie;
    openModal(`
      ${buyHeader(0)}
      <div class="space-y-7 p-6">
        <fieldset>
          <legend class="label mb-3">Elige el horario</legend>
          ${
            m.horarios.every((h) => isPast(h))
              ? `<p class="mb-3 rounded-xl border border-ink-700 bg-ink-850 p-4 text-sm text-cream-300">Las funciones de hoy ya comenzaron. <a href="cartelera.html" class="font-semibold text-carmine-400 underline">Elige otro día en la cartelera</a>.</p>`
              : ''
          }
          <div class="grid grid-cols-3 gap-2">
            ${m.horarios
              .map(
                (h) =>
                  isPast(h)
                    ? `<span class="chip cursor-not-allowed justify-center py-3 text-sm line-through opacity-40" title="Función iniciada">${h}</span>`
                    : `<button type="button" class="chip justify-center py-3 text-sm" data-pick-time="${h}" aria-pressed="${h === buy.time}">${h}</button>`
              )
              .join('')}
          </div>
        </fieldset>
        <div class="flex items-center justify-between">
          <div>
            <p class="label">Entradas</p>
            <p class="mt-1 text-sm text-muted">${money(priceFor(m))} c/u</p>
          </div>
          <div class="flex items-center gap-1 rounded-full border border-ink-600 p-1">
            <button type="button" class="grid h-10 w-10 place-items-center rounded-full hover:bg-ink-800" data-qty="-1" aria-label="Quitar una entrada"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
            <output class="w-8 text-center text-lg font-semibold" aria-live="polite">${buy.qty}</output>
            <button type="button" class="grid h-10 w-10 place-items-center rounded-full hover:bg-ink-800" data-qty="1" aria-label="Agregar una entrada"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>
      ${buyFooter('Elegir asientos', 'seats', Boolean(buy.time))}
    `);
  }

  function buyStep2() {
    const taken = occupiedSeats(buy.movie.id, buy.time);
    const seat = (id) => {
      if (taken.has(id)) return `<span class="seat seat-taken" aria-hidden="true"></span>`;
      const on = buy.seats.includes(id);
      return `<button type="button" class="seat${on ? ' seat-on' : ''}" data-seat="${id}" aria-pressed="${on}" aria-label="Asiento ${id}"></button>`;
    };
    const rows = ROWS.map(
      (r) => `
        <div class="flex items-center gap-1.5 sm:gap-2">
          <span class="w-4 text-center text-[11px] font-semibold text-muted">${r}</span>
          ${Array.from({ length: COLS }, (_, i) => seat(r + (i + 1)) + (i === 2 || i === 8 ? '<span class="w-2 sm:w-4"></span>' : '')).join('')}
          <span class="w-4 text-center text-[11px] font-semibold text-muted">${r}</span>
        </div>`
    ).join('');
    const left = buy.qty - buy.seats.length;

    openModal(
      `
      ${buyHeader(1)}
      <div class="space-y-6 p-6">
        <div class="mx-auto w-11/12">
          <div class="screen"></div>
          <p class="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.4em] text-muted">Pantalla</p>
        </div>
        <div class="overflow-x-auto pb-2"><div class="mx-auto flex w-max flex-col gap-1.5 sm:gap-2">${rows}</div></div>
        <div class="flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <div class="flex gap-4">
            <span class="flex items-center gap-2"><span class="seat pointer-events-none"></span>Libre</span>
            <span class="flex items-center gap-2"><span class="seat seat-on pointer-events-none"></span>Tu elección</span>
            <span class="flex items-center gap-2"><span class="seat seat-taken"></span>Ocupado</span>
          </div>
          <p class="font-semibold ${left ? 'text-carmine-400' : 'text-cream-50'}">${
        left ? `Elige ${left} ${left === 1 ? 'asiento más' : 'asientos más'}` : 'Asientos: ' + buy.seats.join(', ')
      }</p>
        </div>
      </div>
      ${buyFooter('Continuar', 'data', left === 0, 'time')}
    `,
      { wide: true }
    );
  }

  function buyStep3() {
    openModal(`
      <form data-buy-form novalidate>
        ${buyHeader(2)}
        <div class="space-y-5 p-6">
          <div class="rounded-xl border border-ink-700 bg-ink-850 p-4 text-sm text-cream-300">
            ${buy.qty} ${buy.qty === 1 ? 'entrada' : 'entradas'} · Asientos <strong class="text-cream-50">${buy.seats.join(', ')}</strong>
          </div>
          <div class="field"><label class="label" for="buy-name">Nombre completo</label><input class="input" id="buy-name" name="fullname" autocomplete="name" value="${esc(buy.name)}" autofocus><span class="error-msg"></span></div>
          <div class="field"><label class="label" for="buy-email">Email para tu boleto</label><input class="input" id="buy-email" name="email" type="email" autocomplete="email" value="${esc(buy.email)}"><span class="error-msg"></span></div>
          <p class="flex items-center gap-2 text-xs text-muted"><i class="fa-solid fa-lock" aria-hidden="true"></i> Pagas en taquilla al presentar tu código.</p>
        </div>
        ${buyFooter('Confirmar compra', 'submit', true, 'seats')}
      </form>
    `);
  }

  function buyStep4() {
    const code = ticketCode();
    const m = buy.movie;
    openModal(
      `
      <div class="space-y-6 p-6 sm:p-8">
        <div class="flex items-center justify-between">
          ${stepper(3)}
        </div>
        <div class="text-center">
          <h2 id="modal-title" class="font-display text-3xl text-cream-50">¡Tu función está lista!</h2>
          <p class="mt-1 text-sm text-muted">Enviamos una copia a ${esc(buy.email)}</p>
        </div>
        <article class="ticket relative mx-auto max-w-md" aria-label="Boleto">
          <span class="stamp" aria-hidden="true">Admitido</span>
          <div class="flex gap-4 p-5">
            <img src="${m.poster}" alt="" class="h-28 w-[4.7rem] shrink-0 rounded-md object-cover">
            <div class="min-w-0 space-y-1">
              <p class="text-[11px] font-bold uppercase tracking-[0.25em] text-carmine-600">Lumière Ciné</p>
              <p class="font-display text-2xl leading-tight">${esc(m.titulo)}</p>
              <p class="text-sm text-ink-600">${esc(buy.name)}</p>
            </div>
          </div>
          <div class="ticket-tear"></div>
          <dl class="grid grid-cols-4 gap-2 p-5 text-center">
            <div><dt class="text-[10px] font-bold uppercase tracking-wider text-ink-600">Sala</dt><dd class="font-semibold">${esc(m.sala.replace('Sala ', ''))}</dd></div>
            <div><dt class="text-[10px] font-bold uppercase tracking-wider text-ink-600">Hora</dt><dd class="font-semibold">${buy.time}</dd></div>
            <div class="col-span-2"><dt class="text-[10px] font-bold uppercase tracking-wider text-ink-600">Asientos</dt><dd class="font-semibold">${buy.seats.join(' ')}</dd></div>
          </dl>
          <div class="flex items-center justify-between gap-4 bg-ink-950 px-5 py-4 text-cream-50">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-wider text-muted">Código</p>
              <p class="font-mono text-lg tracking-[0.25em]">${code}</p>
            </div>
            <div class="barcode" aria-hidden="true"></div>
          </div>
        </article>
        <div class="flex flex-wrap justify-center gap-3">
          <button type="button" class="btn-primary" data-print><i class="fa-solid fa-download" aria-hidden="true"></i> Guardar boleto</button>
          <button type="button" class="btn-ghost" data-close>Listo</button>
        </div>
      </div>`
    );
  }

  function startBuy(movie, time) {
    if (time && isPast(time)) time = null;
    Object.assign(buy, { movie, time: time || null, qty: buy.movie === movie ? buy.qty : 2, seats: [] });
    buyStep1();
  }

  modal.addEventListener('click', (e) => {
    const t = e.target.closest('[data-pick-time]');
    if (t) {
      buy.time = t.dataset.pickTime;
      buy.seats = [];
      return buyStep1();
    }
    const q = e.target.closest('[data-qty]');
    if (q) {
      buy.qty = Math.min(8, Math.max(1, buy.qty + Number(q.dataset.qty)));
      buy.seats = [];
      return buyStep1();
    }
    const s = e.target.closest('[data-seat]');
    if (s) {
      const id = s.dataset.seat;
      if (buy.seats.includes(id)) buy.seats = buy.seats.filter((x) => x !== id);
      else if (buy.seats.length < buy.qty) buy.seats = [...buy.seats, id];
      else buy.seats = [...buy.seats.slice(1), id];
      return buyStep2();
    }
    const step = e.target.closest('[data-step]');
    if (step && !step.disabled) {
      const form = modal.querySelector('[data-buy-form]');
      if (form) {
        buy.name = form.elements.fullname.value;
        buy.email = form.email.value;
      }
      return { time: buyStep1, seats: buyStep2, data: buyStep3 }[step.dataset.step]?.();
    }
    if (e.target.closest('[data-print]')) window.print();
  });

  // Estado de carga en el botón antes de mostrar el resultado
  function busy(form, label = 'Procesando') {
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return Promise.resolve();
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${label}`;
    return new Promise((r) =>
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        r();
      }, 900)
    );
  }

  modal.addEventListener('submit', async (e) => {
    const form = e.target;
    e.preventDefault();
    if (form.dataset.busy) return;

    if (form.matches('[data-buy-form]')) {
      buy.name = form.elements.fullname.value.trim();
      buy.email = form.email.value.trim();
      const okName = setFieldError(form.elements.fullname, buy.name ? '' : 'Escribe tu nombre');
      const okMail = setFieldError(form.email, isEmail(buy.email) ? '' : 'Escribe un email válido');
      if (!okName || !okMail) return form.querySelector('.has-error').focus();
      form.dataset.busy = '1';
      await busy(form, 'Apartando butacas');
      buyStep4();
    }

    if (form.matches('[data-notify-form]')) {
      const email = form.email.value.trim();
      if (!setFieldError(form.email, isEmail(email) ? '' : 'Escribe un email válido')) return form.email.focus();
      form.dataset.busy = '1';
      await busy(form, 'Activando');
      const id = form.dataset.notifyForm;
      setNotify([...new Set([...getNotify(), id])]);
      refreshNotifyButtons();
      openModal(successBlock('Aviso activado', `Te escribiremos a <strong class="text-cream-100">${esc(email)}</strong> en cuanto abra la preventa de ${esc(findMovie(id).titulo)}.`));
    }

    if (form.matches('[data-member-form]')) {
      const name = form.elements.fullname.value.trim();
      const email = form.email.value.trim();
      const okName = setFieldError(form.elements.fullname, name ? '' : 'Escribe tu nombre');
      const okMail = setFieldError(form.email, isEmail(email) ? '' : 'Escribe un email válido');
      if (!okName || !okMail) return form.querySelector('.has-error').focus();
      form.dataset.busy = '1';
      await busy(form, 'Creando tu tarjeta');
      const plan = DATA.planes[form.dataset.memberForm];
      const number = Array.from({ length: 4 }, () => String(Math.floor(1000 + Math.random() * 9000))).join(' ');
      openModal(
        successBlock(
          `Ya eres ${esc(plan.nombre)}`,
          `Tu membresía ya está activa. Enviamos los detalles a <strong class="text-cream-100">${esc(email)}</strong>.`,
          `<div class="member-card member-${form.dataset.memberForm} my-2 w-full max-w-sm text-left">
             <div class="flex items-start justify-between">
               <p class="font-display text-2xl">Lumière <span class="italic">ciné</span></p>
               <p class="text-xs font-bold uppercase tracking-[0.25em]">${esc(plan.nombre)}</p>
             </div>
             <p class="mt-10 font-mono text-lg tracking-[0.2em]">${number}</p>
             <div class="mt-3 flex items-end justify-between text-xs">
               <p class="font-semibold uppercase tracking-wider">${esc(name)}</p>
               <p class="opacity-80">Miembro desde ${new Date().getFullYear()}</p>
             </div>
           </div>`
        )
      );
    }
  });

  function setFieldError(input, message) {
    input.classList.toggle('has-error', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    const msg = input.closest('.field')?.querySelector('.error-msg');
    if (msg) msg.textContent = message;
    return !message;
  }

  /* ------------------------------------------------------------------------
     Compra rápida (desde la cabecera)
     ------------------------------------------------------------------------ */
  function openQuickBuy() {
    openModal(
      `
      <div class="flex items-start justify-between gap-4 border-b border-ink-700 p-6">
        <div class="space-y-2">
          <p class="eyebrow">Compra rápida</p>
          <h2 id="modal-title" class="font-display text-3xl text-cream-50">¿Qué quieres ver hoy?</h2>
        </div>
        ${closeBtn}
      </div>
      <ul class="divide-y divide-ink-700">
        ${DATA.cartelera
          .map(
            (m) => `
          <li>
            <button type="button" class="group flex w-full items-center gap-4 p-5 text-left transition hover:bg-ink-850" data-buy="${m.id}">
              <img src="${m.poster}" alt="" class="h-20 w-[3.4rem] shrink-0 rounded-md object-cover">
              <span class="min-w-0 flex-1">
                <span class="block font-display text-xl text-cream-50">${esc(m.titulo)}</span>
                <span class="mt-1 block text-sm text-muted">${esc(m.sala)} · ${m.horarios.join(' · ')}</span>
              </span>
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-600 text-cream-300 transition group-hover:border-carmine-500 group-hover:bg-carmine-500 group-hover:text-white"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
            </button>
          </li>`
          )
          .join('')}
      </ul>`
    );
  }

  /* ------------------------------------------------------------------------
     Avisos de estreno
     ------------------------------------------------------------------------ */
  const NOTIFY_KEY = 'lumiere:avisos';
  function getNotify() {
    try {
      return JSON.parse(localStorage.getItem(NOTIFY_KEY)) || [];
    } catch {
      return [];
    }
  }
  function setNotify(list) {
    try {
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
    } catch {
      /* almacenamiento no disponible */
    }
  }

  function notifyButtonHTML(on) {
    return `<i class="fa-solid ${on ? 'fa-check' : 'fa-bell'}" aria-hidden="true"></i><span>${on ? 'Te avisaremos' : 'Avísame del estreno'}</span>`;
  }

  function refreshNotifyButtons() {
    const list = getNotify();
    document.querySelectorAll('[data-notify-card]').forEach((btn) => {
      const on = list.includes(btn.dataset.notify);
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('btn-light', on);
      btn.classList.toggle('btn-ghost', !on);
      btn.innerHTML = notifyButtonHTML(on);
    });
  }

  function openNotify(movie) {
    if (getNotify().includes(movie.id)) {
      setNotify(getNotify().filter((x) => x !== movie.id));
      refreshNotifyButtons();
      if (modal.open) modal.close();
      return toast('Aviso cancelado', 'fa-bell-slash');
    }
    openModal(`
      <form class="space-y-6 p-6 sm:p-8" data-notify-form="${movie.id}" novalidate>
        <div class="flex items-start gap-4">
          <img src="${movie.poster}" alt="" class="h-24 w-16 shrink-0 rounded-md object-cover">
          <div class="flex-1 space-y-2">
            <p class="eyebrow">Aviso de estreno</p>
            <h2 id="modal-title" class="font-display text-2xl leading-tight text-cream-50">${esc(movie.titulo)}</h2>
          </div>
          ${closeBtn}
        </div>
        <p class="text-sm text-muted">Déjanos tu correo y serás de los primeros en conseguir entradas cuando abra la preventa.</p>
        <div class="field"><label class="label" for="notify-email">Email</label><input class="input" id="notify-email" name="email" type="email" autocomplete="email" placeholder="tu@correo.com" autofocus><span class="error-msg"></span></div>
        <button type="submit" class="btn-primary w-full"><i class="fa-solid fa-bell" aria-hidden="true"></i> Activar aviso</button>
      </form>`);
  }

  /* ------------------------------------------------------------------------
     Membresías
     ------------------------------------------------------------------------ */
  function openMembership(planId, period = 'mensual') {
    const plan = DATA.planes?.[planId];
    if (!plan) return;
    const anual = period === 'anual';
    const price = anual ? plan.precio * 10 : plan.precio;
    openModal(`
      <form class="space-y-6 p-6 sm:p-8" data-member-form="${planId}" novalidate>
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-2">
            <p class="eyebrow">Membresía</p>
            <h2 id="modal-title" class="font-display text-3xl text-cream-50">Plan ${esc(plan.nombre)}</h2>
            <p class="text-sm text-muted">$${price} ${anual ? 'al año' : 'al mes'} · Cancela cuando quieras</p>
          </div>
          ${closeBtn}
        </div>
        <div class="field"><label class="label" for="mem-name">Nombre completo</label><input class="input" id="mem-name" name="fullname" autocomplete="name" autofocus><span class="error-msg"></span></div>
        <div class="field"><label class="label" for="mem-email">Email</label><input class="input" id="mem-email" name="email" type="email" autocomplete="email"><span class="error-msg"></span></div>
        <button type="submit" class="btn-primary w-full">Activar membresía <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
        <p class="text-center text-xs text-muted">El primer cobro se realiza en taquilla en tu próxima visita.</p>
      </form>`);
  }

  /* ------------------------------------------------------------------------
     Tarjetas de películas
     ------------------------------------------------------------------------ */
  function formatDate(iso) {
    return new Intl.DateTimeFormat('es-SV', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso + 'T00:00'));
  }

  function movieCard(movie, index = 0) {
    const genres = movie.generos.map((g) => `<span class="tag">${esc(g)}</span>`).join('');
    const delay = `style="transition-delay:${(index % 3) * 90}ms"`;
    const poster = (badge) => `
      <button type="button" class="poster group/poster relative block w-full overflow-hidden rounded-2xl bg-ink-800 text-left" data-detail="${movie.id}" aria-label="Ver ficha de ${esc(movie.titulo)}">
        <img src="${movie.poster}" alt="Póster de ${esc(movie.titulo)}" loading="lazy" class="aspect-[2/3] w-full object-cover transition duration-700 group-hover/poster:scale-105">
        ${badge}
        <span class="absolute inset-0 grid place-items-center bg-ink-950/60 opacity-0 transition duration-300 group-hover/poster:opacity-100 group-focus-visible/poster:opacity-100">
          <span class="inline-flex items-center gap-2 rounded-full bg-cream-100 px-5 py-2.5 text-sm font-semibold text-ink-950"><i class="fa-solid fa-eye" aria-hidden="true"></i> Ver ficha</span>
        </span>
      </button>`;

    if (!movie.horarios) {
      const on = getNotify().includes(movie.id);
      const date = movie.estreno
        ? `<p class="flex items-center gap-2 text-sm text-cream-300"><i class="fa-solid fa-calendar text-carmine-400" aria-hidden="true"></i>${formatDate(movie.estreno)}</p>
           <p class="countdown" data-countdown="${movie.estreno}"></p>`
        : '<p class="text-sm text-muted">Fecha por confirmar</p>';
      return `
        <article class="reveal flex flex-col" ${delay}>
          ${poster('<span class="absolute left-4 top-4 rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">Próximamente</span>')}
          <div class="flex flex-1 flex-col gap-3 pt-5">
            <div class="flex flex-wrap gap-1.5">${genres}</div>
            <h3 class="font-display text-2xl text-cream-50">${esc(movie.titulo)}</h3>
            ${date}
            <div class="mt-auto flex flex-wrap gap-2 pt-1">
              <button type="button" class="${on ? 'btn-light' : 'btn-ghost'} btn-sm" data-notify="${movie.id}" data-notify-card aria-pressed="${on}">${notifyButtonHTML(on)}</button>
              <a href="${trailerURL(movie)}" target="_blank" rel="noopener noreferrer" class="btn-ghost btn-sm"><i class="fa-solid fa-play" aria-hidden="true"></i> Tráiler</a>
            </div>
          </div>
        </article>`;
    }

    const times = movie.horarios
      .map((h) => `<button type="button" class="chip" data-buy="${movie.id}" data-time="${h}" aria-label="Comprar para las ${h}">${h}</button>`)
      .join('');

    return `
      <article class="reveal flex flex-col" ${delay} data-genres="${esc(movie.generos.join('|'))}" data-title="${esc(movie.titulo.toLowerCase())}">
        ${poster(`<span class="absolute left-4 top-4 rounded-full bg-carmine-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">En cartelera</span>
                  <span class="absolute right-4 top-4 rounded-full bg-ink-950 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream-50">${esc(movie.sala)}</span>`)}
        <div class="flex flex-1 flex-col gap-3 pt-5">
          <div class="flex flex-wrap items-center gap-1.5">${genres}<span class="ml-auto text-sm font-semibold text-cream-50">${money(priceFor(movie))}</span></div>
          <h3 class="font-display text-2xl text-cream-50">${esc(movie.titulo)}</h3>
          <div class="flex flex-wrap gap-2" aria-label="Horarios de hoy">${times}</div>
          <div class="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <button type="button" class="btn-primary" data-buy="${movie.id}"><i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas</button>
            <a href="${trailerURL(movie)}" target="_blank" rel="noopener noreferrer" class="btn-ghost px-4" aria-label="Ver tráiler de ${esc(movie.titulo)}"><i class="fa-solid fa-play" aria-hidden="true"></i></a>
          </div>
        </div>
      </article>`;
  }

  function renderMovies(root = document) {
    root.querySelectorAll('[data-movies]').forEach((grid) => {
      const list = DATA[grid.dataset.movies] || [];
      const limit = Number(grid.dataset.limit) || list.length;
      grid.innerHTML = list.slice(0, limit).map(movieCard).join('');
    });
  }

  /* ------------------------------------------------------------------------
     Cuentas regresivas
     ------------------------------------------------------------------------ */
  function initCountdowns() {
    const els = document.querySelectorAll('[data-countdown]');
    if (!els.length) return;
    const tick = () =>
      els.forEach((el) => {
        const diff = new Date(el.dataset.countdown + 'T00:00') - Date.now();
        if (diff <= 0) {
          el.innerHTML = '<span class="text-carmine-400">Ya en cines</span>';
          return;
        }
        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff % 864e5) / 36e5);
        const m = Math.floor((diff % 36e5) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);
        el.innerHTML = [
          [d, 'días'],
          [h, 'h'],
          [m, 'min'],
          [s, 's'],
        ]
          .map(([v, u]) => `<span><b>${String(v).padStart(2, '0')}</b>${u}</span>`)
          .join('');
      });
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------------
     Telón de entrada (solo en la portada, una vez por sesión)
     ------------------------------------------------------------------------ */
  function initCurtain() {
    if (document.body.dataset.page !== 'inicio') return;
    let seen = false;
    try {
      seen = sessionStorage.getItem('lumiere:telon') === '1';
      sessionStorage.setItem('lumiere:telon', '1');
    } catch {
      /* sin almacenamiento: mostramos el telón igual */
    }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const curtain = document.createElement('div');
    curtain.className = 'curtain';
    curtain.setAttribute('aria-hidden', 'true');
    curtain.innerHTML = `
      <div class="curtain-panel curtain-left"></div>
      <div class="curtain-panel curtain-right"></div>
      <p class="curtain-logo font-display text-5xl text-cream-50 sm:text-7xl">Lumière <span class="italic">ciné</span></p>`;
    document.body.appendChild(curtain);
    requestAnimationFrame(() => setTimeout(() => curtain.classList.add('is-open'), 650));
    setTimeout(() => curtain.remove(), 2400);
  }

  /* ------------------------------------------------------------------------
     Animación al aparecer en pantalla
     ------------------------------------------------------------------------ */
  function initReveal(root = document) {
    const items = root.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     Delegación de clics para todos los botones de acción
     ------------------------------------------------------------------------ */
  function initActions() {
    document.addEventListener('click', (e) => {
      const detail = e.target.closest('[data-detail]');
      if (detail) return openDetail(findMovie(detail.dataset.detail));

      const buyBtn = e.target.closest('[data-buy]');
      if (buyBtn) {
        const movie = DATA.cartelera.find((m) => m.id === buyBtn.dataset.buy);
        if (movie) startBuy(movie, buyBtn.dataset.time);
        return;
      }

      const notify = e.target.closest('[data-notify]');
      if (notify) return openNotify(findMovie(notify.dataset.notify));

      if (e.target.closest('[data-quickbuy]')) return openQuickBuy();

      const member = e.target.closest('[data-member]');
      if (member) return openMembership(member.dataset.member, member.dataset.period || 'mensual');
    });
  }

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  window.Lumiere = {
    busy,
    toast,
    initReveal,
    escapeHTML: esc,
    isEmail,
    money,
    priceFor,
    openModal,
    openDetail: (id) => openDetail(findMovie(id)),
    openMembership,
    startBuy,
    occupiedSeats,
    TOTAL_SEATS,
    isPast,
    dateLabel,
    getDate: () => buyDate,
    setDate: (d) => (buyDate = startOfDay(d)),
  };

  document.addEventListener('DOMContentLoaded', () => {
    initCurtain();
    renderHeader(document.body.dataset.page);
    renderFooter();
    renderMovies();
    initNewsletter();
    initActions();
    initCountdowns();
    document.dispatchEvent(new CustomEvent('lumiere:ready'));
    initReveal();

    // Abrir la compra directamente desde un enlace: cartelera.html#comprar-<id>
    const match = location.hash.match(/^#comprar-(.+)$/);
    const movie = match && DATA.cartelera.find((m) => m.id === match[1]);
    if (movie) startBuy(movie);
  });
})();
