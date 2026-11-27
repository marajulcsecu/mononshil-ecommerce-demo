"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { UI_TEXT, formatNumber } from "@/lib/i18n";

interface HeaderProps {
  onOpenSearch: () => void;
}

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, isHydrated, openDrawer } = useCart();
  const { locale } = useLocale();
  const t = UI_TEXT[locale];

  const [openedPath, setOpenedPath] = useState<string | null>(null);
  const mobileMenuOpen = openedPath === pathname;

  const navLinks = [
    { href: "/shop", label: t.nav.shopAll },
    { href: "/shop?category=footwear", label: t.nav.footwear },
    { href: "/shop?category=apparel", label: t.nav.apparel },
    { href: "/shop?category=grocery", label: t.nav.grocery },
    { href: "/shop?offers=true", label: t.nav.offers },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedPath(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-canvas/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setOpenedPath(pathname)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-surface-muted lg:hidden cursor-pointer"
              aria-label={t.nav.menuAria}
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              href="/"
              className="font-display text-2xl font-medium tracking-tight text-ink sm:text-[26px]"
            >
              {t.brandName}
            </Link>
          </div>

          <nav aria-label="Primary departments" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageToggle />

            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-transparent px-2 text-sm text-ink-secondary transition-colors hover:border-border hover:bg-surface hover:text-ink sm:h-10 sm:px-2.5 cursor-pointer"
              aria-label={t.nav.search}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span className="hidden md:inline">{t.nav.search}</span>
            </button>

            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 text-sm font-medium text-ink transition-colors hover:border-ink sm:h-10 sm:gap-2 sm:px-3 cursor-pointer"
              aria-label={`${t.cart.title}${isHydrated && itemCount > 0 ? `, ${itemCount}` : ""}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span className="hidden sm:inline">{t.nav.bag}</span>
              <span className="price-num inline-flex min-w-5 items-center justify-center rounded-sm bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {formatNumber(isHydrated ? itemCount : 0, locale)}
              </span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-[1px]"
            onClick={() => setOpenedPath(null)}
          />
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-surface shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Link
                href="/"
                onClick={() => setOpenedPath(null)}
                className="font-display text-2xl font-medium tracking-tight text-ink"
              >
                {t.brandName}
              </Link>
              <button
                type="button"
                onClick={() => setOpenedPath(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label={t.nav.closeMenuAria}
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Mobile departments" className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenedPath(null)}
                      className="flex items-center justify-between rounded-sm px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-surface-muted"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-border pt-5">
                <LanguageToggle />
              </div>

              <div className="mt-6 space-y-2 border-t border-border pt-5 text-xs text-ink-secondary">
                <p className="font-medium uppercase tracking-wider text-ink-muted">
                  {t.nav.customerCare}
                </p>
                <p>{t.nav.dhakaDispatch}</p>
                <p>{t.nav.nationwideDispatch}</p>
                <p>{t.nav.supportLine}</p>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
