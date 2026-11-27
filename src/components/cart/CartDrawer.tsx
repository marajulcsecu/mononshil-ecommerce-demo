"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import {
  PRODUCT_BN,
  translateColorName,
  translatePackLabel,
  translateSizeValue,
} from "@/data/translations-bn";
import { FREE_SHIPPING_THRESHOLD, getFreeShippingRemaining } from "@/lib/commerce";
import { UI_TEXT, formatNumber, formatPrice } from "@/lib/i18n";
import type { CartItem } from "@/types/commerce";
import type { Locale } from "@/types/i18n";

function formatLocalizedCartVariant(item: CartItem, locale: Locale): string {
  if (locale === "en") return item.variantLabel;
  const parts: string[] = [];
  if (item.selectedVariant.size) {
    parts.push(translateSizeValue(item.selectedVariant.size, locale));
  }
  if (item.selectedVariant.color) {
    parts.push(translateColorName(item.selectedVariant.color, locale));
  }
  if (item.selectedVariant.pack) {
    parts.push(translatePackLabel(item.selectedVariant.pack, locale));
  }
  return parts.join(" / ");
}

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();
  const { locale } = useLocale();
  const t = UI_TEXT[locale].cart;
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const remainingForFreeShipping = getFreeShippingRemaining(subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
    >
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-[1px]"
        onClick={closeDrawer}
      />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">{t.title}</h2>
            <p className="text-xs text-ink-muted">
              {formatNumber(itemCount, locale)}{" "}
              {itemCount === 1 ? t.itemSingle : t.itemPlural}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="border-b border-border bg-canvas px-5 py-3">
          {remainingForFreeShipping === 0 && subtotal > 0 ? (
            <p className="flex items-center gap-2 text-xs font-medium text-accent">
              <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span>{t.freeUnlocked}</span>
            </p>
          ) : (
            <p className="text-xs text-ink-secondary">
              {t.freeRemainingPrefix}{" "}
              <span className="price-num font-semibold text-ink">
                {formatPrice(remainingForFreeShipping, locale)}
              </span>{" "}
              {t.freeRemainingSuffix}
            </p>
          )}
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle"
            aria-hidden="true"
          >
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-base font-medium text-ink">{t.emptyTitle}</h3>
            <p className="mt-1.5 max-w-xs text-sm text-ink-secondary">{t.emptyDescription}</p>
            <Link
              href="/shop"
              onClick={closeDrawer}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <span>{t.browseCta}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <>
            <ul role="list" className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => {
                const displayName =
                  locale === "bn" ? PRODUCT_BN[item.slug]?.name ?? item.name : item.name;
                const variantText = formatLocalizedCartVariant(item, locale);
                return (
                  <li key={item.key} className="flex gap-4 py-4">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeDrawer}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted"
                    >
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeDrawer}
                            className="line-clamp-1 text-sm font-medium text-ink hover:underline"
                          >
                            {displayName}
                          </Link>
                          {variantText ? (
                            <p className="mt-0.5 text-xs text-ink-muted">{variantText}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-ink-muted hover:bg-surface-muted hover:text-error cursor-pointer"
                          aria-label={`Remove ${displayName}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-sm border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="inline-flex h-7 w-7 items-center justify-center text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
                            aria-label={`Decrease quantity of ${displayName}`}
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.6} />
                          </button>
                          <span className="price-num w-8 text-center text-xs font-medium text-ink">
                            {formatNumber(item.quantity, locale)}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="inline-flex h-7 w-7 items-center justify-center text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
                            aria-label={`Increase quantity of ${displayName}`}
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
                          </button>
                        </div>

                        <p className="price-num text-sm font-semibold text-ink">
                          {formatPrice(item.unitPrice * item.quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-border bg-canvas px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-secondary">{t.subtotal}</span>
                <span className="price-num text-base font-semibold text-ink">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">{t.shippingNote}</p>

              <div className="mt-4 space-y-2.5">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  <span>{t.proceedCheckout}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-border-strong bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-ink cursor-pointer"
                >
                  {t.continueShopping}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
