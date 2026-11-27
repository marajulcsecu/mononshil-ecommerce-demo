import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { getCategoryProductCount } from "@/lib/catalog";

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Departments
          </p>
          <h2 className="font-display mt-2 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Three departments, one standard of quality.
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-sm font-medium text-accent hover:underline"
        >
          Browse complete catalog
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {CATEGORIES.map((category) => {
          const count = getCategoryProductCount(category.slug);
          return (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-sm border border-border bg-surface-muted"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={category.image}
                  alt={category.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-white/80">
                      {count} Curated Items
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-sm bg-white/15 backdrop-blur-xs transition-colors group-hover:bg-white group-hover:text-ink">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                  <h3 className="font-display mt-2 text-2xl font-medium">{category.name}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                    {category.tagline}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
