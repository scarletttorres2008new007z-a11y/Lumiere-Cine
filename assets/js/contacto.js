/* ==========================================================================
   Lumière Ciné — Página de contacto
   Pestañas accesibles, selección de paquete y validación de formularios
   ========================================================================== */

document.addEventListener('lumiere:ready', () => {
  /* ------------------------------------------------------------------------
     Pestañas
     ------------------------------------------------------------------------ */
  const tabs = [...document.querySelectorAll('[role="tab"]')];

  const selectTab = (name, { focus = false, updateHash = true } = {}) => {
    const tab = tabs.find((t) => t.dataset.tab === name);
    if (!tab) return;
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center' });
    if (updateHash) history.replaceState(null, '', '#' + name);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', (e) => {
      const moves = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in moves) {
        e.preventDefault();
        selectTab(tabs[(i + moves[e.key] + tabs.length) % tabs.length].dataset.tab, { focus: true });
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        selectTab(tabs[e.key === 'Home' ? 0 : tabs.length - 1].dataset.tab, { focus: true });
      }
    });
  });

  document.querySelectorAll('[data-goto]').forEach((btn) =>
    btn.addEventListener('click', () => selectTab(btn.dataset.goto, { focus: true }))
  );

  const fromHash = () => selectTab(location.hash.slice(1), { updateHash: false });
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ------------------------------------------------------------------------
     Contadores de caracteres
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-count-for]').forEach((counter) => {
    const field = document.getElementById(counter.dataset.countFor);
    const update = () => (counter.textContent = `${field.value.length}/${field.maxLength}`);
    field.addEventListener('input', update);
    field.form.addEventListener('reset', () => setTimeout(update));
  });

  /* ------------------------------------------------------------------------
     Paquetes (reserva)
     ------------------------------------------------------------------------ */
  const paquetes = [...document.querySelectorAll('[data-paquete]')];
  const paqueteInput = document.getElementById('paqueteInput');
  const paqueteError = document.getElementById('paqueteError');

  const pickPaquete = (card) => {
    paquetes.forEach((c) => {
      c.setAttribute('aria-checked', String(c === card));
      c.tabIndex = c === (card || paquetes[0]) ? 0 : -1;
    });
    paqueteInput.value = card ? card.dataset.paquete : '';
    paqueteError.textContent = '';
  };

  paquetes.forEach((card, i) => {
    card.addEventListener('click', () => pickPaquete(card));
    card.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = paquetes[(i + step + paquetes.length) % paquetes.length];
      pickPaquete(next);
      next.focus();
    });
  });

  /* ------------------------------------------------------------------------
     Validación
     ------------------------------------------------------------------------ */
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateInput = document.getElementById('res-fecha');
  if (dateInput) dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const RULES = {
    required: (v) => (v ? '' : '{label} es obligatorio'),
    email: (v) => (!v || Lumiere.isEmail(v) ? '' : 'Escribe un email válido'),
    phone: (v) => (!v || /^\+?[\d\s-]{7,15}$/.test(v) ? '' : 'Solo números, de 7 a 15 dígitos'),
    url: (v) => {
      if (!v) return '';
      try {
        new URL(v);
        return '';
      } catch {
        return 'Escribe un enlace completo, con https://';
      }
    },
    future: (v) => (!v || new Date(v + 'T00:00') >= today ? '' : 'Elige una fecha a partir de hoy'),
  };

  const validateField = (field) => {
    const value = field.value.trim();
    const label = field.dataset.label || 'Este campo';
    let message = '';
    for (const rule of field.dataset.rules.split(' ')) {
      message = RULES[rule](value).replace('{label} es obligatorio', field.dataset.msg || label + ' es obligatorio');
      if (message) break;
    }
    field.classList.toggle('has-error', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    const msg = field.closest('.field').querySelector('.error-msg');
    if (msg) {
      msg.textContent = message;
      msg.id ||= field.id + '-error';
      field.setAttribute('aria-describedby', msg.id);
    }
    return !message;
  };

  document.querySelectorAll('form[data-success]').forEach((form) => {
    const fields = [...form.querySelectorAll('[data-rules]')];

    fields.forEach((field) => {
      field.addEventListener('blur', () => field.value && validateField(field));
      field.addEventListener('input', () => field.classList.contains('has-error') && validateField(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = fields.map(validateField).every(Boolean);

      if (form.id === 'reservaForm' && !paqueteInput.value) {
        paqueteError.textContent = 'Selecciona un paquete para continuar';
        if (valid) document.getElementById('paquetes').scrollIntoView({ behavior: 'smooth', block: 'center' });
        valid = false;
      }

      if (!valid) {
        form.querySelector('.has-error')?.focus();
        return;
      }

      (document.getElementById(form.dataset.hide) || form).hidden = true;
      const success = document.getElementById(form.dataset.success);
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  document.querySelectorAll('[data-reset]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const form = document.getElementById(btn.dataset.reset);
      form.reset();
      form.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
      form.querySelectorAll('.error-msg').forEach((el) => (el.textContent = ''));
      if (form.id === 'reservaForm') pickPaquete(null);
      (document.getElementById(form.dataset.hide) || form).hidden = false;
      document.getElementById(form.dataset.success).hidden = true;
    })
  );

  if (paquetes.length) paquetes.forEach((c, i) => (c.tabIndex = i === 0 ? 0 : -1));
});
