# Testing checklist — mobile, desktop, cart, variants, checkout

Run through this on a **development store or unpublished preview** before going live.
Test on desktop (Chrome/Safari/Firefox) and a real phone (iOS Safari + Android Chrome).

## Global / layout
- [ ] Header is **transparent over the hero** on the homepage and turns **solid black
      + sticky** after scrolling.
- [ ] Logo renders (upload the official logo); wordmark fallback shows if none.
- [ ] Desktop dropdown menus open on hover/focus; "New Drop" is red.
- [ ] **Mobile nav drawer** opens, traps focus, closes on overlay/Esc, submenus expand.
- [ ] Announcement bar rotates and links work; can be disabled/edited.
- [ ] Footer: menus, social icons, country/language selector, payment icons, policy links.
- [ ] No horizontal scroll at 320px; 16px side gutters hold.

## Search
- [ ] Search icon opens the search overlay; input autofocuses.
- [ ] **Predictive search** shows products (thumbnail, price, availability), collections,
      pages and articles as you type (≥ 2 chars).
- [ ] "View all results" and the search results page work; pagination works.

## Collection page
- [ ] Banner shows collection image/placeholder, title, description, product count.
- [ ] **Sorting** re-orders without a full reload.
- [ ] **Filters** (availability, price, product type, color swatches, size) update the
      grid via AJAX; active-filter chips appear and clear; URL updates; back/forward works.
- [ ] **Mobile filter drawer** opens/closes; Apply/Clear work.
- [ ] Pagination **or** Load more (per setting) works; sold-out cards show the badge.
- [ ] Quick-add works from cards (single-variant adds; multi-variant opens size popover).

## Product page
- [ ] Media gallery: multiple images, mobile swipe, **click-to-zoom**, video plays on click.
- [ ] **Color** and **Size** selectors update price, image, URL (`?variant=`), availability.
- [ ] **Sold-out / unavailable** variants are visibly disabled; button text updates.
- [ ] **Inventory status** shows In stock / Low stock (real qty) / Sold out.
- [ ] **Size guide** link opens the drawer with your chart.
- [ ] Quantity selector works; **Add to bag** adds via AJAX and opens the cart drawer.
- [ ] **Accelerated checkout** buttons (Shop Pay/Apple/Google/PayPal) render when enabled.
- [ ] Collapsible Fit / Material / Construction / Care show metafield values (or fallback).
- [ ] **Specifications** block shows only the metafields you filled (no invented data).
- [ ] **Sticky mobile add-to-cart** bar appears after scrolling past the buy buttons.
- [ ] **Recommended** and **Recently viewed** rows populate (recently viewed after visiting
      a few products).

## Cart
- [ ] Cart **drawer** opens on add and via the bag icon; item count bubble updates.
- [ ] Quantity +/- and remove update **without page refresh**; subtotal updates.
- [ ] **Free-shipping progress bar** reflects the threshold and completes correctly.
- [ ] Add-on recommendation shows (if a collection is set) and can be added.
- [ ] **Cart page** (`/cart`) mirrors the drawer; quantities/remove work.
- [ ] "Checkout" goes to Shopify's native checkout; "Continue shopping" works.
- [ ] Switch cart type (drawer/page/notification) in Theme settings and re-test.

## Checkout (native Shopify)
- [ ] Reaches Shopify checkout; taxes and shipping calculate from your settings.
- [ ] A discount code applies. A test order (Bogus Gateway / real card in test mode)
      completes and triggers order + shipping confirmation emails.

## Accounts
- [ ] Register, login, logout, password recovery, reset, and account/order/address pages
      all work (classic accounts) — or Shopify-hosted (new accounts).

## Accessibility & performance
- [ ] Keyboard-only: tab through header, menus, drawers, forms; visible focus rings.
- [ ] `prefers-reduced-motion` on → reveal animations disabled.
- [ ] Images have alt text; forms have labels.
- [ ] Run **Lighthouse** (mobile) on Home, Collection, Product — target 90+ where
      realistic (largest factors: your image sizes and any third-party apps/pixels).
- [ ] No console errors on any page.

## Content sanity (brand)
- [ ] No fabricated products, tech-pack mockups, generated Arabic type, or clichéd imagery.
- [ ] "Made in …" only appears where you set the country metafield.
- [ ] Copy is short, confident, sales-focused.
