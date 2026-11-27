"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { filterAndSortProducts, getCategoryProductCount } from "@/lib/catalog";
import type { CatalogSort, CategorySlug, PriceFilter } from "@/types/commerce";

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const PRICE_OPTIONS: { value: PriceFilter; label: string }[] = [
  { value: "all", label: "All Prices" },
  { value: "under-1000", label: "Under Tk 1,000" },
  { value: "1000-3500", label: "Tk 1,000 - Tk 3,500" },
  { value: "over-3500", label: "Over Tk 3,500" },
];

function parseCategory(value: string | null): CategorySlug | "all" {
  if (value === "footwear" || value === "apparel" || value === "grocery") {
    return value;
  }
  return "all";
}

function parseSort(value: string | null): CatalogSort {
  if (
    value === "featured" ||
    value === "price-asc" ||
    value === "price-desc" ||
    value === "rating"
  ) {
    return value;
  }
  return "featured";
}

function parsePrice(value: string | null): PriceFilter {
  if (value === "under-1000" || value === "1000-3500" || value === "over-3500") {
    return value;
  }
  return "all";
}

export function ShopCatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = parseCategory(searchParams.get("category"));
  const sort = parseSort(searchParams.get("sort"));
  const price = parsePrice(searchParams.get("price"));
  const offersOnly = searchParams.get("offers") === "true";
  const urlQuery = searchParams.get("q") ?? "";

  const [draftQuery, setDraftQuery] = useState<{ base: string; value: string } | null>(null);
  const searchInput =
    draftQuery && draftQuery.base === urlQuery ? draftQuery.value : urlQuery;

  const setSearchInput = (value: string) => {
    setDraftQuery({ base: urlQuery, value });
  };

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileFiltersOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileFiltersOpen]);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === "false") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    const qs = next.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(PRODUCTS, {
        category,
        query: searchInput,
        sort,
        price,
        offersOnly,
      }),
    [category, searchInput, sort, price, offersOnly]
  );

  const activeDepartment = CATEGORIES.find((item) => item.slug === category);

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (price !== "all" ? 1 : 0) +
    (offersOnly ? 1 : 0) +
    (searchInput.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSearchInput("");
    router.replace("/shop", { scroll: false });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const filterSidebarContent = (
    <div className="space-y-8">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Department
        </h2>
        <div className="mt-3 space-y-1.5">
          <button
            type="button"
            onClick={() => updateParams({ category: null })}
            className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
              category === "all"
                ? "bg-ink font-medium text-white"
                : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
            }`}
          >
            <span>All Departments</span>
            <span className="price-num text-xs opacity-75">{PRODUCTS.length}</span>
          </button>

          {CATEGORIES.map((item) => {
            const selected = category === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => updateParams({ category: item.slug })}
                className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                  selected
                    ? "bg-ink font-medium text-white"
                    : "text-ink-secondary hover:bg-surface-muted hover:text-ink"
                }`}
              >
                <span>{item.name}</span>
                <span className="price-num text-xs opacity-75">
                  {getCategoryProductCount(item.slug)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Price Range (BDT)
        </h2>
        <div className="mt-3 space-y-2">
          {PRICE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2.5 text-sm text-ink-secondary hover:text-ink cursor-pointer"
            >
              <input
                type="radio"
                name="price-filter"
                checked={price === option.value}
                onChange={() =>
                  updateParams({ price: option.value === "all" ? null : option.value })
                }
                className="h-4 w-4 accent-accent"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Promotions
        </h2>
        <label htmlFor="offers-filter" className="mt-3 flex items-center gap-2.5 text-sm text-ink-secondary hover:text-ink cursor-pointer">
          <input
            id="offers-filter"
            name="offersOnly"
            type="checkbox"
            checked={offersOnly}
            onChange={(event) =>
              updateParams({ offers: event.target.checked ? "true" : null })
            }
            className="h-4 w-4 rounded-sm accent-accent"
          />
          <span>Seasonal Offers Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
          Mononshil Catalog
        </p>
        <h1 className="font-display mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          {activeDepartment ? activeDepartment.name : "All Products"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-secondary">
          {activeDepartment
            ? activeDepartment.description
            : "Explore our curated range of everyday footwear, breathable Bengal apparel, and single-origin pantry provisions."}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            strokeWidth={1.6}
          />
          <input
            id="catalog-search-input"
            name="q"
            type="search"
            value={searchInput}
            onChange={(event) => {
              const value = event.target.value;
              setSearchInput(value);
              if (!value.trim() && urlQuery) {
                updateParams({ q: null });
              }
            }}
            placeholder="Filter by product, material, or origin..."
            aria-label="Search within catalog"
            className="h-10 w-full rounded-sm border border-border bg-surface pl-10 pr-9 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:outline-none"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateParams({ q: null });
              }}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-ink-muted hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" strokeWidth={1.6} />
            </button>
          ) : null}
        </form>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-surface px-3.5 text-sm font-medium text-ink hover:border-ink lg:hidden cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.6} />
            <span>Filters</span>
            {activeFilterCount > 0 ? (
              <span className="price-num rounded-sm bg-accent px-1.5 py-0.5 text-[11px] text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-xs text-ink-muted">
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) =>
                updateParams({
                  sort: event.target.value === "featured" ? null : event.target.value,
                })
              }
              className="h-10 rounded-sm border border-border bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">Active filters:</span>
          {category !== "all" ? (
            <button
              type="button"
              onClick={() => updateParams({ category: null })}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:border-ink cursor-pointer"
            >
              <span className="capitalize">{category}</span>
              <X className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          ) : null}
          {price !== "all" ? (
            <button
              type="button"
              onClick={() => updateParams({ price: null })}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:border-ink cursor-pointer"
            >
              <span>{PRICE_OPTIONS.find((p) => p.value === price)?.label}</span>
              <X className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          ) : null}
          {offersOnly ? (
            <button
              type="button"
              onClick={() => updateParams({ offers: null })}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:border-ink cursor-pointer"
            >
              <span>Offers Only</span>
              <X className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          ) : null}
          {searchInput.trim() ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateParams({ q: null });
              }}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:border-ink cursor-pointer"
            >
              <span>Query: {searchInput.trim()}</span>
              <X className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={clearAllFilters}
            className="ml-1 text-xs font-medium text-accent hover:underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <div className="mt-8 flex gap-10">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 rounded-sm border border-border bg-surface p-5">
            {filterSidebarContent}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <p className="mb-5 text-xs text-ink-muted">
            Showing <span className="price-num font-semibold text-ink">{filteredProducts.length}</span>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>

          {filteredProducts.length === 0 ? (
            <div
              role="status"
              className="rounded-sm border border-border bg-surface px-6 py-16 text-center"
            >
              <h2 className="font-display text-2xl font-medium text-ink">
                No matching products found
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-secondary">
                Adjust your price range, search term, or department selection to explore the full
                Mononshil collection.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 inline-flex h-10 items-center rounded-sm bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div
          className="fixed inset-0 z-50 flex justify-end lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter catalog"
        >
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl font-medium text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">{filterSidebarContent}</div>

            <div className="flex items-center gap-3 border-t border-border bg-canvas px-5 py-4">
              <button
                type="button"
                onClick={clearAllFilters}
                className="h-10 flex-1 rounded-sm border border-border-strong bg-surface text-xs font-medium text-ink cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="h-10 flex-1 rounded-sm bg-accent text-xs font-medium text-white cursor-pointer"
              >
                Show {filteredProducts.length} Items
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
