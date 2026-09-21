# Analytics & marketing integration

The theme provides ready integration points that **load asynchronously and never block
rendering**. Enter IDs in **Theme settings → Analytics & marketing**.

> **Recommended:** For most stores, prefer Shopify's first-party channels and
> **Customer Events** (Settings → Customer events → Add custom pixel) for consent-aware,
> checkout-inclusive tracking. Use the theme fields below if you manage tags directly.

## Theme settings (Theme settings → Analytics & marketing)
| Field | What it does |
|-------|--------------|
| Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) | Injects async `gtag.js` + config. |
| Meta (Facebook) Pixel ID | Injects the Meta Pixel + `PageView` and a `<noscript>` fallback. |
| TikTok Pixel ID | Injects the TikTok pixel + `page()`. |
| Klaviyo public API key | Loads Klaviyo onsite async. Leave blank to use Shopify Email. |

Leaving a field blank omits that script entirely.

## Shopify Analytics
Built in — nothing to do. See **Analytics** in Admin. Add **Google & YouTube** and
**Meta** sales channels for first-party, server-side friendly tracking.

## Google Merchant Center
1. Install the **Google & YouTube** sales channel.
2. Connect Merchant Center and sync your product feed.
3. The theme already outputs **Product structured data** (JSON-LD with per-variant
   offers, availability, price, condition, and `countryOfOrigin` from your metafield),
   which helps rich results and feed quality.

## Meta product catalog
1. Install the **Facebook & Instagram** (Meta) sales channel.
2. Connect your Business account and sync the catalog.
3. Add the Meta Pixel ID above (or via the channel) for events.

## TikTok Shop catalog
1. Install the **TikTok** sales channel.
2. Sync your catalog and connect the TikTok Pixel (ID above or via the channel).

## Email / SMS
- **Klaviyo:** enter the public API key to enable onsite; connect the Klaviyo app for
  flows (welcome, abandoned cart, back-in-stock). Newsletter forms tag subscribers
  (`newsletter`, plus a source tag) and set marketing consent.
- **Shopify Email:** leave Klaviyo blank; subscribers created by the newsletter forms
  appear in Customers with marketing consent.

## Product reviews
Install a reviews app (e.g. Shopify's **Product Reviews**, Judge.me, Okendo). Most add an
app block you can drop into the product template (or use the generic **Apps** section).
The theme intentionally ships **no fake reviews**.

## Consent / privacy
Use Shopify's **Customer privacy / consent banner** (Settings → Customer privacy) so the
pixels above respect regional consent. Prefer Custom Pixels for automatic consent gating.
