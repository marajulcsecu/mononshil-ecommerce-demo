import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopCatalogClient } from "@/components/shop/ShopCatalogClient";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse Mononshil footwear, natural-fiber apparel, and single-origin Bangladesh pantry provisions with instant search and filtering.",
};

function ShopLoadingFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-busy="true">
      <div className="h-8 w-52 animate-pulse rounded-sm bg-surface-muted" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-3">
            <div className="aspect-square animate-pulse rounded-sm bg-surface-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-sm bg-surface-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded-sm bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoadingFallback />}>
      <ShopCatalogClient />
    </Suspense>
  );
}
