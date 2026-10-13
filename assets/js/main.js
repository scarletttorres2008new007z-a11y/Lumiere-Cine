/* ==========================================================================
   Lumière Ciné — Script común a todas las páginas
   - Inserta la cabecera y el pie de página
   - Menú móvil, animaciones al hacer scroll, avisos (toast)
   - Tarjetas de películas y modal de compra de entradas
   ========================================================================== */

(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const PAGES = [
    { id: 'inicio', href: 'index.html', label: 'Inicio' },
    { id: 'cartelera', href: 'cartelera.html', label: 'Cartelera' },
    { id: 'galeria', href: 'galeria.html', label: 'Galería' },
    { id: 'nosotros', href: 'nosotros.html', label: 'Nosotros' },
    { id: 'autores', href: 'autores.html', label: 'Autores' },
    { id: 'membresia', href: 'membresia.html', label: 'Membresía' },
    { id: 'contacto', href: 'contacto.html', label: 'Contacto' },
  ];

  const SOCIAL = [
    { label: 'Facebook', icon: 'fa-facebook-f' },
    { label: 'Instagram', icon: 'fa-instagram' },
    { label: 'X', icon: 'fa-x-twitter' },
    { label: 'YouTube', icon: 'fa-youtube' },
    { label: 'TikTok', icon: 'fa-tiktok' },
  ];

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
      (p) => `
        <li>
          <a href="${p.href}" class="flex items-center justify-between border-b border-ink-700 py-4 font-display text-3xl ${
            p.id === current ? 'text-carmine-500' : 'text-cream-50'
          }"${p.id === current ? ' aria-current="page"' : ''}>
            ${p.label}<i class="fa-solid fa-arrow-right text-base text-muted" aria-hidden="true"></i>
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
            <a href="cartelera.html" class="btn-primary btn-sm hidden sm:inline-flex">
              <i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas
            </a>
            <button id="menu-toggle" type="button" class="grid h-11 w-11 place-items-center rounded-full border border-ink-600 text-cream-100 transition hover:border-cream-100 lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">
              <i class="fa-solid fa-bars" aria-hidden="true"></i>
            </button>
          </div>
        </nav>
        <div id="mobile-menu" class="fixed inset-0 top-20 z-40 overflow-y-auto bg-ink-950 lg:hidden" hidden>
          <ul class="container-site pb-10 pt-4">${mobileLinks}</ul>
          <div class="container-site">
            <a href="cartelera.html" class="btn-primary w-full"><i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas</a>
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

    const social = SOCIAL.map(
      (s) => `
        <a href="#" class="grid h-10 w-10 place-items-center rounded-full border border-ink-600 text-cream-300 transition hover:border-carmine-500 hover:bg-carmine-500 hover:text-white" aria-label="${s.label}">
          <i class="fa-brands ${s.icon}" aria-hidden="true"></i>
        </a>`
    ).join('');

    const nav = PAGES.map((p) => `<li><a class="text-muted transition hover:text-cream-50" href="${p.href}">${p.label}</a></li>`).join('');

    slot.outerHTML = `
      <footer class="border-t border-ink-700 bg-ink-900">
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
              <li class="flex gap-3"><i class="fa-solid fa-location-dot mt-1 text-carmine-500" aria-hidden="true"></i>San Salvador, El Salvador</li>
              <li class="flex gap-3"><i class="fa-solid fa-clock mt-1 text-carmine-500" aria-hidden="true"></i>Lun a Dom, 14:00 a 00:00</li>
              <li class="flex gap-3"><i class="fa-solid fa-phone mt-1 text-carmine-500" aria-hidden="true"></i>+503 2100-0000</li>
              <li class="flex gap-3"><i class="fa-solid fa-envelope mt-1 text-carmine-500" aria-hidden="true"></i>contacto@lumierecine.sv</li>
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
        <div class="border-t border-ink-700">
          <div class="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
            <p>&copy; ${new Date().getFullYear()} Lumière Ciné. Todos los derechos reservados.</p>
            <p>Hecho con pasión por el cine.</p>
          </div>
        </div>
      </footer>
      <div id="toast-region" class="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite"></div>`;
  }

  /* ------------------------------------------------------------------------
     Avisos
     ------------------------------------------------------------------------ */
  function toast(message, icon = 'fa-circle-check') {
    const region = document.getElementById('toast-region');
    if (!region) return;
    const el = document.createElement('div');
    el.className =
      'pointer-events-auto flex items-center gap-3 rounded-full border border-ink-600 bg-cream-100 px-5 py-3 text-sm font-medium text-ink-950 shadow-2xl animate-rise';
    el.innerHTML = `<i class="fa-solid ${icon} text-carmine-500" aria-hidden="true"></i><span>${escapeHTML(message)}</span>`;
    region.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .3s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
    }, 3200);
  }

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

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
     Tarjetas de películas
     ------------------------------------------------------------------------ */
  const NOTIFY_KEY = 'lumiere:avisos';
  const getNotify = () => {
    try {
      return JSON.parse(localStorage.getItem(NOTIFY_KEY)) || [];
    } catch {
      return [];
    }
  };
  const setNotify = (list) => {
    try {
      localStorage.setItem(NOTIFY_KEY, JSON.stringify(list));
    } catch {
      /* almacenamiento no disponible */
    }
  };

  function movieCard(movie, index = 0) {
    const genres = movie.generos.map((g) => `<span class="tag">${escapeHTML(g)}</span>`).join('');
    const delay = `style="transition-delay:${(index % 3) * 90}ms"`;

    if (!movie.horarios) {
      const on = getNotify().includes(movie.id);
      return `
        <article class="reveal group flex flex-col" ${delay}>
          <div class="relative overflow-hidden rounded-2xl bg-ink-800">
            <img src="${movie.poster}" alt="Póster de ${escapeHTML(movie.titulo)}" loading="lazy" class="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-105">
            <span class="absolute left-4 top-4 rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">Próximamente</span>
          </div>
          <div class="flex flex-1 flex-col gap-3 pt-5">
            <div class="flex flex-wrap gap-1.5">${genres}</div>
            <h3 class="font-display text-2xl text-cream-50">${escapeHTML(movie.titulo)}</h3>
            <button type="button" class="${on ? 'btn-light' : 'btn-ghost'} btn-sm mt-auto self-start" data-notify="${movie.id}" aria-pressed="${on}">
              <i class="fa-solid ${on ? 'fa-check' : 'fa-bell'}" aria-hidden="true"></i>
              <span>${on ? 'Te avisaremos' : 'Avísame del estreno'}</span>
            </button>
          </div>
        </article>`;
    }

    const times = movie.horarios
      .map((h) => `<button type="button" class="chip" data-buy="${movie.id}" data-time="${h}" aria-label="Comprar para las ${h}">${h}</button>`)
      .join('');

    return `
      <article class="reveal group flex flex-col" ${delay} data-genres="${escapeHTML(movie.generos.join('|'))}" data-title="${escapeHTML(movie.titulo.toLowerCase())}">
        <div class="relative overflow-hidden rounded-2xl bg-ink-800">
          <img src="${movie.poster}" alt="Póster de ${escapeHTML(movie.titulo)}" loading="lazy" class="aspect-[2/3] w-full object-cover transition duration-700 group-hover:scale-105">
          <span class="absolute left-4 top-4 rounded-full bg-carmine-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">En cartelera</span>
        </div>
        <div class="flex flex-1 flex-col gap-3 pt-5">
          <div class="flex flex-wrap items-center gap-1.5">${genres}<span class="ml-auto text-xs text-muted">${escapeHTML(movie.sala || '')}</span></div>
          <h3 class="font-display text-2xl text-cream-50">${escapeHTML(movie.titulo)}</h3>
          <div class="flex flex-wrap gap-2" aria-label="Horarios de hoy">${times}</div>
          <button type="button" class="btn-primary mt-2 w-full" data-buy="${movie.id}">
            <i class="fa-solid fa-ticket" aria-hidden="true"></i> Comprar entradas
          </button>
        </div>
      </article>`;
  }

  function renderMovies(root = document) {
    const data = window.LUMIERE || {};
    root.querySelectorAll('[data-movies]').forEach((grid) => {
      const list = data[grid.dataset.movies] || [];
      const limit = Number(grid.dataset.limit) || list.length;
      grid.innerHTML = list.slice(0, limit).map(movieCard).join('');
    });
  }

  function initNotify() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-notify]');
      if (!btn) return;
      const id = btn.dataset.notify;
      const list = getNotify();
      const on = !list.includes(id);
      setNotify(on ? [...list, id] : list.filter((x) => x !== id));
      btn.setAttribute('aria-pressed', String(on));
      btn.className = `${on ? 'btn-light' : 'btn-ghost'} btn-sm mt-auto self-start`;
      btn.innerHTML = `<i class="fa-solid ${on ? 'fa-check' : 'fa-bell'}" aria-hidden="true"></i><span>${on ? 'Te avisaremos' : 'Avísame del estreno'}</span>`;
      toast(on ? 'Te avisaremos cuando abra la preventa' : 'Aviso cancelado', on ? 'fa-bell' : 'fa-bell-slash');
    });
  }

  /* ------------------------------------------------------------------------
     Modal de compra de entradas
     ------------------------------------------------------------------------ */
  function initBuyDialog() {
    const data = window.LUMIERE;
    if (!data) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'dialog';
    dialog.setAttribute('aria-labelledby', 'buy-title');
    document.body.appendChild(dialog);

    const money = (n) => `$${n.toFixed(2)}`;
    const state = { movie: null, time: null, qty: 2 };

    const render = () => {
      const m = state.movie;
      const total = state.qty * data.precioEntrada;
      dialog.innerHTML = `
        <form method="dialog" class="flex flex-col">
          <div class="flex gap-5 border-b border-ink-700 p-6">
            <img src="${m.poster}" alt="" class="h-28 w-[4.7rem] shrink-0 rounded-lg object-cover">
            <div class="flex-1">
              <p class="eyebrow mb-2">Compra de entradas</p>
              <h2 id="buy-title" class="font-display text-2xl leading-tight text-cream-50">${escapeHTML(m.titulo)}</h2>
              <p class="mt-1 text-sm text-muted">${escapeHTML(m.sala || '')} · Hoy</p>
            </div>
            <button value="cancel" class="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-600 text-cream-300 hover:text-white" aria-label="Cerrar">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
          <div class="space-y-6 p-6">
            <fieldset>
              <legend class="label mb-3">Horario</legend>
              <div class="flex flex-wrap gap-2">
                ${m.horarios
                  .map((h) => `<button type="button" class="chip" data-pick-time="${h}" aria-pressed="${h === state.time}">${h}</button>`)
                  .join('')}
              </div>
            </fieldset>
            <div class="flex items-center justify-between">
              <div>
                <p class="label">Entradas</p>
                <p class="mt-1 text-sm text-muted">${money(data.precioEntrada)} c/u</p>
              </div>
              <div class="flex items-center gap-1 rounded-full border border-ink-600 p-1">
                <button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-800" data-qty="-1" aria-label="Quitar una entrada"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
                <output class="w-8 text-center font-semibold" aria-live="polite">${state.qty}</output>
                <button type="button" class="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-800" data-qty="1" aria-label="Agregar una entrada"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 rounded-b-2xl border-t border-ink-700 bg-ink-850 p-6">
            <div>
              <p class="label">Total</p>
              <p class="font-display text-3xl text-cream-50">${money(total)}</p>
            </div>
            <button type="button" class="btn-primary" data-confirm ${state.time ? '' : 'disabled'}>
              Confirmar <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </form>`;
    };

    const renderDone = () => {
      const code = 'LC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      dialog.innerHTML = `
        <div class="flex flex-col items-center gap-4 p-10 text-center">
          <span class="grid h-16 w-16 place-items-center rounded-full bg-carmine-500 text-2xl text-white"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
          <h2 id="buy-title" class="font-display text-3xl text-cream-50">Reserva lista</h2>
          <p class="text-sm leading-relaxed text-muted">${state.qty} ${state.qty === 1 ? 'entrada' : 'entradas'} para <strong class="text-cream-100">${escapeHTML(
        state.movie.titulo
      )}</strong> a las ${state.time}. Presenta este código en taquilla:</p>
          <p class="rounded-xl border border-dashed border-ink-600 px-6 py-3 font-mono text-xl tracking-[0.3em] text-cream-50">${code}</p>
          <form method="dialog"><button class="btn-light mt-2">Cerrar</button></form>
        </div>`;
    };

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) return dialog.close();
      const t = e.target.closest('[data-pick-time]');
      if (t) {
        state.time = t.dataset.pickTime;
        return render();
      }
      const q = e.target.closest('[data-qty]');
      if (q) {
        state.qty = Math.min(10, Math.max(1, state.qty + Number(q.dataset.qty)));
        return render();
      }
      if (e.target.closest('[data-confirm]') && state.time) renderDone();
    });

    dialog.addEventListener('close', () => document.body.classList.remove('overflow-hidden'));

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-buy]');
      if (!btn) return;
      const movie = data.cartelera.find((m) => m.id === btn.dataset.buy);
      if (!movie) return;
      state.movie = movie;
      state.time = btn.dataset.time || null;
      state.qty = 2;
      render();
      dialog.showModal();
      document.body.classList.add('overflow-hidden');
    });
  }

  /* ------------------------------------------------------------------------
     Arranque
     ------------------------------------------------------------------------ */
  window.Lumiere = { toast, initReveal, escapeHTML, isEmail };

  document.addEventListener('DOMContentLoaded', () => {
    renderHeader(document.body.dataset.page);
    renderFooter();
    renderMovies();
    initNewsletter();
    initNotify();
    initBuyDialog();
    document.dispatchEvent(new CustomEvent('lumiere:ready'));
    initReveal();
  });
})();
