# MAYDAN Fightwear — setup guides

Store-owner documentation for the MAYDAN Shopify Online Store 2.0 theme
(the theme itself lives in [`../maydan-fightwear/`](../maydan-fightwear/)).

Work through them roughly in this order:

1. [Collection setup](COLLECTION_SETUP.md) — collections, images, filters, product setup
2. [Navigation setup](NAVIGATION_SETUP.md) — header & footer menus, social links
3. [Metafield definitions](METAFIELDS.md) — fit, fabric, GSM, care, model, country, etc.
4. [Pages & template assignment](PAGES_SETUP.md) — About, Contact, FAQ, Size Guide,
   Shipping & Returns, policies
5. [Payments, shipping, tax & returns checklist](PAYMENTS_SHIPPING_CHECKLIST.md)
6. [Analytics & marketing integration](ANALYTICS_SETUP.md) — GA4, Meta, TikTok, Klaviyo,
   Merchant Center, catalogs
7. [Placeholder photography replacement](PLACEHOLDER_PHOTOGRAPHY.md)
8. [Testing checklist](TESTING_CHECKLIST.md) — mobile, desktop, cart, variants, checkout

## Build / upload the theme
From the repo root:

```bash
./build-theme-zip.sh          # creates maydan-fightwear.zip (theme files at zip root)
```

Then **Shopify Admin → Online Store → Themes → Add theme → Upload zip file**, or push
with the Shopify CLI (`cd maydan-fightwear && shopify theme push`).

The theme passes `@shopify/theme-check` with **0 offenses**.
