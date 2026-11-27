"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { UI_TEXT } from "@/lib/i18n";

export function PantryBanner() {
  const { locale } = useLocale();
  const t = UI_TEXT[locale].pantryBanner;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid grid-cols-1 overflow-hidden rounded-sm border border-border bg-surface lg:grid-cols-12">
        <div className="relative min-h-[280px] bg-surface-muted lg:col-span-6 lg:min-h-[420px]">
          <Image
            src="/images/hero/pantry-banner.jpg"
            alt="Organized glass jars filled with single-origin grains, spices, and pantry provisions"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center p-8 sm:p-10 lg:col-span-6 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-3xl font-medium leading-tight text-ink sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{t.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs">
            <div>
              <p className="font-semibold text-ink">{t.feature1Title}</p>
              <p className="mt-0.5 text-ink-secondary">{t.feature1Desc}</p>
            </div>
            <div>
              <p className="font-semibold text-ink">{t.feature2Title}</p>
              <p className="mt-0.5 text-ink-secondary">{t.feature2Desc}</p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/shop?category=grocery"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-ink/90"
            >
              <span>{t.cta}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
