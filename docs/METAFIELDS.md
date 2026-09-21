# Product metafield definitions

The product page reads these metafields to display fit, fabric, construction, model
and manufacturing information. **Nothing is invented** — a field only shows when you
enter a value. Create these once in Shopify Admin, then fill them per product.

## Create the definitions

**Shopify Admin → Settings → Custom data → Products → Add definition.**

Create each definition below with **Namespace and key = `custom.<key>`** exactly as
shown (the theme reads `product.metafields.custom.<key>`). Set "Storefront access" =
**Visible** (Online Store) so the theme can read them.

| Name | Namespace and key | Type | Example |
|------|-------------------|------|---------|
| Fit | `custom.fit` | Single line text | `Compression` |
| Fabric composition | `custom.fabric_composition` | Single line text | `82% polyester, 18% spandex` |
| Fabric weight / GSM | `custom.fabric_weight_gsm` | Single line text | `240 GSM` |
| Construction | `custom.construction` | Single line text | `Flatlock seams, silicone hem` |
| Care instructions | `custom.care_instructions` | Multi-line text | `Machine wash cold…` |
| Model height | `custom.model_height` | Single line text | `6'0" / 183 cm` |
| Model weight | `custom.model_weight` | Single line text | `180 lb / 82 kg` |
| Model size worn | `custom.model_size` | Single line text | `L` |
| Country of manufacture | `custom.country_of_manufacture` | Single line text | `Pakistan` |
| Intended sport | `custom.intended_sport` | Single line text | `No-gi BJJ, MMA` |
| Compression level | `custom.compression_level` | Single line text | `High` |

> **Important:** Only enter **manufacturer-confirmed** fabric composition and GSM.
> Do not guess. Country of manufacture only appears on the storefront when you set
> `custom.country_of_manufacture` — it is never hard-coded.

## Where each field appears

- **Specifications** block (product page): every field above that has a value renders
  as a labelled row.
- **Collapsible rows**: the *Fit*, *Material*, *Construction* and *Care* rows are bound
  to `fit`, `fabric_composition`, `construction` and `care_instructions` respectively.
  If the metafield is empty, the row's editable fallback text is shown instead.
- **Structured data**: `country_of_manufacture` populates `countryOfOrigin` in the
  Product JSON-LD (used by Google Merchant Center).

You can re-bind any collapsible row to a different metafield in the theme editor:
Product template → **Collapsible row → "Bind to product metafield key"**.

## Optional: create definitions via the Admin API (GraphQL)

If you prefer automation, run these with a custom app token (Admin API,
`write_metafield_definitions` scope). Repeat per field (example shows two):

```graphql
mutation {
  a: metafieldDefinitionCreate(definition: {
    name: "Fabric composition", namespace: "custom", key: "fabric_composition",
    ownerType: PRODUCT, type: "single_line_text_field",
    access: { storefront: PUBLIC_READ }
  }) { createdDefinition { id } userErrors { message } }

  b: metafieldDefinitionCreate(definition: {
    name: "Fabric weight / GSM", namespace: "custom", key: "fabric_weight_gsm",
    ownerType: PRODUCT, type: "single_line_text_field",
    access: { storefront: PUBLIC_READ }
  }) { createdDefinition { id } userErrors { message } }
}
```

Types to use: all are `single_line_text_field` except `care_instructions`, which is
`multi_line_text_field`.

## Color swatches (optional but recommended)

To show real colour swatches on cards and the product page, add swatch values to your
**Color** option:

- Newer stores: **Settings → Custom data → (Taxonomy) Color / option value swatches**,
  or the theme's built-in colour-name mapping (Black, Bone, Charcoal, Grey, Red, Navy,
  Olive, Khaki, Blue, Green…) which works with no setup.
- The card/PDP swatch reads `option.swatch` (colour or image) first, then falls back to
  the name map in `snippets/color-swatch.liquid`. Add unusual colours to that map or set
  a swatch value in Admin.
