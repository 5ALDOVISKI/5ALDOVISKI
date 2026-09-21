# MAYDAN Fightwear — Shopify Online Store 2.0 theme

A production-ready, native Shopify OS 2.0 theme for a premium no-gi / combat-sports
apparel brand. Black + bone dominant, muted-red accent, condensed editorial type.
Built with Liquid, JSON templates, reusable sections/blocks, the native Shopify
cart & checkout, predictive search, customer accounts, metafields and Markets.

> Passes `@shopify/theme-check` with **0 offenses**.

---

## Quick start

1. **Upload the theme**
   - Build the ZIP from the repo root: `./build-theme-zip.sh` → produces `maydan-fightwear.zip`
   - Shopify Admin → **Online Store → Themes → Add theme → Upload zip file**
   - (Or, with the Shopify CLI: `cd maydan-fightwear && shopify theme push`)
2. **Add the official logo** — Theme editor → **Theme settings → Logo**. Upload the
   supplied MAYDAN logo (transparent PNG/SVG). Do not recreate or alter it.
3. **Create collections & menus** — see [`docs/COLLECTION_SETUP.md`](../docs/COLLECTION_SETUP.md)
   and [`docs/NAVIGATION_SETUP.md`](../docs/NAVIGATION_SETUP.md).
4. **Create metafield definitions** — see [`docs/METAFIELDS.md`](../docs/METAFIELDS.md).
5. **Create pages & assign templates** — see [`docs/PAGES_SETUP.md`](../docs/PAGES_SETUP.md).
6. **Configure payments, shipping, tax, returns** — see
   [`docs/PAYMENTS_SHIPPING_CHECKLIST.md`](../docs/PAYMENTS_SHIPPING_CHECKLIST.md).
7. **Add analytics & marketing** — see [`docs/ANALYTICS_SETUP.md`](../docs/ANALYTICS_SETUP.md).
8. **Replace placeholder campaign imagery** — see
   [`docs/PLACEHOLDER_PHOTOGRAPHY.md`](../docs/PLACEHOLDER_PHOTOGRAPHY.md).
9. **Test everything** — [`docs/TESTING_CHECKLIST.md`](../docs/TESTING_CHECKLIST.md).

Everything in the storefront (hero, banners, featured products, benefits, footer,
colours, fonts, buttons, spacing, free-shipping threshold, etc.) is editable in the
**Theme editor** without touching code.

---

## Brand system

| Token | Hex | Use |
|-------|-----|-----|
| Primary black | `#090909` | Dominant background, header |
| Bone / off-white | `#EEE9DF` | Dominant text / light sections |
| Charcoal | `#181818` | Secondary surfaces |
| Muted red | `#A31E27` | Small accents, buttons, hovers, promo bars only |
| Neutral grey | `#A7A39B` | Muted text, borders |

Colours are implemented as **color schemes** (Theme settings → Colors) so any section
can switch palette in the editor. Headlines use a bold condensed face (default
*Archivo*; switch to *Archivo Narrow* / *Oswald* in Typography for a tighter look);
body uses *Assistant*. Both are set in Theme settings → Typography.

### Arab identity
The brand's Arab identity lives in **meaning and restraint**, not decoration: the name
MAYDAN (the ground where people meet and earn their place), Arabic-rooted product/drop
names (e.g. *MUHARIB*), and a quiet-luxury aesthetic. The theme **never generates Arabic
type or clichéd imagery**. If you have a finalized, approved Arabic wordmark graphic,
upload it in **Header → Arabic wordmark (optional)**; it stays empty otherwise.

---

## Structure

```
maydan-fightwear/
├── assets/          base.css + component CSS, global/product/facets JS
├── config/          settings_schema.json, settings_data.json
├── layout/          theme.liquid, password.liquid
├── locales/         en.default.json, en.default.schema.json
├── sections/        homepage + main + content sections, header/footer groups
├── snippets/        card-product, price, badges, swatches, cart, SEO, icons…
└── templates/       JSON templates + customers/ + gift_card.liquid + policy.json
```

### Key sections
- **Homepage:** `announcement-bar`, `header`, `hero`, `shop-by-category`,
  `featured-products`, `featured-drop-banner`, `product-benefits`, `email-signup`, `footer`
- **Commerce:** `main-product`, `main-collection`, `main-cart`, `cart-drawer`,
  `cart-notification`, `predictive-search`, `related-products`, `recently-viewed`
- **Content:** `rich-text`, `image-with-text`, `contact-form`, `faq`, `size-guide`, `main-policy`
- **Customer:** `main-account`, `main-login`, `main-register`, `main-order`,
  `main-addresses`, `main-reset-password`, `main-activate-account`

## Performance & accessibility
- Mobile-first, responsive images (`image_tag` with `srcset`/`sizes`), lazy loading
  below the fold, `fetchpriority="high"` on the hero.
- Minimal vanilla JS (no frameworks/animation libraries); scripts `defer`; analytics async.
- Semantic HTML, visible focus states, keyboard-accessible nav/drawers, `prefers-reduced-motion`
  respected, descriptive alt text, labelled forms, AA-minded contrast.
- Explicit image dimensions to avoid layout shift (CLS).

## SEO
Editable title/meta (Shopify Admin), canonical URLs, Open Graph + Twitter cards,
Product / Organization / WebSite / Breadcrumb / FAQ / Article structured data,
clean heading hierarchy, collection descriptions, social-sharing image setting.

## Notes / limits
- Uses Shopify's **native cart and checkout** — no fake checkout or separate backend.
- Checkout page customization requires **Shopify Plus** (Checkout Extensibility); this
  theme respects standard limitations.
- Do not hard-code product specs, tax, or shipping — they come from metafields / native
  Shopify settings.
```

_Generated with Claude Code._
