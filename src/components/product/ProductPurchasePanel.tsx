"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Minus, Plus, RefreshCw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import {
  buildCartItemKey,
  formatBdt,
  formatVariantLabel,
  getSavingsPercent,
} from "@/lib/commerce";
import type { Product } from "@/types/commerce";

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[Math.min(1, product.sizes.length - 1)]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.name
  );
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const activePack = product.packs?.[selectedPackIndex];
  const unitPrice = activePack ? activePack.price : product.price;
  const compareAtPrice = activePack ? activePack.compareAtPrice : product.compareAtPrice;
  const savings = getSavingsPercent(unitPrice, compareAtPrice);

  const buildCartPayload = () => {
    const selectedVariant = {
      size: selectedSize,
      color: selectedColor,
      pack: activePack?.label,
    };

    return {
      key: buildCartItemKey(product.id, selectedVariant),
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      imageAlt: product.imageAlt,
      unitPrice,
      quantity,
      variantLabel: formatVariantLabel(selectedVariant, product.sizeLabel),
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
          {formatBdt(unitPrice)}
        </p>
        {compareAtPrice && compareAtPrice > unitPrice ? (
          <>
            <p className="price-num text-base text-ink-muted line-through">
              {formatBdt(compareAtPrice)}
            </p>
            {savings ? <Badge tone="sale">Save {savings}%</Badge> : null}
          </>
        ) : null}
      </div>

      <p className="text-sm leading-relaxed text-ink-secondary">{product.description}</p>

      {product.colors && product.colors.length > 0 ? (
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Color
            </span>
            <span className="text-xs font-medium text-ink">{selectedColor}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.colors.map((color) => {
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
                  <span>{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {product.sizes && product.sizes.length > 0 ? (
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Select {product.sizeLabel ?? "Size"}
            </span>
            <span className="text-xs text-ink-muted">True to fit</span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {product.sizes.map((size) => {
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
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {product.packs && product.packs.length > 0 ? (
        <div className="border-t border-border pt-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Select Pack Size
          </span>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {product.packs.map((pack, idx) => {
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
                  <span className="text-sm font-medium">{pack.label}</span>
                  <span className="price-num text-sm font-semibold">{formatBdt(pack.price)}</span>
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
            <span className="price-num text-sm font-semibold text-ink">{quantity}</span>
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
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
                <span>Add to Bag — {formatBdt(unitPrice * quantity)}</span>
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
          Buy Now
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-sm border border-border bg-surface-muted/70 p-4 text-xs text-ink-secondary sm:grid-cols-3">
        <div className="flex items-start gap-2.5">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium text-ink">Dhaka &amp; Nationwide</p>
            <p className="mt-0.5">Tk 80 Dhaka, Tk 150 outside. Free over Tk 3,000.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium text-ink">7-Day Exchange</p>
            <p className="mt-0.5">Simple size swap or sealed pantry return.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.6} />
          <div>
            <p className="font-medium text-ink">Verified Quality</p>
            <p className="mt-0.5">Inspected before dispatch in Dhaka.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
