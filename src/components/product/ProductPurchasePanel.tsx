"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, RefreshCw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import {
  getLocalizedProduct,
  translateColorName,
  translatePackLabel,
  translateSizeValue,
} from "@/data/translations-bn";
import {
  buildCartItemKey,
  formatVariantLabel,
  getSavingsPercent,
} from "@/lib/commerce";
import { UI_TEXT, formatNumber, formatPrice } from "@/lib/i18n";
import type { Product } from "@/types/commerce";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product: rawProduct }: ProductPurchasePanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { locale } = useLocale();
  const t = UI_TEXT[locale].productDetail;
  const cardT = UI_TEXT[locale].productCard;

  const product = getLocalizedProduct(rawProduct, locale);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    rawProduct.sizes?.[Math.min(1, rawProduct.sizes.length - 1)]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    rawProduct.colors?.[0]?.name
  );
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const activePack = rawProduct.packs?.[selectedPackIndex];
  const unitPrice = activePack ? activePack.price : rawProduct.price;
  const compareAtPrice = activePack ? activePack.compareAtPrice : rawProduct.compareAtPrice;
  const savings = getSavingsPercent(unitPrice, compareAtPrice);

  const buildCartPayload = () => {
    const selectedVariant = {
      size: selectedSize,
      color: selectedColor,
      pack: activePack?.label,
    };

    return {
      key: buildCartItemKey(rawProduct.id, selectedVariant),
      productId: rawProduct.id,
      slug: rawProduct.slug,
      name: rawProduct.name,
      category: rawProduct.category,
      image: rawProduct.image,
      imageAlt: rawProduct.imageAlt,
      unitPrice,
      quantity,
      variantLabel: formatVariantLabel(selectedVariant, rawProduct.sizeLabel),
      selectedVariant,
    };
  };

  const handleAddToBag = () => {
    addItem(buildCartPayload(), { openDrawer: true });
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleBuyNow = () => {
    addItem(buildCartPayload(), { openDrawer: false });
    router.push("/checkout");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <p className="price-num text-2xl font-semibold text-ink sm:text-3xl">
          {formatPrice(unitPrice, locale)}
        </p>
        {compareAtPrice && compareAtPrice > unitPrice ? (
          <>
            <p className="price-num text-base text-ink-muted line-through">
              {formatPrice(compareAtPrice, locale)}
            </p>
            {savings ? (
              <Badge tone="sale">
                {cardT.savePrefix} {formatNumber(savings, locale)}%
              </Badge>
            ) : null}
          </>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-ink-secondary">{product.description}</p>

      {rawProduct.colors && rawProduct.colors.length > 0 ? (
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t.color}
            </span>
            <span className="text-xs font-medium text-ink">
              {selectedColor ? translateColorName(selectedColor, locale) : ""}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {rawProduct.colors.map((color) => {
              const isSelected = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "border-ink bg-surface text-ink ring-1 ring-ink"
                      : "border-border bg-surface text-ink-secondary hover:border-border-strong hover:text-ink"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-ink/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{translateColorName(color.name, locale)}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {rawProduct.sizes && rawProduct.sizes.length > 0 ? (
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {t.selectPrefix} {product.sizeLabel ?? "Size"}
            </span>
            <span className="text-xs text-ink-muted">{t.trueToFit}</span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {rawProduct.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={isSelected}
                  className={`h-10 rounded-sm border text-sm font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-surface text-ink hover:border-ink"
                  }`}
                >
                  {translateSizeValue(size, locale)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {rawProduct.packs && rawProduct.packs.length > 0 ? (
        <div className="border-t border-border pt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            {t.selectPackSize}
          </span>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {rawProduct.packs.map((pack, idx) => {
              const isSelected = selectedPackIndex === idx;
              return (
                <button
                  key={pack.label}
                  type="button"
                  onClick={() => setSelectedPackIndex(idx)}
                  aria-pressed={isSelected}
                  className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent-soft/60 text-ink ring-1 ring-accent"
                      : "border-border bg-surface text-ink hover:border-ink"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {translatePackLabel(pack.label, locale)}
                  </span>
                  <span className="price-num text-sm font-semibold">
                    {formatPrice(pack.price, locale)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="border-t border-border pt-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="inline-flex h-12 items-center justify-between rounded-sm border border-border-strong bg-surface sm:w-32">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="inline-flex h-full w-10 items-center justify-center text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" strokeWidth={1.6} />
            </button>
            <span className="price-num text-sm font-semibold text-ink">
              {formatNumber(quantity, locale)}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(20, q + 1))}
              className="inline-flex h-full w-10 items-center justify-center text-ink-secondary hover:bg-surface-muted hover:text-ink cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToBag}
            className="flex-1"
          >
            {addedFeedback ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2} />
                <span>{t.addedToBag}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
                <span>
                  {t.addToBag} — {formatPrice(unitPrice * quantity, locale)}
                </span>
              </>
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          className="mt-3"
        >
          {t.buyNow}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-sm border border-border bg-surface-muted/70 p-4 text-xs text-ink-secondary sm:grid-cols-3">
        <div className="flex items-start gap-2.5">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium text-ink">{t.shippingTitle}</p>
            <p className="mt-0.5">{t.shippingDesc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium text-ink">{t.exchangeTitle}</p>
            <p className="mt-0.5">{t.exchangeDesc}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium text-ink">{t.qualityTitle}</p>
            <p className="mt-0.5">{t.qualityDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
