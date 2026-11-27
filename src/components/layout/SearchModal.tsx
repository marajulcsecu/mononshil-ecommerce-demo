"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { getLocalizedCategory, getLocalizedProduct } from "@/data/translations-bn";
import { useLocale } from "@/context/LocaleContext";
import { searchProducts } from "@/lib/catalog";
import { UI_TEXT, formatPrice } from "@/lib/i18n";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = UI_TEXT[locale].searchModal;

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(PRODUCTS, query).slice(0, 6);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    onClose();
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : "/shop");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Search Mononshil catalog"
    >
      <div
        className="fixed inset-0 bg-ink/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-md border border-border bg-surface shadow-2xl">
        <form onSubmit={handleSubmit} className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.5} />
          <input
            ref={inputRef}
            id="global-catalog-search"
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.placeholder}
            aria-label={t.placeholder}
            className="h-14 w-full bg-transparent px-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mr-1 rounded-sm px-2 py-1 text-xs text-ink-muted hover:text-ink cursor-pointer"
            >
              {t.clear}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </form>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {!query.trim() ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                {t.browseDepartments}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((rawCategory) => {
                  const category = getLocalizedCategory(rawCategory, locale);
                  return (
                    <Link
                      key={category.slug}
                      href={`/shop?category=${category.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-sm border border-border bg-canvas px-3.5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
                    >
                      <span>{category.shortTitle}</span>
                      <ArrowRight
                        className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                        strokeWidth={1.5}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-ink">
                {t.noResultsTitle} &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-ink-secondary">{t.noResultsHint}</p>
            </div>
          ) : (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">
                  {t.matchingProducts}
                </p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-medium text-accent hover:underline cursor-pointer"
                >
                  {t.viewAllResults}
                </button>
              </div>
              <ul className="divide-y divide-border">
                {results.map((rawProduct) => {
                  const product = getLocalizedProduct(rawProduct, locale);
                  const category = getLocalizedCategory(
                    getCategoryBySlug(product.category),
                    locale
                  );
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="-mx-2 flex items-center gap-3.5 rounded-sm px-2 py-2.5 transition-colors hover:bg-canvas"
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                          <Image
                            src={product.image}
                            alt={product.imageAlt}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                          <p className="text-xs text-ink-muted">{category.shortTitle}</p>
                        </div>
                        <p className="price-num text-sm font-semibold text-ink">
                          {formatPrice(product.price, locale)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
