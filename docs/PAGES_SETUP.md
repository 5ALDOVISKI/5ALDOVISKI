# Pages & template assignment

Create these in **Shopify Admin → Online Store → Pages → Add page**, then assign the
matching **Theme template** in the page's *Online store* / *Theme template* selector.

| Page | Suggested handle | Theme template | Notes |
|------|------------------|----------------|-------|
| About MAYDAN | `about` | `page.about` | Editorial brand story (kept short). Edit copy in the theme editor. |
| Contact | `contact` | `page.contact` | Native Shopify contact form. |
| FAQ | `faq` | `page.faq` | Accordion + FAQ structured data. Edit Q&As in the editor. |
| Size Guide | `size-guide` | `page.size-guide` | Editable charts + how-to-measure. Also feeds the PDP size-guide drawer. |
| Shipping & Returns | `shipping-returns` | `page.shipping-returns` | Put your policy copy in the page **content** (rich text). |

For a plain page, leave the template as **Default page** (`page`).

## Store policies (Privacy, Terms, Refund, Shipping)
These are **not pages** — set them in **Settings → Policies**. Shopify generates
`/policies/...` URLs rendered by the theme's `policy` template. They also appear in the
footer bottom bar. Fill in:
- Refund policy
- Privacy policy
- Terms of service
- Shipping policy

## Size guide drawer (product page)
The product page has a size-guide **drawer**. Point it at your Size Guide page:
Product template → section settings → **Size guide page** → choose *Size Guide*.
- If the Size Guide page has rich-text **content**, the drawer shows it inline.
- If you built the page with the Size Guide **section** (charts as blocks), the drawer
  shows a short link that opens the full page. For inline drawer content, also paste a
  concise table into the page's rich-text content.

## Homepage
The homepage uses the `index` JSON template (already configured with hero, categories,
featured products, drop banner, benefits, email capture). Reorder/remove/add sections
freely in **Theme editor → Home page**.

## Blog / Journal (optional)
Create a blog (Online Store → Blog posts). Article images and excerpts render in the
`blog` / `article` templates. Predictive search includes articles.
