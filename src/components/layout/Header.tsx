"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  onOpenSearch: () => void;
}

const NAV_LINKS = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=footwear", label: "Footwear" },
  { href: "/shop?category=apparel", label: "Apparel" },
  { href: "/shop?category=grocery", label: "Grocery" },
  { href: "/shop?offers=true", label: "Offers" },
];

export function Header({ onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount, isHydrated, openDrawer } = useCart();
  const [openedPath, setOpenedPath] = useState<string | null>(null);
  const mobileMenuOpen = openedPath === pathname;

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[72px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenedPath(pathname)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-ink hover:bg-surface-muted lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link
              href="/"
              className="font-display text-2xl font-medium tracking-tight text-ink sm:text-[26px]"
            >
              Mononshil
            </Link>
          </div>

          <nav aria-label="Primary departments" className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-secondary transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-transparent px-2.5 text-sm text-ink-secondary transition-colors hover:border-border hover:bg-surface hover:text-ink cursor-pointer"
              aria-label="Search products"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={openDrawer}
              className="relative inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-surface px-3 text-sm font-medium text-ink transition-colors hover:border-ink cursor-pointer"
              aria-label={`Open shopping bag${isHydrated && itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.6} />
              <span className="hidden sm:inline">Bag</span>
              <span className="price-num inline-flex min-w-5 items-center justify-center rounded-sm bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {isHydrated ? itemCount : 0}
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
                Mononshil
              </Link>
              <button
                type="button"
                onClick={() => setOpenedPath(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Mobile departments" className="flex-1 overflow-y-auto px-5 py-6">
              <ul className="space-y-1">
                {NAV_LINKS.map((item) => (
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

              <div className="mt-8 space-y-2 border-t border-border pt-6 text-xs text-ink-secondary">
                <p className="font-medium uppercase tracking-wider text-ink-muted">
                  Customer Care
                </p>
                <p>Dhaka Metro: 24-hour dispatch</p>
                <p>Nationwide: 2 to 4 business days</p>
                <p>Support: hello@mononshil.com</p>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
