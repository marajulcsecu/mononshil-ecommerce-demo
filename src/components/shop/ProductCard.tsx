"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import {
  buildCartItemKey,
  formatBdt,
  formatVariantLabel,
  getSavingsPercent,
} from "@/lib/commerce";
import type { Product } from "@/types/commerce";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const defaultPack = product.packs?.[0];
  const displayPrice = defaultPack ? defaultPack.price : product.price;
  const displayCompareAt = defaultPack
    ? defaultPack.compareAtPrice
    : product.compareAtPrice;
  const savings = getSavingsPercent(displayPrice, displayCompareAt);

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const selectedVariant = {
      size: product.sizes?.[Math.min(1, product.sizes.length - 1)],
      color: product.colors?.[0]?.name,
      pack: defaultPack?.label,
    };

    addItem({
      key: buildCartItemKey(product.id, selectedVariant),
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      imageAlt: product.imageAlt,
      unitPrice: displayPrice,
      quantity: 1,
      variantLabel: formatVariantLabel(selectedVariant, product.sizeLabel),
      selectedVariant,
    });
  };

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-surface-muted">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {savings ? (
            <Badge tone="sale">Save {savings}%</Badge>
          ) : product.badge ? (
            <Badge tone={product.badge === "Organic" ? "accent" : "neutral"}>
              {product.badge}
            </Badge>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`Quick add ${product.name} to bag`}
          className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface/95 px-3 text-xs font-medium text-ink shadow-sm backdrop-blur-xs transition-all hover:border-accent hover:bg-accent hover:text-white sm:opacity-0 sm:translate-y-1 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:translate-y-0 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>Quick Add</span>
        </button>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
          <span className="uppercase tracking-wider">{product.category}</span>
          <span className="inline-flex items-center gap-1 text-ink-secondary">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={1.5} />
            <span className="price-num font-medium text-ink">{product.rating.toFixed(1)}</span>
            <span className="text-ink-muted">({product.reviewCount})</span>
          </span>
        </div>

        <h3 className="mt-1.5 text-sm font-medium leading-snug text-ink">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-secondary">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="price-num text-sm font-semibold text-ink">
              {product.packs && product.packs.length > 1 ? "From " : ""}
              {formatBdt(displayPrice)}
            </span>
            {displayCompareAt && displayCompareAt > displayPrice ? (
              <span className="price-num text-xs text-ink-muted line-through">
                {formatBdt(displayCompareAt)}
              </span>
            ) : null}
          </div>

          {product.colors && product.colors.length > 0 ? (
            <div className="flex items-center gap-1" aria-label={`${product.colors.length} color options`}>
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className="h-3 w-3 rounded-full border border-ink/20"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          ) : product.packs ? (
            <span className="text-[11px] text-ink-muted">
              {product.packs.length} pack sizes
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
