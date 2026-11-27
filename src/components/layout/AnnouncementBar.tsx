"use client";

import { useLocale } from "@/context/LocaleContext";
import { UI_TEXT } from "@/lib/i18n";

export function AnnouncementBar() {
  const { locale } = useLocale();
  const t = UI_TEXT[locale];

  return (
    <div className="bg-accent text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-center text-xs tracking-wide sm:px-6 lg:px-8">
        <span>{t.announcementPrimary}</span>
        <span className="hidden h-3 w-px bg-white/30 sm:inline-block" aria-hidden="true" />
        <span className="hidden sm:inline">{t.announcementSecondary}</span>
      </div>
    </div>
  );
}
