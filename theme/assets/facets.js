/**
 * KALA — facets.js
 *
 * Storefront filtering without full page loads. The filter form is a plain
 * GET form (works without JS); this module intercepts changes, fetches the
 * same URL rendered as this section only, and swaps the grid, the filter
 * counts and the active chips. URLs stay shareable via pushState.
 */

const { fetchSection, debounce, publish, toast, config } = window.Kala;

class FacetFilters extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.sectionId;
    this.form = this.querySelector(`#facets-form-${this.sectionId}`);

    const submitNow = () => this.render(this.urlFromForm());
    const submitSoon = debounce(submitNow, 450);

    // Sort select lives outside the form but is associated via form="".
    this.addEventListener('change', (event) => {
      if (!event.target.form || event.target.form !== this.form) return;
      if (event.target.matches('[data-debounce]')) return;
      submitNow();
    });
    this.addEventListener('input', (event) => {
      if (event.target.matches('[data-debounce]')) submitSoon();
    });
    this.form?.addEventListener('submit', (event) => {
      event.preventDefault();
      submitNow();
    });

    this.addEventListener('click', (event) => {
      const link = event.target.closest('[data-facet-link]');
      if (link) {
        event.preventDefault();
        this.render(link.href);
        return;
      }
      const more = event.target.closest('[data-load-more]');
      if (more) {
        event.preventDefault();
        this.loadMore(more);
      }
    });

    window.addEventListener('popstate', () => this.render(window.location.href, { push: false }));
  }

  urlFromForm() {
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(this.form)) {
      if (value !== '') params.append(key, value);
    }
    return `${window.location.pathname}?${params}`;
  }

  async render(url, { push = true } = {}) {
    this.controller?.abort();
    this.controller = new AbortController();
    this.setAttribute('aria-busy', 'true');

    // Remember which filter groups are open and what has focus so the swap is invisible.
    const openIds = [...this.querySelectorAll('details[open]')].map((d) => d.id);
    const focusedId = document.activeElement?.id;

    try {
      const doc = await fetchSection(url, this.sectionId, { signal: this.controller.signal });
      for (const id of ['facets-body', 'active-facets', 'product-grid', 'product-count', 'filter-count', 'pager']) {
        const next = doc.getElementById(`${id}-${this.sectionId}`);
        const current = document.getElementById(`${id}-${this.sectionId}`);
        if (next && current) current.replaceWith(next);
      }
      // Empty-state block lives next to the grid; re-sync it.
      const results = document.getElementById(`results-${this.sectionId}`);
      const nextResults = doc.getElementById(`results-${this.sectionId}`);
      const empty = nextResults?.querySelector('.coll__empty');
      results.querySelector('.coll__empty')?.remove();
      if (empty) results.querySelector('[data-grid]').before(empty);

      this.querySelectorAll('details').forEach((d) => {
        if (openIds.includes(d.id)) d.open = true;
      });
      if (focusedId) document.getElementById(focusedId)?.focus({ preventScroll: true });

      if (push) window.history.pushState({}, '', url);
      publish('filter_applied', { url: new URL(url, window.location.origin).search });
    } catch (e) {
      if (e.name !== 'AbortError') toast(config.strings.cartError);
    } finally {
      this.removeAttribute('aria-busy');
    }
  }

  async loadMore(link) {
    link.setAttribute('aria-busy', 'true');
    try {
      const doc = await fetchSection(link.href, this.sectionId);
      const items = doc.querySelectorAll(`#product-grid-${this.sectionId} > li`);
      document.getElementById(`product-grid-${this.sectionId}`).append(...items);
      const pager = doc.getElementById(`pager-${this.sectionId}`);
      document.getElementById(`pager-${this.sectionId}`).replaceWith(pager);
    } catch (e) {
      window.location.href = link.href;
    }
  }
}
customElements.define('facet-filters', FacetFilters);
