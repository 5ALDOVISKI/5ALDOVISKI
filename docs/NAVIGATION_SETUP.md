# Navigation setup

Menus live in **Shopify Admin → Online Store → Navigation**. The theme uses two menus
by default: **Main menu** (header) and **Footer** (footer columns).

## Main menu (handle: `main-menu`)
Used by the header. The item titled **New Drop** is accented in red (configurable in
Theme editor → Header → "Highlighted menu item").

```
New Drop        → /collections/new-drop
Rashguards      → /collections/rashguards
Fight Shorts    → /collections/fight-shorts
Essentials      → /collections/essentials
```

Optional dropdowns: add sub-items under any top-level item (e.g. under *Rashguards*:
Long Sleeve, Short Sleeve). The header renders a dropdown on desktop and an expandable
group in the mobile drawer.

## Footer menus
The footer uses editable **Menu column** blocks (Theme editor → Footer). Point each
column at a menu. Suggested menus:

**Shop** (handle: `footer` or `footer-shop`)
```
Shop All        → /collections/all
New Drop        → /collections/new-drop
Rashguards      → /collections/rashguards
Fight Shorts    → /collections/fight-shorts
Essentials      → /collections/essentials
```

**Help** (handle: `footer-help`)
```
About           → /pages/about
Contact         → /pages/contact
FAQ             → /pages/faq
Size Guide      → /pages/size-guide
Shipping & Returns → /pages/shipping-returns
```

Legal links (Privacy, Terms, Refund, Shipping policies) appear automatically in the
footer bottom bar from **Settings → Policies** (toggle "Show store policy links" in the
footer settings), or add them to a menu if you prefer.

## Social links
Set Instagram, TikTok, YouTube, X and Facebook URLs in **Theme settings → Social media**.
They render in the footer, mobile drawer and password page, and feed `sameAs` in the
Organization structured data.
