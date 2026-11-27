import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Star } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(PRODUCTS, product, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        <Link href={`/shop?category=${category.slug}`} className="hover:text-ink">
          {category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <div className="sticky top-24 overflow-hidden rounded-sm border border-border bg-surface-muted">
            <div className="relative aspect-square w-full">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={`/shop?category=${category.slug}`}
              className="text-xs font-semibold uppercase tracking-widest text-accent hover:underline"
            >
              {category.name}
            </Link>
            {product.badge ? (
              <Badge tone={product.badge === "Organic" ? "accent" : "neutral"}>
                {product.badge}
              </Badge>
            ) : null}
          </div>

          <h1 className="font-display mt-3 text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-ink text-ink" strokeWidth={1.5} />
              <span className="price-num font-semibold text-ink">{product.rating.toFixed(1)}</span>
              <span className="text-ink-muted">({product.reviewCount} verified reviews)</span>
            </span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span>SKU: {product.sku}</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span className="font-medium text-accent">In Stock</span>
          </div>

          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Key Highlights
            </h2>
            <ul className="mt-4 space-y-2.5">
              {product.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.8} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 border-t border-border pt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Specifications
            </h2>
            <dl className="mt-4 divide-y divide-border border-y border-border text-sm">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-3 gap-4 py-3">
                  <dt className="font-medium text-ink">{spec.label}</dt>
                  <dd className="col-span-2 text-ink-secondary">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mt-20 border-t border-border pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              You May Also Like
            </p>
            <h2 className="font-display mt-2 text-2xl font-medium text-ink sm:text-3xl">
              Related Essentials
            </h2>
          </div>
          <Link href="/shop" className="text-sm font-medium text-accent hover:underline">
            View full catalog
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
