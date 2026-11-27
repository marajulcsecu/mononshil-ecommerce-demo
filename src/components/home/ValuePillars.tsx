"use client";

import { RefreshCw, ShieldCheck, Truck, Wallet } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { UI_TEXT } from "@/lib/i18n";

const PILLAR_ICONS = [Truck, RefreshCw, ShieldCheck, Wallet];

export function ValuePillars() {
  const { locale } = useLocale();
  const pillars = UI_TEXT[locale].pillars;

  return (
    <section className="border-y border-border bg-surface-muted">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {pillars.map((pillar, index) => {
          const Icon = PILLAR_ICONS[index];
          return (
            <div key={pillar.title} className="flex flex-col">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-surface text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink">{pillar.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-secondary">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
