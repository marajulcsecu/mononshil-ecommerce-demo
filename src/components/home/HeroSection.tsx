"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { UI_TEXT } from "@/lib/i18n";

export function HeroSection() {
  const { locale } = useLocale();
  const t = UI_TEXT[locale].hero;

  return (
    <section className="border-b border-border bg-canvas">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {t.eyebrow}
          </p>
          <h1 className="font-display mt-4 text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[52px]">
            {t.title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-secondary">
            {t.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center gap-2 rounded-sm bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <span>{t.primaryCta}</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </Link>
            <Link
              href="/shop?category=grocery"
              className="inline-flex h-12 items-center gap-2 rounded-sm border border-border-strong bg-surface px-6 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              <span>{t.secondaryCta}</span>
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                {t.metric1Label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{t.metric1Value}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                {t.metric2Label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{t.metric2Value}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-ink-muted">
                {t.metric3Label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink">{t.metric3Value}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-sm border border-border bg-surface-muted">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/hero/mononshil-hero.jpg"
                alt="Mononshil curated collection of chestnut leather loafers, folded oatmeal linen shirt, raw honey jar, and orthodox tea tin"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-4 py-3 text-xs text-ink-secondary sm:px-5">
              <span className="font-medium text-ink">{t.captionLeft}</span>
              <span>{t.captionRight}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
