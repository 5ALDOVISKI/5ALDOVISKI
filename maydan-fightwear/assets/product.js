/* ==========================================================================
   MAYDAN FIGHTWEAR — product.js
   Product page interactivity: variant selection, media switching, zoom,
   size-guide drawer, sticky add-to-cart bar, recently viewed products.
   Loaded only on the product template.
   ========================================================================== */
(function () {
  'use strict';
  const CFG = window.MAYDAN || {};

  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  /* --------------------- Variant selection controller ------------------- */
  class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.section = this.dataset.section;
      this.url = this.dataset.url;
      this.variantData = this.getVariantData();
      this.addEventListener('change', this.onVariantChange.bind(this));
    }

    getVariantData() {
      const script = this.querySelector('[data-variant-json]');
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        return [];
      }
    }

    onVariantChange() {
      this.updateSelectedOptions();
      this.updateCurrentVariant();
      this.updateSelectedLabels();
      if (!this.currentVariant) {
        this.setUnavailable();
        return;
      }
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.updatePrice();
      this.updateInventory();
      this.updateBuyButton();
      this.updateStickyBar();
    }

    updateSelectedOptions() {
      this.options = Array.from(this.querySelectorAll('[data-option-selector]')).map((selector) => {
        if (selector.type === 'radio' || selector.tagName === 'FIELDSET') {
          const checked = selector.querySelector('input:checked');
          return checked ? checked.value : null;
        }
        return selector.value;
      });
      // Radio-based: gather one value per option index
      const groups = this.querySelectorAll('[data-option-index]');
      this.options = Array.from(groups).map((group) => {
        const checked = group.querySelector('input:checked');
        return checked ? checked.value : null;
      });
    }

    updateCurrentVariant() {
      this.currentVariant = this.variantData.find((variant) => {
        return variant.options.every((opt, i) => this.options[i] === opt);
      });
    }

    updateSelectedLabels() {
      this.querySelectorAll('[data-selected-value]').forEach((el) => {
        const index = parseInt(el.dataset.optionIndex, 10);
        if (this.options[index]) el.textContent = this.options[index];
      });
    }

    updateMedia() {
      if (!this.currentVariant || this.currentVariant.featured_media == null) return;
      const mediaId = this.currentVariant.featured_media.id;
      const gallery = document.querySelector('[data-product-media-gallery]');
      if (!gallery) return;
      const target = gallery.querySelector(`[data-media-id="${mediaId}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    updateURL() {
      if (!this.currentVariant || !this.url) return;
      window.history.replaceState({}, '', `${this.url}?variant=${this.currentVariant.id}`);
    }

    updateVariantInput() {
      const input = document.querySelector(`#product-form-${this.section} [name="id"]`);
      if (input) {
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    updatePrice() {
      const priceEl = document.querySelector('[data-product-price]');
      if (!priceEl) return;
      const v = this.currentVariant;
      let html = `<span class="price__current">${window.MAYDAN.formatMoney(v.price)}</span>`;
      if (v.compare_at_price && v.compare_at_price > v.price) {
        html =
          `<span class="price__sale">${window.MAYDAN.formatMoney(v.price)}</span>` +
          `<s class="price__compare">${window.MAYDAN.formatMoney(v.compare_at_price)}</s>`;
      }
      priceEl.innerHTML = html;
    }

    updateInventory() {
      const el = document.querySelector('[data-inventory-status]');
      if (!el) return;
      const v = this.currentVariant;
      el.className = 'product__inventory';
      if (!v.available) {
        el.classList.add('product__inventory--out');
        el.textContent = el.dataset.outText || 'Sold out';
      } else if (v.inventory_management && v.inventory_quantity != null && v.inventory_quantity > 0 && v.inventory_quantity <= parseInt(el.dataset.lowThreshold || '6', 10)) {
        el.classList.add('product__inventory--low');
        el.textContent = (el.dataset.lowText || 'Low stock — {n} left').replace('{n}', v.inventory_quantity);
      } else {
        el.classList.add('product__inventory--in');
        el.textContent = el.dataset.inText || 'In stock';
      }
    }

    updateBuyButton() {
      const btn = document.querySelector(`#product-form-${this.section} [type="submit"]`);
      if (!btn) return;
      const text = btn.querySelector('[data-add-text]');
      if (!this.currentVariant) {
        btn.setAttribute('aria-disabled', 'true');
        if (text) text.textContent = CFG.strings.unavailable;
      } else if (!this.currentVariant.available) {
        btn.setAttribute('aria-disabled', 'true');
        if (text) text.textContent = CFG.strings.soldOut;
      } else {
        btn.removeAttribute('aria-disabled');
        if (text) text.textContent = CFG.strings.addToCart;
      }
    }

    setUnavailable() {
      const btn = document.querySelector(`#product-form-${this.section} [type="submit"]`);
      const text = btn && btn.querySelector('[data-add-text]');
      if (btn) btn.setAttribute('aria-disabled', 'true');
      if (text) text.textContent = CFG.strings.unavailable;
      const priceEl = document.querySelector('[data-product-price]');
      if (priceEl) priceEl.classList.add('is-unavailable');
    }

    updateStickyBar() {
      const bar = document.querySelector('[data-sticky-price]');
      if (bar && this.currentVariant) bar.innerHTML = window.MAYDAN.formatMoney(this.currentVariant.price);
    }
  }
  customElements.define('variant-selects', VariantSelects);

  /* ----------------------------- Image zoom ----------------------------- */
  function initZoom() {
    const modal = document.querySelector('[data-zoom-modal]');
    if (!modal) return;
    const modalImg = modal.querySelector('img');
    const close = modal.querySelector('[data-zoom-close]');
    document.querySelectorAll('[data-zoom-trigger]').forEach((img) => {
      img.addEventListener('click', () => {
        const src = img.dataset.zoomSrc || img.currentSrc || img.src;
        modalImg.src = src;
        modalImg.alt = img.alt || '';
        modal.classList.add('active');
        lockScroll(true);
      });
    });
    function closeModal() {
      modal.classList.remove('active');
      lockScroll(false);
      modalImg.src = '';
    }
    if (close) close.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === modalImg || e.target.closest('.media-zoom-modal__overlay')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  /* -------------------------- Deferred video ---------------------------- */
  function initDeferredMedia() {
    document.querySelectorAll('[data-deferred-media]').forEach((el) => {
      const poster = el.querySelector('[data-deferred-poster]');
      if (!poster) return;
      poster.addEventListener('click', () => {
        const template = el.querySelector('template');
        if (template) {
          const content = template.content.firstElementChild.cloneNode(true);
          el.appendChild(content);
          const media = el.querySelector('video, iframe');
          if (media && media.tagName === 'VIDEO') media.play();
          poster.remove();
        }
      });
    });
  }

  /* ------------------------- Size guide drawer -------------------------- */
  function initSizeGuide() {
    const drawer = document.querySelector('[data-size-guide-drawer]');
    if (!drawer) return;
    const openBtns = document.querySelectorAll('[data-size-guide-open]');
    const closeEls = drawer.querySelectorAll('[data-size-guide-close]');
    function open() {
      drawer.classList.add('active');
      lockScroll(true);
    }
    function close() {
      drawer.classList.remove('active');
      lockScroll(false);
    }
    openBtns.forEach((b) =>
      b.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      })
    );
    closeEls.forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) close();
    });
  }

  /* ------------------------- Sticky add-to-cart bar --------------------- */
  function initStickyBar() {
    const bar = document.querySelector('[data-product-sticky-bar]');
    const anchor = document.querySelector('[data-product-buy-buttons]');
    if (!bar || !anchor) return;
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          bar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
        });
      },
      { threshold: 0 }
    );
    observer.observe(anchor);
    // Sticky bar "add" scrolls to form / submits
    const barBtn = bar.querySelector('[data-sticky-add]');
    if (barBtn) {
      barBtn.addEventListener('click', () => {
        const form = document.querySelector('product-form form');
        if (form) {
          const submit = form.querySelector('[type="submit"]');
          if (submit && submit.getAttribute('aria-disabled') !== 'true') {
            submit.click();
          } else {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }
  }

  /* ------------------------- Recently viewed ---------------------------- */
  function initRecentlyViewed() {
    const KEY = 'maydan:recently-viewed';
    const container = document.querySelector('[data-recently-viewed]');
    const currentHandle = document.body.dataset.productHandle;

    // Record current product
    if (currentHandle) {
      let list = [];
      try {
        list = JSON.parse(localStorage.getItem(KEY)) || [];
      } catch (e) {
        list = [];
      }
      list = list.filter((h) => h !== currentHandle);
      list.unshift(currentHandle);
      list = list.slice(0, 12);
      try {
        localStorage.setItem(KEY, JSON.stringify(list));
      } catch (e) {
        /* storage may be blocked */
      }
    }

    if (!container) return;
    let handles = [];
    try {
      handles = JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      handles = [];
    }
    handles = handles.filter((h) => h !== currentHandle).slice(0, parseInt(container.dataset.limit, 10) || 4);
    if (!handles.length) {
      const sectionEl = container.closest('[data-recently-viewed-section]');
      if (sectionEl && !window.Shopify?.designMode) sectionEl.hidden = true;
      return;
    }
    const query = handles.map((h) => `handle:${h}`).join(' OR ');
    const sectionId = container.dataset.sectionId;
    const url = `${CFG.routes.root}search?q=${encodeURIComponent(query)}&type=product&section_id=${sectionId}`;
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        const parsed = new DOMParser().parseFromString(text, 'text/html');
        const grid = parsed.querySelector('[data-recently-viewed-grid]');
        if (grid && grid.children.length) {
          container.innerHTML = grid.innerHTML;
          if (window.MAYDAN._revealObserver) {
            container.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
          }
        } else {
          const sectionEl = container.closest('[data-recently-viewed-section]');
          if (sectionEl && !window.Shopify?.designMode) sectionEl.hidden = true;
        }
      })
      .catch(() => {});
  }

  /* ------------------------------- Init --------------------------------- */
  function init() {
    initZoom();
    initDeferredMedia();
    initSizeGuide();
    initStickyBar();
    initRecentlyViewed();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  document.addEventListener('shopify:section:load', init);
})();
