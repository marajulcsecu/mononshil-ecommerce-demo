import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Error 404</p>
      <h1 className="font-display mt-3 text-3xl font-medium text-ink sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
        The product or page you requested could not be found. Browse our complete footwear,
        apparel, and pantry catalog to continue exploring Mononshil.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center gap-2 rounded-sm bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <span>Shop All Products</span>
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2 rounded-sm border border-border-strong bg-surface px-5 text-sm font-medium text-ink transition-colors hover:border-ink"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          <span>Return Home</span>
        </Link>
      </div>
    </section>
  );
}
