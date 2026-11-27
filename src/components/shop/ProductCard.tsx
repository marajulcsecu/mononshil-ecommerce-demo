"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { getCategoryBySlug } from "@/data/categories";
import {
  getLocalizedCategory,
  getLocalizedProduct,
  translateBadge,
  translateColorName,
} from "@/data/translations-bn";
import {
  buildCartItemKey,
  formatVariantLabel,
  getSavingsPercent,
} from "@/lib/commerce";
import { UI_TEXT, formatNumber, formatPrice, formatRating } from "@/lib/i18n";
import type { Product } from "@/types/commerce";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product: rawProduct }: ProductCardProps) {
  const { addItem } = useCart();
  const { locale } = useLocale();
  const t = UI_TEXT[locale].productCard;

  const product = getLocalizedProduct(rawProduct, locale);
  const category = getLocalizedCategory(getCategoryBySlug(rawProduct.category), locale);

  const defaultPack = rawProduct.packs?.[0];
  const displayPrice = defaultPack ? defaultPack.price : rawProduct.price;
  const displayCompareAt = defaultPack
    ? defaultPack.compareAtPrice
    : rawProduct.compareAtPrice;
  const savings = getSavingsPercent(displayPrice, displayCompareAt);

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const selectedVariant = {
      size: rawProduct.sizes?.[Math.min(1, rawProduct.sizes.length - 1)],
      color: rawProduct.colors?.[0]?.name,
      pack: defaultPack?.label,
    };

    addItem({
      key: buildCartItemKey(rawProduct.id, selectedVariant),
      productId: rawProduct.id,
      slug: rawProduct.slug,
      name: rawProduct.name,
      category: rawProduct.category,
      image: rawProduct.image,
      imageAlt: rawProduct.imageAlt,
      unitPrice: displayPrice,
      quantity: 1,
      variantLabel: formatVariantLabel(selectedVariant, rawProduct.sizeLabel),
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
            <Badge tone="sale">
              {t.savePrefix} {formatNumber(savings, locale)}%
            </Badge>
          ) : product.badge ? (
            <Badge tone={product.badge === "Organic" ? "accent" : "neutral"}>
              {translateBadge(product.badge, locale)}
            </Badge>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          aria-label={`${t.quickAdd} ${product.name}`}
          className="absolute bottom-3 right-3 inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-surface/95 px-3 text-xs font-medium text-ink shadow-sm backdrop-blur-xs transition-all hover:border-accent hover:bg-accent hover:text-white sm:translate-y-1 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span>{t.quickAdd}</span>
        </button>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
          <span className="uppercase tracking-wider">{category.shortTitle}</span>
          <span className="inline-flex items-center gap-1 text-ink-secondary">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={1.5} />
            <span className="price-num font-medium text-ink">
              {formatRating(product.rating, locale)}
            </span>
            <span className="text-ink-muted">({formatNumber(product.reviewCount, locale)})</span>
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
              {product.packs && product.packs.length > 1 ? t.fromPrefix : ""}
              {formatPrice(displayPrice, locale)}
            </span>
            {displayCompareAt && displayCompareAt > displayPrice ? (
              <span className="price-num text-xs text-ink-muted line-through">
                {formatPrice(displayCompareAt, locale)}
              </span>
            ) : null}
          </div>

          {product.colors && product.colors.length > 0 ? (
            <div className="flex items-center gap-1" aria-label={`${product.colors.length} color options`}>
              {product.colors.map((color) => (
                <span
                  key={color.name}
                  title={translateColorName(color.name, locale)}
                  className="h-3 w-3 rounded-full border border-ink/20"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          ) : product.packs ? (
            <span className="text-[11px] text-ink-muted">
              {formatNumber(product.packs.length, locale)} {t.packSizes}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
