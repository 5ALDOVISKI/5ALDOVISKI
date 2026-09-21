/* ==========================================================================
   MAYDAN FIGHTWEAR — facets.js
   Collection filtering + sorting with the Shopify Storefront Filtering API.
   AJAX-updates the product grid without a full reload, updates history,
   handles the mobile filter drawer and optional load-more.
   ========================================================================== */
(function () {
  'use strict';

  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  class FacetFiltersForm extends HTMLElement {
    constructor() {
      super();
      this.debouncedOnSubmit = this.debounce((e) => this.onSubmit(e), 500);
      const form = this.querySelector('form');
      if (form) {
        form.addEventListener('input', this.debouncedOnSubmit.bind(this));
      }
      this.bindDrawer();
    }

    debounce(fn, wait) {
      let t;
      return function () {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, arguments), wait);
      };
    }

    onSubmit(event) {
      const form = this.querySelector('form');
      const formData = new FormData(form);
      const searchParams = new URLSearchParams(formData).toString();
      this.renderPage(searchParams, event);
    }

    static renderCounts(source, target) {
      const countEls = document.querySelectorAll('[data-collection-count]');
      const newCount = source.querySelector('[data-collection-count]');
      if (newCount) {
        countEls.forEach((el) => (el.innerHTML = newCount.innerHTML));
      }
    }

    renderPage(searchParams, event, updateURL = true) {
      const grid = document.querySelector('[data-product-grid-container]');
      if (grid) grid.classList.add('is-loading');

      const sectionId = this.dataset.sectionId;
      const url = `${window.location.pathname}?section_id=${sectionId}&${searchParams}`;

      fetch(url)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          // Product grid
          const newGrid = html.querySelector('[data-product-grid-container]');
          const currentGrid = document.querySelector('[data-product-grid-container]');
          if (newGrid && currentGrid) currentGrid.innerHTML = newGrid.innerHTML;

          // Active facets
          this.renderActiveFacets(html);
          // Filter options (counts/availability)
          this.renderFilters(html, event);
          // Counts
          FacetFiltersForm.renderCounts(html, document);

          if (currentGrid) currentGrid.classList.remove('is-loading');
          if (updateURL) this.updateURLHash(searchParams);

          // Re-reveal
          if (window.MAYDAN && window.MAYDAN._revealObserver) {
            document.querySelectorAll('[data-product-grid-container] .reveal').forEach((el) => el.classList.add('is-visible'));
          }
          // Scroll to top of grid on filter change
          const anchor = document.querySelector('[data-collection-anchor]');
          if (anchor && event && event.type !== 'popstate') {
            const y = anchor.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        })
        .catch(() => {
          if (grid) grid.classList.remove('is-loading');
        });
    }

    renderActiveFacets(html) {
      const newActive = html.querySelector('[data-active-facets]');
      document.querySelectorAll('[data-active-facets]').forEach((el) => {
        if (newActive) el.innerHTML = newActive.innerHTML;
      });
    }

    renderFilters(html, event) {
      const newForm = html.querySelector('facet-filters-form form');
      if (!newForm) return;
      const targetForm = this.querySelector('form');
      // Update each facet group's counts while preserving open/checked interaction that triggered event
      const newGroups = newForm.querySelectorAll('[data-facet-group]');
      newGroups.forEach((newGroup) => {
        const id = newGroup.dataset.facetGroup;
        const current = targetForm.querySelector(`[data-facet-group="${id}"]`);
        if (!current) return;
        // Don't overwrite the group the user is currently interacting with (keeps focus)
        if (event && event.target && current.contains(event.target)) {
          // update only the counts spans
          newGroup.querySelectorAll('[data-facet-count]').forEach((span) => {
            const val = span.dataset.facetValue;
            const match = current.querySelector(`[data-facet-count][data-facet-value="${val}"]`);
            if (match) match.innerHTML = span.innerHTML;
          });
        } else {
          current.innerHTML = newGroup.innerHTML;
        }
      });
    }

    updateURLHash(searchParams) {
      history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams ? '?' + searchParams : ''}`);
    }

    bindDrawer() {
      const openBtn = document.querySelector('[data-filter-drawer-open]');
      const closeEls = this.querySelectorAll('[data-filter-drawer-close]');
      const overlay = this.querySelector('.facets-sidebar__overlay');
      const self = this;
      function open() {
        self.classList.add('active');
        lockScroll(true);
      }
      function close() {
        self.classList.remove('active');
        lockScroll(false);
      }
      if (openBtn) openBtn.addEventListener('click', open);
      closeEls.forEach((el) => el.addEventListener('click', close));
      if (overlay) overlay.addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.classList.contains('active')) close();
      });
    }
  }
  customElements.define('facet-filters-form', FacetFiltersForm);

  // Handle back/forward
  window.addEventListener('popstate', (event) => {
    const form = document.querySelector('facet-filters-form');
    if (form) {
      const searchParams = event.state ? event.state.searchParams : window.location.search.slice(1);
      form.renderPage(searchParams, event, false);
    }
  });

  /* Sort select (submits the facet form) */
  document.addEventListener('change', (e) => {
    const sort = e.target.closest('[data-sort-select]');
    if (!sort) return;
    const form = document.querySelector('facet-filters-form');
    if (!form) return;
    const hidden = form.querySelector('[name="sort_by"]');
    if (hidden) {
      hidden.value = sort.value;
      form.onSubmit(e);
    } else {
      // fallback: reload with sort param
      const params = new URLSearchParams(window.location.search);
      params.set('sort_by', sort.value);
      window.location.search = params.toString();
    }
  });

  /* Load more (progressive) */
  class LoadMore extends HTMLElement {
    constructor() {
      super();
      this.button = this.querySelector('[data-load-more]');
      if (this.button) {
        this.button.addEventListener('click', this.onClick.bind(this));
      }
    }
    async onClick(e) {
      e.preventDefault();
      const nextUrl = this.button.dataset.nextUrl;
      if (!nextUrl) return;
      this.button.classList.add('loading');
      const sectionId = this.button.dataset.sectionId;
      try {
        const res = await fetch(`${nextUrl}${nextUrl.includes('?') ? '&' : '?'}section_id=${sectionId}`);
        const text = await res.text();
        const parsed = new DOMParser().parseFromString(text, 'text/html');
        const newItems = parsed.querySelectorAll('[data-product-grid] > *');
        const grid = document.querySelector('[data-product-grid]');
        newItems.forEach((item) => {
          if (item.classList) item.classList.add('is-visible');
          grid.appendChild(item);
        });
        const newButton = parsed.querySelector('[data-load-more]');
        if (newButton && newButton.dataset.nextUrl) {
          this.button.dataset.nextUrl = newButton.dataset.nextUrl;
        } else {
          this.button.remove();
        }
      } catch (err) {
        /* noop */
      } finally {
        this.button.classList.remove('loading');
      }
    }
  }
  customElements.define('load-more', LoadMore);
})();
