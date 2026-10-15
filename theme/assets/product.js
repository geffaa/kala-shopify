/**
 * KALA — product.js
 *
 * Variant changes are resolved locally (variant JSON embedded in the page)
 * for instant feedback on the picker, then the server-rendered price, buy
 * box and sticky bar are swapped in from the Section Rendering API. Liquid
 * stays the single source of truth for money formatting, inventory copy and
 * the back-in-stock state — no duplicated templates in JS.
 */

const { publish, fetchSection, swapById, toast, config } = window.Kala;

class MediaGallery extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-track]');
    this.current = this.querySelector('[data-current]');
    this.progress = this.querySelector('[data-progress]');
    this.items = [...this.track.children];
    if (this.items.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = this.items.indexOf(entry.target);
          if (this.current) this.current.textContent = String(index + 1).padStart(2, '0');
          this.progress?.style.setProperty('--index', index);
        }
      },
      { root: this.track, threshold: 0.6 }
    );
    this.items.forEach((item) => observer.observe(item));
  }

  show(mediaId) {
    const item = this.items?.find((el) => el.dataset.mediaId === String(mediaId));
    if (!item) return;
    if (window.matchMedia('(min-width: 990px)').matches) {
      // Desktop: promote the variant's image to the lead slot instead of
      // scrolling the window, so the picker stays where the customer is.
      this.items.forEach((el) => el.toggleAttribute('data-active', el === item));
    } else {
      this.track.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
    }
  }
}
customElements.define('media-gallery', MediaGallery);

class VariantPicker extends HTMLElement {
  connectedCallback() {
    this.variants = JSON.parse(this.querySelector('[data-variants]').textContent);
    this.groups = [...this.querySelectorAll('[role="radiogroup"]')];
    this.addEventListener('change', this.onChange);
    this.refreshAvailability();
  }

  get selected() {
    return this.groups.map((group) => group.querySelector('input:checked')?.value ?? null);
  }

  onChange = () => {
    const selected = this.selected;
    this.groups.forEach((group, i) => {
      const label = group.querySelector('[data-selected-value]');
      if (label) label.textContent = selected[i];
    });
    this.refreshAvailability();
    const variant = this.variants.find((v) => v.options.every((opt, i) => opt === selected[i]));
    this.dispatchEvent(new CustomEvent('variant:change', { bubbles: true, detail: { variant, selected } }));
  };

  /**
   * A value is available if some in-stock variant has that value AND matches
   * every other currently selected option. Unavailable values stay selectable
   * so customers can still subscribe to a restock.
   */
  refreshAvailability() {
    const selected = this.selected;
    this.groups.forEach((group, position) => {
      group.querySelectorAll('input').forEach((input) => {
        const available = this.variants.some(
          (v) => v.available && v.options[position] === input.value && v.options.every((opt, i) => i === position || opt === selected[i])
        );
        input.nextElementSibling.classList.toggle('is-unavailable', !available);
      });
    });
  }
}
customElements.define('variant-picker', VariantPicker);

class ProductPage extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.sectionId;
    this.addEventListener('variant:change', this.onVariantChange);
  }

  onVariantChange = async ({ detail: { variant } }) => {
    const buyButton = this.querySelector('[data-main-atc]');
    if (!variant) {
      if (buyButton) {
        buyButton.disabled = true;
        buyButton.querySelector('.btn__text').textContent = config.strings.unavailable;
      }
      return;
    }

    this.querySelectorAll('[data-variant-input]').forEach((input) => (input.value = variant.id));
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);

    if (variant.media) this.querySelector('media-gallery')?.show(variant.media);

    this.controller?.abort();
    this.controller = new AbortController();
    try {
      const doc = await fetchSection(`${this.dataset.productUrl}?variant=${variant.id}`, this.sectionId, {
        signal: this.controller.signal,
      });
      const sticky = this.querySelector('sticky-atc');
      const stickyHidden = sticky?.hasAttribute('data-hidden');

      ['price', 'buy', 'sticky'].forEach((region) => swapById(doc, `${region}-${this.sectionId}`));

      const nextSticky = this.querySelector('sticky-atc');
      if (nextSticky) nextSticky.toggleAttribute('data-hidden', stickyHidden ?? true);
    } catch (e) {
      if (e.name !== 'AbortError') toast(config.strings.cartError);
    }
  };
}
customElements.define('product-page', ProductPage);

/**
 * Shows a compact add-to-bag bar once the main button has scrolled out of
 * view above the viewport, and hides it again near the footer.
 */
class StickyAtc extends HTMLElement {
  connectedCallback() {
    this.hidden = false;
    this.setAttribute('data-hidden', '');
    // Observe the button itself, not the whole buy block (which can stay partly
    // visible long after the button has gone). The sticky bar is swapped after
    // the buy block on variant change, so it always observes the current button.
    const target = this.closest('product-page')?.querySelector('[data-main-atc]');
    if (!target) return;

    // The root is stretched far below the viewport, so the button counts as
    // "intersecting" until it leaves through the top edge. Without this, a jump
    // scroll (anchor link, End key) from below to above the viewport never
    // changes the intersection state and the callback never fires.
    this.observer = new IntersectionObserver(
      ([entry]) => this.toggleAttribute('data-hidden', entry.isIntersecting),
      { rootMargin: '0px 0px 100000px 0px' }
    );
    this.observer.observe(target);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }
}
customElements.define('sticky-atc', StickyAtc);

/**
 * Restock alerts. Posts to the app proxy path (default /apps/kala/back-in-stock),
 * which Shopify signs and forwards to the ops service. See ops/src/routes/proxy.js.
 */
class BackInStock extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.status = this.querySelector('[data-status]');
    this.form.addEventListener('submit', this.onSubmit);
  }

  onSubmit = async (event) => {
    event.preventDefault();
    if (!this.form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(this.form));
    const button = this.form.querySelector('button');
    button.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(config.backInStockEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || res.statusText);
      this.form.hidden = true;
      this.status.textContent = body.message || 'Saved.';
      publish('back_in_stock_subscribed', { variantId: data.variant_id, productId: data.product_id });
    } catch (e) {
      this.status.classList.add('form-message--error');
      this.status.textContent = e.message;
    } finally {
      button.removeAttribute('aria-busy');
    }
  };
}
customElements.define('back-in-stock', BackInStock);
