# Mononshil Demo E-Commerce Implementation Plan

**Goal:** Build a production-quality, client-ready demo e-commerce storefront for **Mononshil** featuring Footwear, Apparel, and Grocery products with Bangladesh market checkout (`Tk`), zero database, zero emojis, local studio photography, and one-click Vercel readiness.

**Architecture:** Next.js App Router with TypeScript strict mode and Tailwind CSS v4. Catalog data and pure commerce/filtering functions are isolated in `src/data/` and `src/lib/` (unit-tested with Node's built-in test runner), client cart and order confirmation state live in a hydration-safe React Context backed by `localStorage`, and all product/editorial visuals are cohesive local images in `public/images/`.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v4, `lucide-react`, `next/font/google` (`Fraunces` + `Plus Jakarta Sans`), Node `node:test` + `tsx`.

## Global Constraints
- Brand name: **Mononshil** (`MONONSHIL` wordmark, order IDs `MN-2026-XXXX`).
- Target market: Bangladesh, English UI, `Tk` pricing with `tabular-nums`, delivery zones `Inside Dhaka` (`Tk 80`) and `Outside Dhaka` (`Tk 150`), free nationwide shipping at `Tk 3,000+`.
- Demo payments: Cash on Delivery, bKash (Demo), Nagad (Demo), Card (Demo) — clearly labeled non-charging demo checkout.
- Strictly zero emojis anywhere in UI copy, code, or metadata; use `lucide-react` stroke icons only.
- No database; client-only persistence via `localStorage`.
- Public GitHub repo target: `marajulcsecu/mononshil-ecommerce-demo`.

---

## Tasks

### Task 1: Project Scaffold & Base Configuration
- Create `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`.
- Install Next.js, React, Tailwind CSS v4, TypeScript, ESLint, `lucide-react`, and `tsx` (for running TypeScript unit tests).
- Create `public/images/{hero,categories,products}` folders.

### Task 2: Cohesive Studio Product & Editorial Imagery (Parallel)
- Generate 20 cohesive assets via `image-generator` in 4 parallel batches:
  - Editorial & Categories (5): `hero/mononshil-hero.png`, `hero/pantry-banner.png`, `categories/footwear.png`, `categories/apparel.png`, `categories/grocery.png`.
  - Footwear Products (5): `velocity-knit-runner.png`, `hand-stitched-leather-loafer.png`, `everyday-canvas-low-top.png`, `comfort-leather-sandal.png`, `espresso-suede-chelsea-boot.png`.
  - Apparel Products (5): `relaxed-bengal-linen-shirt.png`, `fine-handloom-cotton-panjabi.png`, `tailored-everyday-chinos.png`, `heavyweight-combed-cotton-tee.png`, `washed-indigo-denim-overshirt.png`.
  - Grocery Products (5): `sundarbans-wild-raw-honey.png`, `aged-dinajpur-chinigura-rice.png`, `sylhet-estate-orthodox-black-tea.png`, `cold-pressed-ghani-mustard-oil.png`, `bandarban-hill-roast-coffee-beans.png`.

### Task 3: Types, Pure Commerce & Catalog Logic (TDD) + Curated Data
- Create `src/types/commerce.ts`.
- Write failing unit tests in `tests/commerce.test.ts` and `tests/catalog.test.ts`.
- Implement `src/lib/commerce.ts` (`formatBdt`, `calculateDeliveryFee`, `getFreeShippingRemaining`, `buildCartItemKey`, `upsertCartItem`, `updateCartItemQuantity`, `removeCartItem`, `generateOrderId`, `validateBangladeshPhone`) and `src/lib/catalog.ts` (`filterAndSortProducts`, `searchProducts`, `getRelatedProducts`, `getProductDisplayPricing`).
- Populate `src/data/categories.ts` and `src/data/products.ts` (15 curated products across Footwear, Apparel, Grocery).
- Verify all unit tests pass (`npm test`).

### Task 4: Design System, Cart Context & Global Storefront Shell
- Configure `src/app/globals.css` with Warm Modern Department Store tokens, typography rules, focus rings, and clean `@media print` receipt styling.
- Configure `src/app/layout.tsx` with `Fraunces` and `Plus Jakarta Sans` Google fonts, metadata, `CartProvider`, and `StorefrontShell`.
- Implement `src/context/CartContext.tsx` (hydration-safe `localStorage` sync for cart & `lastOrder`).
- Build reusable UI primitives (`src/components/ui/Button.tsx`, `src/components/ui/Badge.tsx`).
- Build `AnnouncementBar`, `Header` (with mobile menu drawer), `SearchModal` (Escape/Enter keyboard UX), `CartDrawer` (free-shipping progress bar, line-item quantity stepper), `Footer`, `StorefrontShell`, and `src/app/not-found.tsx`.

### Task 5: Home, Shop & Product Detail Pages
- Build `src/components/shop/ProductCard.tsx`.
- Build Home page sections (`HeroSection`, `CategoryShowcase`, `FeaturedCollection`, `ValuePillars`, `PantryBanner`) and assemble `src/app/page.tsx`.
- Build `src/components/shop/ShopCatalogClient.tsx` and `src/app/shop/page.tsx` with `<Suspense>`, URL-synced category/search/price/offers/sort filters, desktop sidebar + mobile filter drawer, active filter chips, and empty state.
- Build `src/components/product/ProductPurchasePanel.tsx` and `src/app/product/[slug]/page.tsx` with `generateStaticParams`, dynamic variant selectors (EU sizes + colors, Apparel sizes + colors, Grocery pack sizes updating price live), Add to Cart, Buy Now, specs table, delivery notes, and related products.

### Task 6: Demo Checkout & Printable Order Confirmation
- Build `src/components/checkout/CheckoutClient.tsx` and `src/app/checkout/page.tsx` with validated Bangladesh shipping fields, Inside/Outside Dhaka delivery zone toggle (free over `Tk 3,000`), and interactive demo payment tabs (COD, bKash, Nagad, Card).
- Build `src/components/order/OrderConfirmationClient.tsx` and `src/app/order-confirmation/page.tsx` displaying generated order ID (`MN-2026-XXXX`), itemized receipt, delivery estimate, and Print Receipt button.

### Task 7: Verification & GitHub Publication
- Verify zero emojis across `src/` and `public/`.
- Run `npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
- Start production server (`npm run start`) and verify all flows & screenshots across `1440x900` desktop and `375x812` mobile via Chrome DevTools MCP (checking zero console errors and all images loaded).
- Commit cleanly, create public GitHub repo `marajulcsecu/mononshil-ecommerce-demo` via `gh repo create`, push `main`, and verify remote state.
