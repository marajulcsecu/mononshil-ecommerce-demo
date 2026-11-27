"use client";

import { useState, type ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchModal } from "@/components/layout/SearchModal";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function StorefrontShell({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="no-print">
        <AnnouncementBar />
      </div>
      <Header onOpenSearch={() => setSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer />
    </div>
  );
}
