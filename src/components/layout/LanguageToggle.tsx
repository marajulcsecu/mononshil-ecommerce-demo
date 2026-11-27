"use client";

import { useLocale } from "@/context/LocaleContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex h-9 items-center rounded-sm border border-border bg-surface p-0.5 text-xs font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`h-full rounded-[3px] px-2.5 transition-colors cursor-pointer ${
          locale === "en"
            ? "bg-ink text-white"
            : "text-ink-secondary hover:text-ink"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        aria-pressed={locale === "bn"}
        className={`h-full rounded-[3px] px-2.5 transition-colors cursor-pointer ${
          locale === "bn"
            ? "bg-ink text-white"
            : "text-ink-secondary hover:text-ink"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
