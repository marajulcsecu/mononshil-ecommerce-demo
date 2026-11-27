import type { Metadata } from "next";
import {
  Fraunces,
  Hind_Siliguri,
  Noto_Serif_Bengali,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { LocaleProvider } from "@/context/LocaleContext";
import { CartProvider } from "@/context/CartContext";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["500", "600"],
  variable: "--font-noto-serif-bn",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mononshil | Footwear, Apparel & Pantry — Bangladesh",
    template: "%s | Mononshil",
  },
  description:
    "Discover thoughtful everyday footwear, breathable Bengal apparel, and single-origin pantry provisions delivered nationwide across Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakarta.variable} ${hindSiliguri.variable} ${notoSerifBengali.variable}`}
    >
      <body className="bg-canvas text-ink antialiased">
        <LocaleProvider>
          <CartProvider>
            <StorefrontShell>{children}</StorefrontShell>
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
