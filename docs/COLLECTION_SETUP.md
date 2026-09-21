# Collection setup

Create these collections in **Shopify Admin → Products → Collections**. Handles matter
because menus, the hero buttons and homepage sections reference them.

| Collection | Suggested handle | Type | Notes |
|------------|------------------|------|-------|
| Shop All | `all` (auto) | — | Shopify's automatic "All products" collection is at `/collections/all`. You can also make a manual "Shop All". |
| New Drop | `new-drop` | Manual or Smart (tag `new`) | Featured on the hero + "New Drop" menu item. |
| Rashguards | `rashguards` | Smart: Product type = Rashguard | Category tile + menu. |
| Fight Shorts | `fight-shorts` | Smart: Product type = Fight Shorts | Category tile + menu. |
| Essentials | `essentials` | Smart or Manual | Category tile + menu. |
| MUHARIB — Drop 001 | `muharib` | Manual | Featured drop banner. |

## Collection images
Each collection can have an **image** (Collections → *collection* → Image). The theme
uses it for:
- the **collection banner** (unless you upload a banner override in the theme editor),
- the **Shop by category** tiles (unless you set a per-tile image),
- the **collections list** page.

If no image is set, a refined **color-and-typography placeholder** is shown — the theme
never fabricates product photography.

## Wire collections into the storefront (theme editor)
- **Hero buttons** → *Shop New Drop* → link to `New Drop`; *Shop All Gear* → `Shop All`.
- **Shop by category** → set each tile's Collection (Rashguards / Fight Shorts / Essentials).
- **Featured products** → choose the collection to pull 4–8 products from (e.g. New Drop).
- **Featured drop banner** → button link → `MUHARIB` collection.
- **Cart drawer** → optional "Add-on recommendations collection".

## Filters (collection pages)
Filtering uses Shopify's **Search & Discovery** app (free, by Shopify):
1. Install **Search & Discovery** from the Shopify App Store.
2. **Filters** → add filters for **Availability, Price, Product type, Color, Size**
   (Size/Color come from your variant options; Product type from product type).
3. The theme automatically renders whatever filters you enable, with colour swatches
   for the Color filter and a price range control.

## Product setup for best results
- Set **Product type** (Rashguard / Fight Shorts / …) — powers smart collections,
  the product-type filter, and the card's type line.
- Use option names **Color** and **Size** (the theme detects these for swatches, the
  size selector and the size-guide link).
- Add at least one real product image. Cards show a branded placeholder until then.
- Tag new products with `new` (configurable in Theme settings → Product cards) to show
  a **NEW** badge.
- Turn on **inventory tracking** so **Low stock** / **Sold out** states are accurate.
