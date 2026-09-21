/* ==========================================================================
   MAYDAN FIGHTWEAR — global.js
   Site-wide behaviour: header, mobile nav, cart drawer + AJAX cart,
   quick-add, predictive search, scroll reveal, quantity inputs.
   Vanilla JS + custom elements. No frameworks. Loaded with defer.
   ========================================================================== */
(function () {
  'use strict';

  const CFG = window.MAYDAN || {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------- Utilities -------------------------------- */
  function formatMoney(cents) {
    const format = (CFG.cart && CFG.cart.moneyFormat) || '${{amount}}';
    const value = (cents / 100).toFixed(2);
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const withComma = parts.join('.');
    const noDecimals = parts[0];
    return format
      .replace(/\{\{\s*amount\s*\}\}/g, withComma)
      .replace(/\{\{\s*amount_with_comma_separator\s*\}\}/g, withComma)
      .replace(/\{\{\s*amount_no_decimals\s*\}\}/g, noDecimals)
      .replace(/\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/g, noDecimals);
  }
  window.MAYDAN = window.MAYDAN || {};
  window.MAYDAN.formatMoney = formatMoney;

  function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: `application/${type}` }
    };
  }

  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), wait);
    };
  }

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, details, [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, elementToFocus) {
    const focusable = Array.from(container.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    (elementToFocus || first).focus();

    container._trapHandler = function (e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    container.addEventListener('keydown', container._trapHandler);
  }

  function removeTrapFocus(container, elementToFocus) {
    if (container && container._trapHandler) {
      container.removeEventListener('keydown', container._trapHandler);
    }
    if (elementToFocus) elementToFocus.focus();
  }

  function lockScroll(lock) {
    document.body.style.overflow = lock ? 'hidden' : '';
  }

  /* ------------------------- Sticky/transparent header ------------------ */
  function initHeader() {
    const wrapper = document.querySelector('[data-header-wrapper]');
    if (!wrapper) return;
    const isTransparent = wrapper.classList.contains('header--transparent');
    const onScroll = () => {
      if (window.scrollY > 40) {
        wrapper.classList.add('is-scrolled');
      } else {
        wrapper.classList.remove('is-scrolled');
      }
    };
    if (isTransparent) {
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ----------------------------- Mobile nav ----------------------------- */
  function initMobileNav() {
    const nav = document.querySelector('[data-mobile-nav]');
    if (!nav) return;
    const openBtn = document.querySelector('[data-mobile-nav-open]');
    const closeEls = nav.querySelectorAll('[data-mobile-nav-close]');

    function open() {
      nav.classList.add('is-open');
      nav.setAttribute('aria-hidden', 'false');
      lockScroll(true);
      trapFocus(nav);
    }
    function close() {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      lockScroll(false);
      removeTrapFocus(nav, openBtn);
    }
    if (openBtn) openBtn.addEventListener('click', open);
    closeEls.forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) close();
    });

    // Collapsible submenus in mobile nav
    nav.querySelectorAll('[data-mobile-submenu-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const target = btn.nextElementSibling;
        if (target) target.hidden = expanded;
      });
    });
  }

  /* ---------------------------- Scroll reveal --------------------------- */
  function initReveal() {
    if (prefersReducedMotion || !CFG.animations || !CFG.animations.revealOnScroll) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    window.MAYDAN._revealObserver = observer;
  }

  /* --------------------------- Quantity input --------------------------- */
  class QuantityInput extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input');
      this.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        e.preventDefault();
        const step = btn.name === 'plus' ? 1 : -1;
        const current = parseInt(this.input.value, 10) || 0;
        const min = parseInt(this.input.min, 10) || 1;
        const max = this.input.max ? parseInt(this.input.max, 10) : Infinity;
        const next = Math.min(Math.max(current + step, min), max);
        if (next !== current) {
          this.input.value = next;
          this.input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
  }
  customElements.define('quantity-input', QuantityInput);

  /* --------------------- Cart: shared rendering ------------------------- */
  const CartAPI = {
    getSectionsToRender() {
      const sections = ['cart-drawer', 'cart-icon-bubble', 'cart-notification'];
      return sections;
    },

    async add(formData, opener) {
      const body = formData instanceof FormData ? formData : null;
      const config = {
        method: 'POST',
        headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' }
      };
      if (body) {
        body.append('sections', this.sectionIds());
        body.append('sections_url', window.location.pathname);
        config.body = body;
      }
      try {
        const res = await fetch(`${CFG.routes.cart_add_url}`, config);
        const data = await res.json();
        if (data.status) {
          document.dispatchEvent(new CustomEvent('cart:error', { detail: data }));
          return { error: data };
        }
        document.dispatchEvent(new CustomEvent('cart:added', { detail: { item: data, opener } }));
        await this.refresh();
        return { item: data };
      } catch (err) {
        document.dispatchEvent(new CustomEvent('cart:error', { detail: { description: CFG.strings.cartError } }));
        return { error: err };
      }
    },

    async change(line, quantity) {
      const res = await fetch(`${CFG.routes.cart_change_url}`, {
        ...fetchConfig(),
        body: JSON.stringify({ line, quantity, sections: this.sectionIds(), sections_url: window.location.pathname })
      });
      const data = await res.json();
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      this.updateAll(data);
      return data;
    },

    async refresh() {
      const res = await fetch(`${CFG.routes.cart_url}?sections=${this.sectionIds()}`);
      const data = await res.json();
      // data is { 'cart-drawer': html, ... }
      this.updateSections(data);
      // fetch cart json for totals
      const cartRes = await fetch(`${CFG.routes.cart_url}.js`);
      const cart = await cartRes.json();
      this.updateAll(cart);
      return cart;
    },

    sectionIds() {
      return this.getSectionsToRender().join(',');
    },

    updateSections(sectionsHtml) {
      if (!sectionsHtml) return;
      Object.keys(sectionsHtml).forEach((id) => {
        const target = document.getElementById(`shopify-section-${id}`) || document.querySelector(`[data-section-render="${id}"]`);
        // We match by data attributes instead
      });
    },

    updateAll(cart) {
      // Update cart count bubbles
      const count = cart && (cart.item_count != null ? cart.item_count : (cart.sections ? null : 0));
      document.querySelectorAll('[data-cart-count]').forEach((el) => {
        if (cart && cart.item_count != null) {
          el.textContent = cart.item_count;
          el.hidden = cart.item_count === 0;
        }
      });
      if (cart && cart.item_count != null) {
        document.querySelectorAll('[data-cart-count-container]').forEach((el) => {
          el.classList.toggle('has-items', cart.item_count > 0);
        });
      }
    }
  };
  window.MAYDAN.CartAPI = CartAPI;

  /* --------------------------- Cart drawer ------------------------------ */
  class CartDrawer extends HTMLElement {
    constructor() {
      super();
      this.overlay = this.querySelector('[data-cart-overlay]');
      this.closeBtns = this.querySelectorAll('[data-cart-close]');
      this.bindEvents();
    }

    bindEvents() {
      if (this.overlay) this.overlay.addEventListener('click', () => this.close());
      this.closeBtns.forEach((b) => b.addEventListener('click', () => this.close()));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.classList.contains('active')) this.close();
      });
      // Open when items added (unless cart type is notification)
      document.addEventListener('cart:added', () => {
        if (CFG.cart.type === 'drawer') this.open();
      });
      // quantity + remove
      this.addEventListener('click', (e) => {
        const remove = e.target.closest('[data-cart-remove]');
        if (remove) {
          e.preventDefault();
          this.updateQuantity(remove.dataset.index, 0);
        }
      });
      this.addEventListener('change', (e) => {
        const input = e.target.closest('[data-quantity-input]');
        if (input) this.updateQuantity(input.dataset.index, input.value);
      });
    }

    open(focusEl) {
      this.classList.add('active');
      this.setAttribute('aria-hidden', 'false');
      lockScroll(true);
      const panel = this.querySelector('.cart-drawer__panel');
      setTimeout(() => trapFocus(this, this.querySelector('[data-cart-close]')), 50);
      document.dispatchEvent(new CustomEvent('cart-drawer:open'));
    }

    close() {
      this.classList.remove('active');
      this.setAttribute('aria-hidden', 'true');
      lockScroll(false);
      removeTrapFocus(this);
    }

    async updateQuantity(line, quantity) {
      this.classList.add('cart-drawer--loading');
      const res = await fetch(`${CFG.routes.cart_change_url}`, {
        ...fetchConfig(),
        body: JSON.stringify({
          line,
          quantity: parseInt(quantity, 10),
          sections: 'cart-drawer,cart-icon-bubble',
          sections_url: window.location.pathname
        })
      });
      const cart = await res.json();
      this.renderFromSections(cart);
      CartAPI.updateAll(cart);
      this.classList.add('active');
      this.classList.remove('cart-drawer--loading');
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    }

    renderFromSections(cart) {
      if (!cart.sections) return;
      const drawerHtml = cart.sections['cart-drawer'];
      if (drawerHtml) {
        const parsed = new DOMParser().parseFromString(drawerHtml, 'text/html');
        const newInner = parsed.querySelector('[data-cart-drawer-inner]');
        const currentInner = this.querySelector('[data-cart-drawer-inner]');
        if (newInner && currentInner) currentInner.innerHTML = newInner.innerHTML;
        this.classList.toggle('is-empty', cart.item_count === 0);
      }
      const bubbleHtml = cart.sections['cart-icon-bubble'];
      if (bubbleHtml) {
        document.querySelectorAll('[data-cart-icon-bubble]').forEach((el) => {
          el.innerHTML = bubbleHtml;
        });
      }
      this.bindDynamic();
    }

    bindDynamic() {
      // re-init quantity custom elements already handled by custom element upgrade
    }

    renderContents(cart) {
      this.renderFromSections(cart);
      this.open();
    }
  }
  customElements.define('cart-drawer', CartDrawer);

  // When items are added, refresh the drawer contents from returned sections
  document.addEventListener('cart:added', async (e) => {
    const drawer = document.querySelector('cart-drawer');
    const item = e.detail && e.detail.item;
    if (drawer && item && item.sections) {
      drawer.renderFromSections({ sections: item.sections, item_count: item.item_count != null ? item.item_count : undefined });
    }
    // Always refresh count + drawer from cart.js to be safe
    if (drawer) {
      const res = await fetch(`${CFG.routes.cart_url}?sections=cart-drawer,cart-icon-bubble`);
      const sections = await res.json();
      const cartRes = await fetch(`${CFG.routes.cart_url}.js`);
      const cart = await cartRes.json();
      cart.sections = sections;
      drawer.renderFromSections(cart);
      CartAPI.updateAll(cart);
    } else {
      CartAPI.refresh();
    }
  });

  /* --------------------------- Cart notification ------------------------ */
  class CartNotification extends HTMLElement {
    constructor() {
      super();
      this.closeBtn = this.querySelector('[data-notification-close]');
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
      document.addEventListener('cart:added', (e) => {
        if (CFG.cart.type === 'notification') this.show(e.detail.item);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }
    show(item) {
      if (item && item.sections && item.sections['cart-notification']) {
        const parsed = new DOMParser().parseFromString(item.sections['cart-notification'], 'text/html');
        const newInner = parsed.querySelector('[data-notification-inner]');
        const cur = this.querySelector('[data-notification-inner]');
        if (newInner && cur) cur.innerHTML = newInner.innerHTML;
      }
      this.classList.add('active');
      clearTimeout(this._timer);
      this._timer = setTimeout(() => this.close(), 6000);
    }
    close() {
      this.classList.remove('active');
    }
  }
  customElements.define('cart-notification', CartNotification);

  /* ------------------------- Cart items (cart page) --------------------- */
  class CartItems extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', (e) => {
        const input = e.target.closest('[data-quantity-input]');
        if (input) this.updateQuantity(input.dataset.index, input.value);
      });
      this.addEventListener('click', (e) => {
        const remove = e.target.closest('[data-cart-remove]');
        if (remove) {
          e.preventDefault();
          this.updateQuantity(remove.dataset.index, 0);
        }
      });
    }
    async updateQuantity(line, quantity) {
      this.classList.add('is-loading');
      const res = await fetch(`${CFG.routes.cart_change_url}`, {
        ...fetchConfig(),
        body: JSON.stringify({
          line,
          quantity: parseInt(quantity, 10),
          sections: 'main-cart,cart-icon-bubble',
          sections_url: window.location.pathname
        })
      });
      const cart = await res.json();
      if (cart.sections && cart.sections['main-cart']) {
        const parsed = new DOMParser().parseFromString(cart.sections['main-cart'], 'text/html');
        const newMain = parsed.querySelector('[data-cart-main]');
        const curMain = document.querySelector('[data-cart-main]');
        if (newMain && curMain) curMain.innerHTML = newMain.innerHTML;
      }
      CartAPI.updateAll(cart);
      this.classList.remove('is-loading');
    }
  }
  customElements.define('cart-items', CartItems);

  /* ---------------------------- Product form ---------------------------- */
  class ProductForm extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector('form');
      if (!this.form) return;
      this.submitButton = this.querySelector('[type="submit"]');
      this.form.addEventListener('submit', this.onSubmit.bind(this));
    }
    async onSubmit(e) {
      // Only intercept when cart is not "page" type OR when data attribute wants AJAX
      if (CFG.cart.type === 'page' && !this.hasAttribute('data-ajax')) return;
      e.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;
      this.submitButton.classList.add('loading');
      this.submitButton.setAttribute('aria-disabled', 'true');
      const formData = new FormData(this.form);
      formData.append('sections', 'cart-drawer,cart-icon-bubble,cart-notification');
      formData.append('sections_url', window.location.pathname);
      try {
        const res = await fetch(CFG.routes.cart_add_url, {
          method: 'POST',
          headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
          body: formData
        });
        const data = await res.json();
        if (data.status) {
          this.showError(data.description || CFG.strings.cartError);
        } else {
          document.dispatchEvent(new CustomEvent('cart:added', { detail: { item: data } }));
        }
      } catch (err) {
        this.showError(CFG.strings.cartError);
      } finally {
        this.submitButton.classList.remove('loading');
        this.submitButton.removeAttribute('aria-disabled');
      }
    }
    showError(msg) {
      let el = this.querySelector('[data-form-error]');
      if (el) {
        el.textContent = msg;
        el.hidden = false;
      }
    }
  }
  customElements.define('product-form', ProductForm);

  /* ----------------------------- Quick add ------------------------------ */
  class QuickAdd extends HTMLElement {
    constructor() {
      super();
      this.button = this.querySelector('[data-quick-add-button]');
      this.popover = this.querySelector('[data-quick-add-popover]');
      this.singleVariantId = this.dataset.variantId;
      if (this.button) this.button.addEventListener('click', this.onClick.bind(this));
      if (this.popover) {
        this.popover.addEventListener('click', (e) => {
          const opt = e.target.closest('[data-variant-id]');
          if (opt) {
            e.preventDefault();
            this.addVariant(opt.dataset.variantId, opt);
          }
        });
        document.addEventListener('click', (e) => {
          if (!this.contains(e.target)) this.closePopover();
        });
      }
    }
    onClick(e) {
      e.preventDefault();
      if (this.dataset.hasOptions === 'true' && this.popover) {
        this.togglePopover();
      } else if (this.singleVariantId) {
        this.addVariant(this.singleVariantId, this.button);
      }
    }
    togglePopover() {
      this.popover.hidden = !this.popover.hidden;
    }
    closePopover() {
      if (this.popover) this.popover.hidden = true;
    }
    async addVariant(id, trigger) {
      trigger.classList.add('loading');
      const formData = new FormData();
      formData.append('id', id);
      formData.append('quantity', 1);
      formData.append('sections', 'cart-drawer,cart-icon-bubble,cart-notification');
      formData.append('sections_url', window.location.pathname);
      try {
        const res = await fetch(CFG.routes.cart_add_url, {
          method: 'POST',
          headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
          body: formData
        });
        const data = await res.json();
        if (!data.status) {
          document.dispatchEvent(new CustomEvent('cart:added', { detail: { item: data } }));
        }
      } catch (err) {
        /* silent */
      } finally {
        trigger.classList.remove('loading');
        this.closePopover();
      }
    }
  }
  customElements.define('quick-add', QuickAdd);

  /* -------------------- Cart drawer open on icon click ------------------ */
  function initCartTrigger() {
    document.querySelectorAll('[data-cart-drawer-toggle]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (CFG.cart.type === 'drawer') {
          e.preventDefault();
          const drawer = document.querySelector('cart-drawer');
          if (drawer) drawer.open();
        }
      });
    });
  }

  /* --------------------------- Predictive search ------------------------ */
  class PredictiveSearch extends HTMLElement {
    constructor() {
      super();
      this.input = this.querySelector('input[type="search"]');
      this.results = this.querySelector('[data-predictive-results]');
      this.reset = this.querySelector('[data-search-reset]');
      this.cachedResults = {};
      if (this.input) {
        this.input.addEventListener(
          'input',
          debounce(this.onInput.bind(this), 250)
        );
      }
      if (this.reset) {
        this.reset.addEventListener('click', () => {
          this.input.value = '';
          this.input.focus();
          this.clearResults();
        });
      }
    }
    onInput() {
      const q = this.input.value.trim();
      if (q.length < 2) {
        this.clearResults();
        return;
      }
      this.getResults(q);
    }
    async getResults(q) {
      if (this.cachedResults[q]) {
        this.renderResults(this.cachedResults[q]);
        return;
      }
      this.setAttribute('loading', '');
      const types = 'product,collection,page,article';
      const url = `${CFG.routes.predictive_search_url}?q=${encodeURIComponent(
        q
      )}&resources[type]=${types}&resources[limit]=6&section_id=predictive-search`;
      try {
        const res = await fetch(url);
        const text = await res.text();
        const parsed = new DOMParser().parseFromString(text, 'text/html');
        const resultsMarkup = parsed.querySelector('[data-predictive-results]');
        const html = resultsMarkup ? resultsMarkup.innerHTML : '';
        this.cachedResults[q] = html;
        this.renderResults(html);
      } catch (err) {
        this.clearResults();
      } finally {
        this.removeAttribute('loading');
      }
    }
    renderResults(html) {
      if (this.results) {
        this.results.innerHTML = html;
        this.results.hidden = false;
      }
    }
    clearResults() {
      if (this.results) {
        this.results.innerHTML = '';
        this.results.hidden = true;
      }
      this.removeAttribute('loading');
    }
  }
  customElements.define('predictive-search', PredictiveSearch);

  /* ---------------------------- Search modal ---------------------------- */
  function initSearchModal() {
    const modal = document.querySelector('[data-search-modal]');
    if (!modal) return;
    const openBtns = document.querySelectorAll('[data-search-open]');
    const closeEls = modal.querySelectorAll('[data-search-close]');
    const input = modal.querySelector('input[type="search"]');
    function open() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      lockScroll(true);
      setTimeout(() => {
        if (input) input.focus();
        trapFocus(modal, input);
      }, 60);
    }
    function close() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      lockScroll(false);
      removeTrapFocus(modal);
    }
    openBtns.forEach((b) =>
      b.addEventListener('click', (e) => {
        e.preventDefault();
        open();
      })
    );
    closeEls.forEach((el) => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  }

  /* ---------------------- Announcement bar rotator ---------------------- */
  function initAnnouncement() {
    document.querySelectorAll('[data-announcement-bar]').forEach((bar) => {
      const slides = bar.querySelectorAll('.announcement-bar__slide');
      if (slides.length < 2) return;
      const track = bar.querySelector('[data-announcement-track]');
      let index = 0;
      const speed = parseInt(bar.dataset.speed, 10) || 5000;
      function go(i) {
        index = (i + slides.length) % slides.length;
        if (track) track.style.transform = `translateX(-${index * 100}%)`;
      }
      const prev = bar.querySelector('[data-announcement-prev]');
      const next = bar.querySelector('[data-announcement-next]');
      if (prev) prev.addEventListener('click', () => go(index - 1));
      if (next) next.addEventListener('click', () => go(index + 1));
      if (!prefersReducedMotion && bar.dataset.autoplay === 'true') {
        setInterval(() => go(index + 1), speed);
      }
    });
  }

  /* --------------------------- Newsletter UX ---------------------------- */
  function initNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
      // Shopify handles the customer create; we only enhance success/error display
      const params = new URLSearchParams(window.location.search);
      if (params.get('customer_posted') === 'true') {
        const msg = form.querySelector('[data-newsletter-success]');
        if (msg) msg.hidden = false;
      }
    });
  }

  /* ------------------------------- Init --------------------------------- */
  function init() {
    initHeader();
    initMobileNav();
    initReveal();
    initCartTrigger();
    initSearchModal();
    initAnnouncement();
    initNewsletter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init on Shopify theme editor section load
  document.addEventListener('shopify:section:load', init);
})();
