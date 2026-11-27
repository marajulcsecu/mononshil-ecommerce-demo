"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { UI_TEXT, toBanglaDigits } from "@/lib/i18n";

export function Footer() {
  const { locale } = useLocale();
  const root = UI_TEXT[locale];
  const t = root.footer;
  const year = locale === "bn" ? toBanglaDigits(new Date().getFullYear()) : new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-[#171716] text-[#E8E4DC]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-display text-2xl font-medium tracking-tight text-white"
            >
              {root.brandName}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#A8A399]">
              {t.tagline}
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-[#A8A399]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C8C2B7]" strokeWidth={1.5} />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#C8C2B7]" strokeWidth={1.5} />
                <span>{t.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#C8C2B7]" strokeWidth={1.5} />
                <span>hello@mononshil.com</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.departments}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8A399]">
              <li>
                <Link href="/shop" className="transition-colors hover:text-white">
                  {t.allProducts}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=footwear" className="transition-colors hover:text-white">
                  {t.footwear}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=apparel" className="transition-colors hover:text-white">
                  {t.apparel}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=grocery" className="transition-colors hover:text-white">
                  {t.grocery}
                </Link>
              </li>
              <li>
                <Link href="/shop?offers=true" className="transition-colors hover:text-white">
                  {t.seasonalOffers}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.shopping}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8A399]">
              <li>
                <Link href="/checkout" className="transition-colors hover:text-white">
                  {t.checkout}
                </Link>
              </li>
              <li>
                <Link href="/order-confirmation" className="transition-colors hover:text-white">
                  {t.latestReceipt}
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=rating" className="transition-colors hover:text-white">
                  {t.favorites}
                </Link>
              </li>
              <li>
                <Link href="/shop?price=under-1000" className="transition-colors hover:text-white">
                  {t.under1000}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              {t.paymentDelivery}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A8A399]">
              {t.deliveryCopy}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.paymentLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-sm border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#D8D3C9]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#8E897F] sm:flex-row sm:items-center">
          <p>
            &copy; {year} {t.rights}
          </p>
          <p>{t.previewNote}</p>
        </div>
      </div>
    </footer>
  );
}
