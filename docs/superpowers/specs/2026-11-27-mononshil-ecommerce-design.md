# Mononshil — Demo E-Commerce Storefront Design Specification

Date: 2026-11-27
Brand: Mononshil
Repository Target: `marajulcsecu/mononshil-ecommerce-demo` (Public, GitHub)
Deployment Target: Vercel (zero-config Next.js App Router)

---

## 1. Purpose & Scope

Build a polished, client-ready demo e-commerce website for **Mononshil**, a modern multi-category retail brand serving Bangladesh across three core departments: **Footwear**, **Apparel**, and **Grocery**.

### Key Constraints
- **No database**: All catalog products and categories live in typed TypeScript data modules (`src/data/`). Shopping cart state and the most recent demo order receipt persist client-side via `localStorage`.
- **Market & Currency**: Bangladesh market in clean English UI, priced in Bangladeshi Taka (`Tk`), with local delivery zones (`Inside Dhaka` / `Outside Dhaka`) and demo payment flows (`Cash on Delivery`, `bKash`, `Nagad`, `Card`).
- **Strictly zero emojis**: No emojis anywhere in UI copy, navigation, badges, alerts, or code. Use thin-stroke vector icons (`lucide-react`) exclusively.
- **Professional UI/UX**: Clean Modern Department Store aesthetic with consistent studio photography, crisp typographic hierarchy, high contrast (WCAG 2.1 AA), full keyboard accessibility, and responsive layouts from `375px` mobile to `1440px+` desktop.

---

## 2. Visual Design System

### Palette (Semantic Design Tokens in CSS)
- **Canvas**: `#FAF8F5` (warm alabaster background)
- **Surface**: `#FFFFFF` (cards, inputs, drawers, modals)
- **Surface Muted**: `#F2EFE9` (soft stone product backdrops and secondary bands)
- **Surface Subtle**: `#EAE5DC` (subtle hover states and chips)
- **Ink Primary**: `#171716` (headings, primary body text)
- **Ink Secondary**: `#57544E` (descriptions, labels)
- **Ink Muted**: `#736F67` (metadata, breadcrumbs, captions)
- **Border Default**: `#E4DFD7` (1px hairline architectural borders)
- **Border Strong**: `#CCC5B9` (focused/selected borders)
- **Accent Primary**: `#1F4E3D` (deep forest green for primary CTAs, active tabs, free-delivery progress)
- **Accent Hover**: `#163B2D`
- **Accent Soft**: `#EBF2EE`
- **Sale / Highlight**: `#B55436` (terracotta reserved strictly for discount/offer badges)
- **Error**: `#B42318` (validation messages and error borders)

### Typography
- **Display Serif**: `Fraunces` (via `next/font/google`) for the Mononshil wordmark, hero headline, and section headings.
- **UI & Body Sans**: `Plus Jakarta Sans` (via `next/font/google`) for navigation, product titles, body copy, forms, and buttons.
- **Price Formatting**: `tabular-nums` applied to all `Tk` prices and summary tables for exact vertical alignment.

### Layout, Spacing & Elevation
- Max container width `1280px` (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
- Consistent architectural corner radii (`rounded-sm` / `rounded-md`, 4px-8px) — avoiding bloated pill/oversized rounding.
- Flat, hairline-bordered surfaces; subtle elevation reserved strictly for floating overlays (cart drawer, search dialog, mobile drawers).

---

## 3. Tech Stack & Project Structure

- **Framework**: Next.js (App Router, TypeScript strict mode)
- **Styling**: Tailwind CSS + CSS custom properties in `src/app/globals.css`
- **Icons**: `lucide-react` (`strokeWidth={1.5}`)
- **Images**: Local studio-style PNG/WebP assets stored in `public/images/` and rendered with `next/image` (zero reliance on external stock CDNs)

```text
src/
  app/
    layout.tsx                    # Root layout, Google fonts, CartProvider, StorefrontShell
    globals.css                   # Theme tokens, typography utilities, print styles
    not-found.tsx                 # Custom branded 404 page
    page.tsx                      # Home page
    shop/
      page.tsx                    # Catalog, Search, Filters & Sort (Suspense + URL params)
    product/
      [slug]/
        page.tsx                  # Product Detail page (static params + metadata)
    checkout/
      page.tsx                    # Demo Checkout page
    order-confirmation/
      page.tsx                    # Printable Demo Order Receipt page
  components/
    layout/
      AnnouncementBar.tsx
      Header.tsx                  # Desktop nav, mobile menu drawer, search & cart triggers
      Footer.tsx                  # Structured multi-column footer
      SearchModal.tsx             # Keyboard-accessible instant catalog search
      StorefrontShell.tsx         # Wraps header, main, footer, cart drawer & search modal
    cart/
      CartDrawer.tsx              # Slide-over cart with free-shipping bar & quantity controls
    home/
      HeroSection.tsx             # Editorial split hero
      CategoryShowcase.tsx        # 3-department visual cards
      FeaturedCollection.tsx      # Interactive category-tabbed featured product grid
      ValuePillars.tsx            # 4 service/trust pillars
      PantryBanner.tsx            # Mid-page Grocery editorial spotlight
    shop/
      ProductCard.tsx             # Consistent card with hover actions & variant info
      ShopCatalogClient.tsx       # URL-synced search, filters, mobile filter drawer & grid
    product/
      ProductPurchasePanel.tsx    # Interactive variant picker, quantity, Add to Cart & Buy Now
    checkout/
      CheckoutClient.tsx          # Validated BD shipping & demo payment checkout
    order/
      OrderConfirmationClient.tsx # Order invoice & print handler
    ui/
      Badge.tsx
      Button.tsx
  context/
    CartContext.tsx               # Hydration-safe cart & lastOrder state synced to localStorage
  data/
    categories.ts                 # 3 core departments metadata
    products.ts                   # 15 curated demo products (5 per category)
  lib/
    commerce.ts                   # Pure pricing, delivery fee, cart & order ID helpers
    catalog.ts                    # Pure filter, search, sort & related-product helpers
  types/
    commerce.ts                   # Shared TypeScript interfaces
```

---

## 4. Product Catalog (15 Curated Demo Products)

All products include realistic Bangladeshi market pricing, descriptions, specifications, ratings, and variant options.

### Footwear (`footwear` — 5 products)
1. **Velocity Knit Runner** (`velocity-knit-runner`) — `Tk 4,290` — Breathable engineered mesh runner; EU sizes `40, 41, 42, 43, 44`; Colors: `Obsidian`, `Warm Stone`.
2. **Hand-Stitched Leather Loafer** (`hand-stitched-leather-loafer`) — `Tk 5,850` (was `Tk 6,500`) — Full-grain leather penny loafer; EU sizes `40, 41, 42, 43, 44`; Colors: `Chestnut`, `Black`.
3. **Everyday Canvas Low-Top** (`everyday-canvas-low-top`) — `Tk 2,450` — Heavy cotton canvas sneaker with vulcanized rubber sole; EU sizes `39, 40, 41, 42, 43, 44`; Colors: `Chalk White`, `Forest`.
4. **Comfort Leather Sandal** (`comfort-leather-sandal`) — `Tk 2,190` — Contoured cork-footbed strap sandal suited for warm weather; EU sizes `40, 41, 42, 43, 44`; Colors: `Tan`, `Espresso`.
5. **Espresso Suede Chelsea Boot** (`espresso-suede-chelsea-boot`) — `Tk 6,900` — Water-repellent suede ankle boot with crepe outsole; EU sizes `40, 41, 42, 43, 44`; Colors: `Espresso`, `Sand`.

### Apparel (`apparel` — 5 products)
6. **Relaxed Bengal Linen Shirt** (`relaxed-bengal-linen-shirt`) — `Tk 2,650` — Airy woven linen button-down tailored for humid climates; Sizes `S, M, L, XL`; Colors: `Oatmeal`, `Forest`, `Ivory`.
7. **Fine Handloom Cotton Panjabi** (`fine-handloom-cotton-panjabi`) — `Tk 3,450` (was `Tk 3,900`) — Subtle tonal-stitch mandarin collar panjabi crafted from breathable cotton; Sizes `S, M, L, XL`; Colors: `Ivory`, `Charcoal`, `Olive`.
8. **Tailored Everyday Chinos** (`tailored-everyday-chinos`) — `Tk 2,890` — Mid-weight stretch cotton twill tapered trousers; Waist `30, 32, 34, 36`; Colors: `Khaki`, `Charcoal`, `Navy`.
9. **Heavyweight Combed Cotton Tee** (`heavyweight-combed-cotton-tee`) — `Tk 1,150` — 220 GSM structured crew-neck t-shirt; Sizes `S, M, L, XL`; Colors: `Off-White`, `Charcoal`, `Sage`.
10. **Washed Indigo Denim Overshirt** (`washed-indigo-denim-overshirt`) — `Tk 3,750` — Versatile mid-weight cotton denim layering overshirt; Sizes `S, M, L, XL`; Colors: `Indigo`, `Washed Slate`.

### Grocery (`grocery` — 5 products)
11. **Sundarbans Wild Raw Honey** (`sundarbans-wild-raw-honey`) — Unprocessed multifloral raw honey in glass jar; Packs: `500g (Tk 680)`, `1kg (Tk 1,280)`.
12. **Aged Dinajpur Chinigura Rice** (`aged-dinajpur-chinigura-rice`) — Aromatic short-grain heirloom rice for pulao and festive dishes; Packs: `1kg (Tk 320)`, `2kg (Tk 620)`, `5kg (Tk 1,490)`.
13. **Sylhet Estate Orthodox Black Tea** (`sylhet-estate-orthodox-black-tea`) — Whole-leaf single-estate brisk black tea in airtight tin; Packs: `250g (Tk 490)`, `500g (Tk 920)`.
14. **Cold-Pressed Ghani Mustard Oil** (`cold-pressed-ghani-mustard-oil`) — Wood-pressed pungent deshi mustard oil in dark glass bottle; Packs: `500ml (Tk 440)`, `1L (Tk 840)`.
15. **Bandarban Hill Roast Coffee Beans** (`bandarban-hill-roast-coffee-beans`) — Small-batch medium-roast highland Arabica whole beans; Packs: `250g (Tk 790)`, `500g (Tk 1,490)`.

---

## 5. User Flows, Data Flow & Edge Cases

### Cart & Persistence
- `CartContext` stores line items keyed deterministically by `${productId}::${size}::${color}::${pack}`.
- Adding an existing product + variant combination increments quantity (clamped to `1..20`).
- `localStorage` keys: `mononshil_cart_v1` and `mononshil_last_order_v1`.
- Corrupted or unreadable `localStorage` data is caught and safely reset to empty defaults.
- SSR hydration safety: Cart badge counts and drawer items render after client mount (`isHydrated`) to prevent Next.js hydration warnings.

### Delivery & Pricing Rules
- Free shipping threshold: `Tk 3,000` (applies automatically nationwide).
- Below threshold: `Inside Dhaka` = `Tk 80` (estimated 24 hours), `Outside Dhaka` = `Tk 150` (estimated 2-4 business days).
- All prices computed purely in `src/lib/commerce.ts`.

### Checkout & Demo Payment Behavior
- Explicit, tasteful notice informs reviewers and clients that checkout is an interactive demonstration with no real payment processing.
- Validations: Full Name (min 2 chars), Bangladesh Phone (`^(\+?880|0)1[3-9]\d{8}$`), Delivery Area, Street Address; for bKash/Nagad demo, requires a valid 11-digit mobile number; for Card demo, requires 16 digits + MM/YY + 3-digit CVC.
- Submitting generates order ID `MN-2026-XXXX`, persists receipt to `localStorage`, clears the cart, and navigates to `/order-confirmation`.

### Search & Filtering (`/shop`)
- URL searchParams (`category`, `q`, `sort`, `price`, `offers`) are the single source of truth for shareable state.
- All 15 demo products are in stock so clients can test adding any item to cart; an "Offers Only" filter highlights discounted items (additionally include at least 3-4 discounted items across Footwear, Apparel, and Grocery so the filter shows rich results).
- Header `SearchModal` allows instant live product search (by title, category, description, or SKU) with keyboard navigation (`Escape` to close, Enter to jump to `/shop?q=...`).

---

## 6. Visual Asset Plan

Generate cohesive studio imagery stored locally under `public/images/`:
- **Hero & Editorial** (2 images):
  - `public/images/hero/mononshil-hero.png` — Warm editorial department store lifestyle flat-lay/arrangement combining crafted footwear, folded natural linen apparel, and artisan glass-jar pantry goods on warm travertine/stone.
  - `public/images/hero/pantry-banner.png` — Warm sunlit pantry table arrangement with raw honey jar, aromatic tea tin, mustard oil bottle, and roasted coffee beans.
- **Category Cards** (3 images):
  - `public/images/categories/footwear.png`
  - `public/images/categories/apparel.png`
  - `public/images/categories/grocery.png`
- **Product Photography** (15 images):
  - `public/images/products/<slug>.png` for all 15 products, consistently styled on warm soft-stone studio backdrops (`#F2EFE9`) with soft directional lighting and zero overlaid text or watermarks.

---

## 7. Verification & Delivery Plan

1. **Automated Logic Tests**: Run unit tests (Node built-in `node:test` / `tsx`) verifying currency formatting, shipping fee rules, cart merging/clamping, and catalog filter/sort/search functions.
2. **Static Checks**: Verify zero emojis across `src/`, run `npx tsc --noEmit`, `npm run lint`, and `npm run build` (confirming clean Next.js production build ready for Vercel).
3. **Live Browser Verification**: Launch the production build locally and inspect via Chrome DevTools MCP across desktop (`1440x900`) and mobile (`375x812`) viewports:
   - Verify zero console errors and zero broken images (`naturalWidth > 0`).
   - Test search modal, `/shop` category & price filters, `/product/[slug]` variant switching (footwear size, apparel color, grocery pack pricing), Cart Drawer quantity updates, full Checkout submission, and Order Confirmation receipt.
4. **GitHub Delivery**: Create public repository `mononshil-ecommerce-demo` via `gh repo create`, push `main`, and return the GitHub URL along with exact Vercel deployment steps.
