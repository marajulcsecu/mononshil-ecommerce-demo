import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const PAYMENT_LABELS = ["Cash on Delivery", "bKash", "Nagad", "Visa / Mastercard"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#171716] text-[#E8E4DC]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="font-display text-2xl font-medium tracking-tight text-white"
            >
              Mononshil
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#A8A399]">
              Thoughtful everyday footwear, natural-fiber apparel, and single-origin pantry
              provisions curated for modern households across Bangladesh.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-[#A8A399]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C8C2B7]" strokeWidth={1.5} />
                <span>House 14, Road 11, Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-[#C8C2B7]" strokeWidth={1.5} />
                <span>+880 1700-000000 (Daily 9:00 AM - 9:00 PM)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-[#C8C2B7]" strokeWidth={1.5} />
                <span>hello@mononshil.com</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Departments
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8A399]">
              <li>
                <Link href="/shop" className="transition-colors hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=footwear" className="transition-colors hover:text-white">
                  Footwear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=apparel" className="transition-colors hover:text-white">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/shop?category=grocery" className="transition-colors hover:text-white">
                  Grocery &amp; Pantry
                </Link>
              </li>
              <li>
                <Link href="/shop?offers=true" className="transition-colors hover:text-white">
                  Seasonal Offers
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Shopping
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#A8A399]">
              <li>
                <Link href="/checkout" className="transition-colors hover:text-white">
                  Checkout
                </Link>
              </li>
              <li>
                <Link href="/order-confirmation" className="transition-colors hover:text-white">
                  Latest Order Receipt
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=rating" className="transition-colors hover:text-white">
                  Customer Favorites
                </Link>
              </li>
              <li>
                <Link href="/shop?price=under-1000" className="transition-colors hover:text-white">
                  Under Tk 1,000
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Payment &amp; Delivery
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A8A399]">
              24-hour delivery inside Dhaka Metro (Tk 80) and 2 to 4 days nationwide (Tk 150).
              Complimentary nationwide delivery on orders Tk 3,000 and above.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PAYMENT_LABELS.map((label) => (
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
          <p>&copy; {new Date().getFullYear()} Mononshil. All rights reserved.</p>
          <p>Interactive storefront preview — catalog and demo checkout run locally without live billing.</p>
        </div>
      </div>
    </footer>
  );
}
