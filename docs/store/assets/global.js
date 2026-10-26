/**
 * KALA — global.js
 *
 * Loaded on every page as a module (deferred by default). No dependencies.
 * Page-specific modules (product.js, facets.js) use the helpers exposed on
 * window.Kala instead of importing this file: Shopify serves assets with a
 * ?v= cache-buster, so an `import './global.js'` would resolve to a different
 * URL and evaluate this module twice.
 */

const config = JSON.parse(document.getElementById('theme-config')?.textContent || '{}');
const { routes = {}, strings = {} } = config;

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

export function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/** Forward a custom event to Shopify's Customer Events (custom pixels). */
export function publish(name, data = {}) {
  try {
    window.Shopify?.analytics?.publish?.(`kala:${name}`, data);
  } catch (_) {
    /* analytics must never break the storefront */
  }
}

export function parseHTML(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Fetch a URL rendered as a single section and return its parsed document. */
export async function fetchSection(url, sectionId, { signal } = {}) {
  const u = new URL(url, window.location.origin);
  u.searchParams.set('section_id', sectionId);
  const res = await fetch(u, { signal, headers: { Accept: 'text/html' } });
  if (!res.ok) throw new Error(`Section ${sectionId} failed: ${res.status}`);
  return parseHTML(await res.text());
}

/** Replace `#id` in the live document with `#id` from `doc`. */
export function swapById(doc, id) {
  const next = doc.getElementById(id);
  const current = document.getElementById(id);
  if (next && current) current.replaceWith(next);
  return next;
}

let toastTimer;
export function toast(message) {
  const el = document.querySelector('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 3200);
}

/* ------------------------------------------------------------------------ */
/* Cart API                                                                  */
/*                                                                           */
/* Every mutation asks Shopify to render the cart sections in the same       */
/* response (Section Rendering API via the `sections` param), so the UI is   */
/* updated from one round trip instead of mutate → GET cart → GET section.   */
/* ------------------------------------------------------------------------ */

function cartSectionIds() {
  const ids = new Set(['cart-drawer']);
  document.querySelectorAll('[data-cart-root]').forEach((el) => ids.add(el.dataset.cartRoot));
  return [...ids];
}

function renderCartSections(sections = {}) {
  let count;
  for (const [id, html] of Object.entries(sections)) {
    if (!html) continue;
    const doc = parseHTML(html);
    const next = doc.querySelector(`[data-cart-root="${id}"]`);
    const current = document.querySelector(`[data-cart-root="${id}"]`);
    if (next && current) current.replaceWith(next);
    if (next?.dataset.count !== undefined) count = next.dataset.count;
  }
  if (count !== undefined) {
    document.querySelectorAll('[data-cart-count]').forEach((el) => (el.textContent = count));
  }
}

async function cartRequest(path, body) {
  const sections = cartSectionIds();
  const isForm = body instanceof FormData;
  if (isForm) {
    body.append('sections', sections.join(','));
    body.append('sections_url', window.location.pathname);
  } else {
    body = JSON.stringify({ ...body, sections, sections_url: window.location.pathname });
  }
  const res = await fetch(`${path}.js`, {
    method: 'POST',
    headers: isForm
      ? { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
      : { 'Content-Type': 'application/json', Accept: 'application/json' },
    body,
  });
  const data = await res.json();
  if (!res.ok || data.status) {
    const err = new Error(data.description || data.message || strings.cartError);
    err.status = res.status;
    throw err;
  }
  renderCartSections(data.sections);
  return data;
}

export async function addToCart(body) {
  const data = await cartRequest(routes.cartAdd, body);
  if (config.cartType === 'page') {
    window.location.href = routes.cart;
    return data;
  }
  openDialog('cart-drawer');
  return data;
}

export const changeLine = (line, quantity) => cartRequest(routes.cartChange, { line, quantity });

export async function updateNote(note) {
  await fetch(`${routes.cart}/update.js`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ note }),
  });
}

/* ------------------------------------------------------------------------ */
/* Dialogs                                                                   */
/* ------------------------------------------------------------------------ */

export function openDialog(id, opener) {
  const dialog = document.getElementById(id);
  if (!dialog || dialog.open) return;
  dialog._opener = opener || document.activeElement;
  dialog.showModal();
  if (id === 'search-sheet') dialog.querySelector('input[type="search"]')?.focus();
}

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open-dialog]');
  if (opener) {
    const target = document.getElementById(opener.dataset.openDialog);
    if (target) {
      event.preventDefault();
      openDialog(opener.dataset.openDialog, opener);
      if (opener.dataset.analytics) publish(opener.dataset.analytics, { id: opener.dataset.openDialog });
    }
    return;
  }
  const closer = event.target.closest('[data-close-dialog]');
  if (closer) {
    closer.closest('dialog')?.close();
    return;
  }
  // Click on the backdrop: the event target is the <dialog> itself.
  if (event.target instanceof HTMLDialogElement && event.target.open) {
    const r = event.target.getBoundingClientRect();
    const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) event.target.close();
  }
});

document.addEventListener(
  'close',
  (event) => {
    if (event.target instanceof HTMLDialogElement) event.target._opener?.focus?.({ preventScroll: true });
  },
  true
);

/* ------------------------------------------------------------------------ */
/* Components                                                                */
/* ------------------------------------------------------------------------ */

class CartItems extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', this.onClick);
    this.addEventListener('change', this.onChange);
    this.querySelector('[data-cart-note]')?.addEventListener(
      'input',
      debounce((e) => updateNote(e.target.value), 400)
    );
  }

  onClick = (event) => {
    const line = event.target.closest('[data-line]');
    if (!line) return;
    const input = line.querySelector('[data-qty-input]');
    if (event.target.closest('[data-remove]')) return this.update(line, 0);
    const step = event.target.closest('[data-qty-step]');
    if (step) this.update(line, Math.max(0, Number(input.value) + Number(step.dataset.qtyStep)));
  };

  onChange = (event) => {
    if (!event.target.matches('[data-qty-input]')) return;
    const line = event.target.closest('[data-line]');
    this.update(line, Math.max(0, Number(event.target.value) || 0));
  };

  async update(lineEl, quantity) {
    const key = lineEl.dataset.key;
    lineEl.classList.add('line--loading');
    try {
      await changeLine(Number(lineEl.dataset.line), quantity);
      // The element was replaced; restore focus to the same line if it survived.
      const root = document.querySelector(`[data-cart-root="${this.dataset.cartRoot}"]`);
      root?.querySelector(`[data-key="${CSS.escape(key)}"] [data-qty-input]`)?.focus({ preventScroll: true });
    } catch (error) {
      lineEl.classList.remove('line--loading');
      toast(error.message);
    }
  }
}
customElements.define('cart-items', CartItems);

class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.form?.addEventListener('submit', this.onSubmit);
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const buttons = document.querySelectorAll(`[type="submit"][form="${this.form.id}"], #${CSS.escape(this.form.id)} [type="submit"]`);
    const error = this.querySelector('[data-form-error]');
    buttons.forEach((b) => b.setAttribute('aria-busy', 'true'));
    if (error) error.hidden = true;
    try {
      await addToCart(new FormData(this.form));
    } catch (e) {
      if (error) {
        error.textContent = e.message;
        error.hidden = false;
      } else {
        toast(e.message);
      }
    } finally {
      buttons.forEach((b) => b.removeAttribute('aria-busy'));
    }
  };
}
customElements.define('product-form', ProductForm);

class QuickAdd extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', async (event) => {
      const button = event.target.closest('button[data-variant-id]');
      if (!button || button.disabled) return;
      event.preventDefault();
      button.setAttribute('aria-busy', 'true');
      try {
        await addToCart({ items: [{ id: Number(button.dataset.variantId), quantity: 1 }] });
        publish('quick_add', { variantId: button.dataset.variantId, handle: this.dataset.productHandle });
      } catch (e) {
        toast(e.message);
      } finally {
        button.removeAttribute('aria-busy');
      }
    });
  }
}
customElements.define('quick-add', QuickAdd);

class CountdownTimer extends HTMLElement {
  connectedCallback() {
    this.target = Number(this.dataset.target) * 1000;
    if (!this.target) return;
    this.setAttribute('role', 'timer');
    this.tick();
    this.interval = setInterval(() => this.tick(), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  tick() {
    const ms = this.target - Date.now();
    if (ms <= 0) return this.expire();
    const s = Math.floor(ms / 1000);
    const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
    const pad = (n) => String(n).padStart(2, '0');

    if (this.dataset.format === 'blocks') {
      const labels = strings.countdown || ['Days', 'Hrs', 'Min', 'Sec'];
      if (!this.units) {
        this.innerHTML = labels
          .map((l) => `<span class="countdown__unit"><span class="countdown__num"></span><span class="t-label t-label--sm t-muted">${l}</span></span>`)
          .join('');
        this.units = [...this.querySelectorAll('.countdown__num')];
      }
      this.units.forEach((el, i) => (el.textContent = pad(parts[i])));
    } else {
      const [d, h, m, sec] = parts;
      this.textContent = `${d > 0 ? `${d}d ` : ''}${pad(h)}:${pad(m)}:${pad(sec)}`;
    }
  }

  expire() {
    clearInterval(this.interval);
    const after = this.dataset.after;
    if (this.dataset.format === 'blocks') {
      this.innerHTML = after ? `<span class="t-h1">${after}</span>` : '';
      return;
    }
    const msg = this.closest('.bar__msg');
    if (msg && after) {
      msg.querySelector('a, span')?.replaceChildren(document.createTextNode(after));
      msg.querySelectorAll('[data-before], .bar__sep').forEach((n) => n.remove());
      this.remove();
    } else {
      this.textContent = after || '';
    }
  }
}
customElements.define('countdown-timer', CountdownTimer);

class RotatingBar extends HTMLElement {
  connectedCallback() {
    this.messages = [...this.querySelectorAll('.bar__msg')];
    if (this.messages.length < 2) return;
    this.index = 0;
    this.paused = false;
    ['mouseenter', 'focusin'].forEach((e) => this.addEventListener(e, () => (this.paused = true)));
    ['mouseleave', 'focusout'].forEach((e) => this.addEventListener(e, () => (this.paused = false)));
    this.interval = setInterval(() => this.next(), Number(this.dataset.interval) || 5000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  next() {
    if (this.paused || document.hidden) return;
    this.messages[this.index].hidden = true;
    this.index = (this.index + 1) % this.messages.length;
    this.messages[this.index].hidden = false;
  }
}
customElements.define('rotating-bar', RotatingBar);

class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('input[type="search"]');
    this.results = this.querySelector('#predictive-search-results');
    this.input.addEventListener('input', debounce(() => this.search(), 180));
    this.addEventListener('keydown', this.onKeydown);
  }

  async search() {
    const q = this.input.value.trim();
    this.controller?.abort();
    if (!q) {
      this.results.innerHTML = '';
      return;
    }
    this.controller = new AbortController();
    const params = new URLSearchParams({
      q,
      section_id: 'predictive-search',
      'resources[type]': 'product,collection,query',
      'resources[limit]': this.dataset.limit || '6',
      'resources[options][fields]': 'title,product_type,variants.title,vendor,tag',
    });
    try {
      const res = await fetch(`${routes.predictiveSearch}?${params}`, { signal: this.controller.signal });
      if (!res.ok) return;
      const doc = parseHTML(await res.text());
      this.results.innerHTML = doc.querySelector('#shopify-section-predictive-search')?.innerHTML ?? '';
    } catch (e) {
      if (e.name !== 'AbortError') console.error(e);
    }
  }

  // Arrow keys move between result links; the input stays in the tab order.
  onKeydown = (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const links = [...this.results.querySelectorAll('a')];
    if (!links.length) return;
    event.preventDefault();
    const i = links.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown' ? links[i + 1] || links[0] : i <= 0 ? this.input : links[i - 1];
    next.focus();
  };
}
customElements.define('predictive-search', PredictiveSearch);

class LookBook extends HTMLElement {
  connectedCallback() {
    const set = (n) => {
      this.querySelectorAll('[data-active]').forEach((el) => el.removeAttribute('data-active'));
      if (!n) return;
      this.querySelector(`[data-pin="${n}"]`)?.setAttribute('data-active', '');
      this.querySelector(`[data-item="${n}"]`)?.setAttribute('data-active', '');
    };
    this.addEventListener('pointerover', (e) => set(e.target.closest('[data-pin], [data-item]')?.dataset.pin ?? e.target.closest('[data-item]')?.dataset.item));
    this.addEventListener('pointerleave', () => set(null));
    this.addEventListener('click', (e) => {
      const pin = e.target.closest('[data-pin]');
      if (!pin) return;
      set(pin.dataset.pin);
      const item = this.querySelector(`[data-item="${pin.dataset.pin}"]`);
      if (window.matchMedia('(max-width: 989px)').matches) item?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      item?.querySelector('a')?.focus({ preventScroll: true });
    });
  }
}
customElements.define('look-book', LookBook);

/* Localization selector submits on change (progressively enhanced). */
document.querySelectorAll('.localization select').forEach((select) => {
  select.addEventListener('change', () => select.form.submit());
});

window.Kala = { config, routes, strings, publish, toast, debounce, fetchSection, swapById, parseHTML, addToCart, openDialog };
