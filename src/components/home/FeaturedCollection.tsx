"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { useLocale } from "@/context/LocaleContext";
import { UI_TEXT } from "@/lib/i18n";
import type { CategorySlug } from "@/types/commerce";

type TabKey = "featured" | CategorySlug;

export function FeaturedCollection() {
  const { locale } = useLocale();
  const t = UI_TEXT[locale].featured;
  const [activeTab, setActiveTab] = useState<TabKey>("featured");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "featured", label: t.tabFeatured },
    { key: "footwear", label: t.tabFootwear },
    { key: "apparel", label: t.tabApparel },
    { key: "grocery", label: t.tabGrocery },
  ];

  const visibleProducts = useMemo(() => {
    if (activeTab === "featured") {
      return PRODUCTS.filter((product) => product.featured).slice(0, 8);
    }
    return PRODUCTS.filter((product) => product.category === activeTab);
  }, [activeTab]);

  const activeTabLabel = tabs.find((tab) => tab.key === activeTab)?.label ?? "";

  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              {t.eyebrow}
            </p>
            <h2 className="font-display mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              {t.title}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter featured products by department"
            className="flex flex-wrap gap-2"
          >
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.key)}
                  className={`h-9 rounded-sm px-4 text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-ink text-white"
                      : "border border-border bg-canvas text-ink-secondary hover:border-ink hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={activeTab === "featured" ? "/shop" : `/shop?category=${activeTab}`}
            className="inline-flex h-11 items-center gap-2 rounded-sm border border-border-strong bg-canvas px-6 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-surface-muted"
          >
            <span>
              {activeTab === "featured"
                ? t.viewAllProducts
                : locale === "bn"
                ? `সকল ${activeTabLabel} দেখুন`
                : `${t.viewCategoryPrefix} ${activeTabLabel}`}
            </span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
