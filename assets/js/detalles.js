/* ==========================================================================
   Lumière Ciné — Detalles cinematográficos
   - Grano de película, barra de progreso y cursor tipo reflector
   - Transición entre páginas con telón
   - Títulos que aparecen palabra por palabra y cifras que cuentan
   - Botones magnéticos y pósters con inclinación 3D
   - Cabecera que se esconde al bajar y título de pestaña que te extraña
   ========================================================================== */

(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------------
     Transición entre páginas: un telón rojo baja al salir y sube al llegar
     ------------------------------------------------------------------------ */
  const WIPE_KEY = 'lumiere:transicion';
  const wipe = document.createElement('div');
  wipe.className = 'page-wipe';
  wipe.setAttribute('aria-hidden', 'true');
  wipe.innerHTML = '<span class="font-display text-4xl italic text-cream-50 sm:text-6xl">Lumière <span class="text-ink-950">ciné</span></span>';

  let arriving = false;
  try {
    arriving = sessionStorage.getItem(WIPE_KEY) === '1';
    sessionStorage.removeItem(WIPE_KEY);
  } catch {
    /* sin almacenamiento */
  }

  if (!reduced) {
    if (arriving) wipe.classList.add('is-covering');
    document.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(wipe);
      if (arriving) requestAnimationFrame(() => setTimeout(() => wipe.classList.replace('is-covering', 'is-leaving'), 120));
    });

    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // mismo documento: anclas
      e.preventDefault();
      try {
        sessionStorage.setItem(WIPE_KEY, '1');
      } catch {
        /* sin almacenamiento */
      }
      wipe.classList.remove('is-leaving');
      wipe.classList.add('is-entering');
      setTimeout(() => (location.href = url.href), 520);
    });

    // Al volver con el botón atrás del navegador, que no quede el telón puesto
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) wipe.classList.remove('is-entering', 'is-covering');
    });
  }

  /* ------------------------------------------------------------------------
     Elementos fijos: grano, progreso de lectura y cursor
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    const grain = document.createElement('div');
    grain.className = 'film-grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);

    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    const setProgress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener('scroll', setProgress, { passive: true });
    addEventListener('resize', setProgress);
    setProgress();

    if (finePointer && !reduced) initCursor();
    initSplitTitles();
    initCounters();
    initHeaderHide();
    initImageLoading();
    if (finePointer && !reduced) {
      initMagnetic();
      initTilt();
    }
  });

  /* ------------------------------------------------------------------------
     Cursor tipo reflector
     ------------------------------------------------------------------------ */
  function initCursor() {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.innerHTML = '<span class="cursor-label"></span>';
    document.body.append(ring, dot);
    document.documentElement.classList.add('has-cursor');

    const label = ring.querySelector('.cursor-label');
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;

    addEventListener('pointermove', (e) => {
      follow();
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      ring.classList.add('is-visible');
      dot.classList.add('is-visible');

      const target = e.target.closest?.('[data-detail], [data-open], [data-flip], a, button, input, select, textarea, label, summary, [role="tab"]');
      const view = e.target.closest?.('[data-detail], [data-open]');
      const flip = e.target.closest?.('[data-flip]');
      const text = e.target.closest?.('input, textarea, select');
      ring.classList.toggle('is-hover', Boolean(target) && !view && !flip && !text);
      ring.classList.toggle('is-view', Boolean(view || flip));
      ring.classList.toggle('is-text', Boolean(text));
      label.textContent = view ? 'Ver' : flip ? 'Girar' : '';
    });

    document.addEventListener('pointerleave', () => {
      ring.classList.remove('is-visible');
      dot.classList.remove('is-visible');
    });
    addEventListener('pointerdown', () => ring.classList.add('is-down'));
    addEventListener('pointerup', () => ring.classList.remove('is-down'));

    // Los diálogos modales se dibujan encima de todo: movemos el cursor adentro mientras están abiertos
    function follow() {
      const open = document.querySelector('dialog[open]');
      const host = open || document.body;
      if (ring.parentElement !== host) host.append(ring, dot);
    }

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ------------------------------------------------------------------------
     Títulos que aparecen palabra por palabra
     ------------------------------------------------------------------------ */
  function initSplitTitles() {
    if (reduced) return;
    document.querySelectorAll('main h1').forEach((h1) => {
      if (h1.dataset.split === 'off') return;
      h1.classList.remove('animate-rise');
      let index = 0;
      const walk = (node) => {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) return frag.append(part);
              const outer = document.createElement('span');
              outer.className = 'split-word';
              const inner = document.createElement('span');
              inner.textContent = part;
              inner.style.animationDelay = `${120 + index++ * 70}ms`;
              outer.append(inner);
              frag.append(outer);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
            walk(child);
          }
        });
      };
      walk(h1);
      h1.classList.add('is-split');
    });
  }

  /* ------------------------------------------------------------------------
     Cifras que cuentan al aparecer
     ------------------------------------------------------------------------ */
  function initCounters() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target;
        const end = Number(el.dataset.count);
        if (reduced) return (el.textContent = end);
        const start = performance.now();
        const step = (t) => {
          const k = Math.min(1, (t - start) / 1400);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    els.forEach((el) => {
      el.textContent = '0';
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     La cabecera se esconde al bajar y vuelve al subir
     ------------------------------------------------------------------------ */
  function initHeaderHide() {
    const header = document.getElementById('site-header');
    if (!header) return;
    let last = scrollY;
    addEventListener(
      'scroll',
      () => {
        const y = scrollY;
        const menuOpen = !document.getElementById('mobile-menu')?.hidden;
        header.classList.toggle('is-hidden', y > last && y > 240 && !menuOpen);
        last = y;
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------------
     Imágenes: brillo de carga hasta que terminan de llegar
     ------------------------------------------------------------------------ */
  function initImageLoading() {
    const mark = (img) => {
      if (img.complete && img.naturalWidth) return img.classList.add('is-loaded');
      img.classList.add('is-loading');
      img.addEventListener('load', () => img.classList.replace('is-loading', 'is-loaded'), { once: true });
    };
    const scan = (root) => root.querySelectorAll?.('main img:not(.is-loaded):not(.is-loading), dialog img:not(.is-loaded):not(.is-loading)').forEach(mark);
    scan(document);
    new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach((n) => n.nodeType === 1 && scan(n.parentElement || n)))).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  /* ------------------------------------------------------------------------
     Botones principales "magnéticos"
     ------------------------------------------------------------------------ */
  function initMagnetic() {
    document.addEventListener('pointermove', (e) => {
      const btn = e.target.closest('.btn-primary, .btn-light');
      document.querySelectorAll('.is-magnet').forEach((b) => {
        if (b !== btn) {
          b.classList.remove('is-magnet');
          b.style.transform = '';
        }
      });
      if (!btn || btn.disabled || btn.closest('dialog')) return;
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      btn.classList.add('is-magnet');
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }

  /* ------------------------------------------------------------------------
     Pósters con inclinación 3D y reflejo de luz
     ------------------------------------------------------------------------ */
  function initTilt() {
    let active = null;
    document.addEventListener('pointermove', (e) => {
      const poster = e.target.closest('.poster');
      if (active && active !== poster) {
        active.style.transform = '';
        active = null;
      }
      if (!poster) return;
      active = poster;
      const r = poster.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      poster.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
    });
  }

  /* ------------------------------------------------------------------------
     Título de la pestaña cuando te vas
     ------------------------------------------------------------------------ */
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? 'Te guardamos la butaca · Lumière Ciné' : originalTitle;
  });
})();
