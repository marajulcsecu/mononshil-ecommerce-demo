"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Printer, Receipt } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import {
  PRODUCT_BN,
  translateColorName,
  translatePackLabel,
  translateSizeValue,
} from "@/data/translations-bn";
import { UI_TEXT, formatNumber, formatPrice, toBanglaDigits } from "@/lib/i18n";
import type { CartItem, OrderRecord } from "@/types/commerce";
import type { Locale } from "@/types/i18n";

function formatOrderVariant(item: CartItem, locale: Locale): string {
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

function getLocalizedPaymentSummary(order: OrderRecord, locale: Locale): string {
  if (locale === "en") return order.paymentSummary;
  const last4Match = order.paymentSummary.match(/(\d{4})\)?$/);
  const last4 = last4Match ? toBanglaDigits(last4Match[1]) : "";
  if (order.paymentMethod === "cod") return "ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে পরিশোধ)";
  if (order.paymentMethod === "bkash") return `বিকাশ ডেমো ওয়ালেট (****${last4})`;
  if (order.paymentMethod === "nagad") return `নগদ ডেমো ওয়ালেট (****${last4})`;
  return `ডেমো কার্ড (শেষ চার অঙ্ক ${last4})`;
}

export function OrderConfirmationClient() {
  const { lastOrder, isHydrated } = useCart();
  const { locale } = useLocale();
  const t = UI_TEXT[locale].confirmation;
  const checkoutT = UI_TEXT[locale].checkout;

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6" aria-busy="true">
        <div className="h-10 w-64 animate-pulse rounded-sm bg-surface-muted" />
        <div className="mt-6 h-80 animate-pulse rounded-sm bg-surface-muted" />
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-muted">
          <Receipt className="h-6 w-6" strokeWidth={1.5} />
        </div>
        <h1 className="font-display mt-5 text-3xl font-medium text-ink">{t.emptyTitle}</h1>
        <p className="mt-2 text-sm text-ink-secondary">{t.emptyDesc}</p>
        <Link
          href="/shop"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <span>{t.browseProducts}</span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(lastOrder.createdAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-sm border border-border bg-surface p-6 sm:p-10">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <CheckCircle2 className="mt-0.5 h-8 w-8 shrink-0 text-accent" strokeWidth={1.6} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {t.confirmedEyebrow}
              </p>
              <h1 className="font-display mt-1 text-2xl font-medium text-ink sm:text-3xl">
                {t.thankYou} {lastOrder.customer.fullName}
              </h1>
              <p className="mt-1 text-xs text-ink-secondary">
                {t.placedOn} {formattedDate} · {t.reference}{" "}
                <span className="price-num font-semibold text-ink">{lastOrder.orderId}</span>
              </p>
            </div>
          </div>

          <span className="rounded-sm border border-border bg-canvas px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-ink-secondary">
            {t.demoReceipt}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 border-b border-border pb-6 text-sm sm:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t.shippingTo}
            </h2>
            <p className="mt-2 font-medium text-ink">{lastOrder.customer.fullName}</p>
            <p className="mt-0.5 text-xs text-ink-secondary">{lastOrder.customer.phone}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-secondary">
              {lastOrder.customer.address}, {lastOrder.customer.area}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t.deliveryEstimate}
            </h2>
            <p className="mt-2 text-xs font-medium text-ink">
              {lastOrder.customer.zone === "inside-dhaka"
                ? checkoutT.etaInside
                : checkoutT.etaOutside}
            </p>
            <p className="mt-1 text-xs text-ink-secondary">
              {lastOrder.customer.zone === "inside-dhaka"
                ? t.dhakaCourier
                : t.nationwideCourier}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t.paymentMethod}
            </h2>
            <p className="mt-2 text-xs font-medium text-ink">
              {getLocalizedPaymentSummary(lastOrder, locale)}
            </p>
            <p className="mt-1 text-xs text-ink-secondary">{t.simulatedNote}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {t.orderItems}
          </h2>
          <ul className="mt-4 divide-y divide-border">
            {lastOrder.items.map((item) => {
              const displayName =
                locale === "bn" ? PRODUCT_BN[item.slug]?.name ?? item.name : item.name;
              const variantText = formatOrderVariant(item, locale);
              return (
                <li key={item.key} className="flex items-center gap-4 py-3.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{displayName}</p>
                    <p className="text-xs text-ink-muted">
                      {variantText ? `${variantText} · ` : ""}
                      {formatPrice(item.unitPrice, locale)} x {formatNumber(item.quantity, locale)}
                    </p>
                  </div>
                  <p className="price-num text-sm font-semibold text-ink">
                    {formatPrice(item.unitPrice * item.quantity, locale)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between text-ink-secondary">
            <dt>{t.subtotal}</dt>
            <dd className="price-num font-medium text-ink">
              {formatPrice(lastOrder.subtotal, locale)}
            </dd>
          </div>
          <div className="flex justify-between text-ink-secondary">
            <dt>{t.deliveryFee}</dt>
            <dd
              className={`price-num font-medium ${
                lastOrder.deliveryFee === 0 ? "text-accent" : "text-ink"
              }`}
            >
              {lastOrder.deliveryFee === 0
                ? checkoutT.complimentary
                : formatPrice(lastOrder.deliveryFee, locale)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-ink">
            <dt>{t.total}</dt>
            <dd className="price-num text-lg">{formatPrice(lastOrder.total, locale)}</dd>
          </div>
        </dl>

        <div className="no-print mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" strokeWidth={1.6} />
            <span>{t.printReceipt}</span>
          </Button>
          <Link
            href="/shop"
            className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <span>{t.continueShopping}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
