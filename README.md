# Mononshil — Demo E-Commerce Storefront

A client-ready multi-category e-commerce storefront built for **Mononshil**, featuring curated Footwear, Apparel, and Bangladesh Grocery & Pantry products with a Warm Modern Department Store design system.

## Key Features

- **No Database Required**: Typed static product catalog (`src/data/products.ts`, `src/data/categories.ts`) cleanly separated from UI components for straightforward API/database migration later.
- **Full Storefront Experience**:
  - **Home (`/`)**: Editorial hero, 3 department spotlights, interactive category-tabbed featured collection, service pillars, and pantry spotlight.
  - **Shop & Search (`/shop`)**: URL-synced filtering by department, BDT price range, seasonal offers, search query, and sorting, with mobile filter drawer.
  - **Product Detail (`/product/[slug]`)**: Statically generated product pages with category-aware variants (EU shoe sizes & colorways, apparel sizes & colors, grocery weight/volume packs with live dynamic pricing), specifications, and related essentials.
  - **Slide-Over Shopping Bag**: Global cart drawer with complimentary nationwide shipping threshold tracker (`Tk 3,000`), quantity controls, and `localStorage` persistence.
  - **Demo Checkout (`/checkout`) & Order Receipt (`/order-confirmation`)**: Bangladesh delivery zone pricing (`Tk 80` Inside Dhaka / `Tk 150` Outside Dhaka / complimentary over `Tk 3,000`), validated mobile input, interactive demo payment options (Cash on Delivery, bKash, Nagad, Card), and a printable order confirmation receipt (`MN-YYYY-XXXX`).
- **Accessibility & Craft**: Semantic HTML, WCAG 2.1 AA contrast, keyboard-accessible overlays (`Escape` dismissal), tabular numerals for BDT pricing, local optimized photography (`next/image`), and zero emojis.

## Tech Stack

- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Lucide Icons (`lucide-react`)
- Node Test Runner (`tsx --test`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Verification Scripts

```bash
npm test          # Unit tests for commerce pricing, cart, and catalog filtering
npm run typecheck # TypeScript strict type check
npm run lint      # ESLint (Next.js core-web-vitals + TypeScript)
npm run build     # Production build verification
```

## Deploying to Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import this GitHub repository (`mononshil-ecommerce-demo`).
3. Leave the default Next.js build settings unchanged (no environment variables required).
4. Click **Deploy**.
