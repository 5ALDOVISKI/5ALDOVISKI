# Payments, shipping, tax & returns checklist

All commerce settings are configured in **native Shopify** — the theme does not
hard-code prices, tax or shipping. Work top to bottom.

## Payments  (Settings → Payments)
- [ ] Activate **Shopify Payments** (enables card + wallets + Shop Pay).
- [ ] Enable **Shop Pay**.
- [ ] Enable **Apple Pay** and **Google Pay** (wallets).
- [ ] Add **PayPal** (Settings → Payments → Additional payment methods).
- [ ] Confirm the **accelerated checkout / dynamic checkout buttons** show on the product
      page and cart (theme: Product template → Buy buttons → "Show accelerated checkout").
- [ ] The footer's accepted-payment icons auto-reflect what you enable
      (`shop.enabled_payment_types`), so no theme change is needed.

> Accelerated checkout buttons (Shop Pay / Apple Pay / Google Pay / PayPal) are rendered
> by Shopify's `payment_button`. They only appear once the corresponding method is live.

## Tax  (Settings → Taxes and duties)
- [ ] Configure **US sales tax** (Shopify Tax / manual rates as appropriate).
- [ ] Set tax-inclusive/exclusive pricing to match your market.
- [ ] For international: set up duties/import taxes if you collect them at checkout.
- [ ] Do **not** hard-code tax anywhere — the product page tax note links to your policy.

## Shipping  (Settings → Shipping and delivery)
- [ ] Create a **Domestic (US)** shipping profile with your rates.
- [ ] Create an **International** shipping profile / zones.
- [ ] If you offer free shipping over a threshold, create that rate here, **then** set the
      matching display value in **Theme settings → Cart → Free-shipping threshold**
      (the cart progress bar is display-only and must match your real rate).
- [ ] Set realistic **processing/handling** times (the product page shows an editable
      "Ships within…" and delivery estimate — update the copy to match).

## Markets / international  (Settings → Markets)
- [ ] Add the countries/regions you sell to.
- [ ] Enable currency conversion; the footer country & language selectors appear
      automatically when more than one market/language is active.

## Discounts & gift cards
- [ ] Create discount codes (Discounts). Cart & checkout show applied discounts.
- [ ] Enable **Gift cards** (Products → Gift cards). The theme includes a branded gift
      card template.

## Inventory
- [ ] Turn on **Track quantity** per variant so the theme's **Low stock** / **Sold out**
      states and badges are accurate.
- [ ] Set the theme's **Low-stock threshold** (Theme settings → Product cards, and the
      Product template).
- [ ] Decide "Continue selling when out of stock" per variant (affects sold-out display).

## Order & customer emails  (Settings → Notifications)
- [ ] Customize **Order confirmation**, **Shipping confirmation** and **Abandoned
      checkout** emails with MAYDAN branding (logo, colours).
- [ ] Enable abandoned checkout emails (Marketing / Notifications).

## Returns  (Settings → Policies + Apps)
- [ ] Publish your **Refund/Return policy** (Settings → Policies).
- [ ] Enable **self-serve returns** (Settings → Customer accounts / Returns) or install a
      returns app if you need RMA workflows.

## Customer accounts  (Settings → Customer accounts)
- [ ] Choose **New customer accounts** or **Classic** (the theme ships classic
      login/register/account/addresses/order templates that work with classic accounts;
      new accounts use Shopify-hosted pages).
