import type { CartItem, DeliveryZone, SelectedVariant } from "@/types/commerce";

export const FREE_SHIPPING_THRESHOLD = 3000;
export const INSIDE_DHAKA_FEE = 80;
export const OUTSIDE_DHAKA_FEE = 150;
export const MAX_ITEM_QUANTITY = 20;

export function formatBdt(amount: number): string {
  const safeAmount = Math.max(0, Math.round(amount));
  return `Tk ${safeAmount.toLocaleString("en-US")}`;
}

export function calculateDeliveryFee(subtotal: number, zone: DeliveryZone): number {
  if (subtotal <= 0) {
    return 0;
  }
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return zone === "inside-dhaka" ? INSIDE_DHAKA_FEE : OUTSIDE_DHAKA_FEE;
}

export function getFreeShippingRemaining(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function getEstimatedDeliveryText(zone: DeliveryZone): string {
  return zone === "inside-dhaka"
    ? "Within 24 hours (Dhaka Metro)"
    : "2 to 4 business days (Nationwide)";
}

export function buildCartItemKey(productId: string, variant: SelectedVariant): string {
  return [
    productId,
    variant.size ?? "",
    variant.color ?? "",
    variant.pack ?? "",
  ].join("::");
}

export function formatVariantLabel(
  variant: SelectedVariant,
  sizeLabel?: string
): string {
  const parts: string[] = [];
  if (variant.size) {
    parts.push(sizeLabel ? `${sizeLabel} ${variant.size}` : variant.size);
  }
  if (variant.color) {
    parts.push(variant.color);
  }
  if (variant.pack) {
    parts.push(variant.pack);
  }
  return parts.join(" / ");
}

export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) {
    return 1;
  }
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.floor(quantity)));
}

export function upsertCartItem(items: CartItem[], incoming: CartItem): CartItem[] {
  const existingIndex = items.findIndex((item) => item.key === incoming.key);
  if (existingIndex === -1) {
    return [...items, { ...incoming, quantity: clampQuantity(incoming.quantity) }];
  }

  return items.map((item, idx) =>
    idx === existingIndex
      ? {
          ...item,
          quantity: clampQuantity(item.quantity + incoming.quantity),
        }
      : item
  );
}

export function updateCartItemQuantity(
  items: CartItem[],
  key: string,
  nextQuantity: number
): CartItem[] {
  if (nextQuantity <= 0) {
    return items.filter((item) => item.key !== key);
  }
  return items.map((item) =>
    item.key === key ? { ...item, quantity: clampQuantity(nextQuantity) } : item
  );
}

export function removeCartItem(items: CartItem[], key: string): CartItem[] {
  return items.filter((item) => item.key !== key);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function validateBangladeshPhone(raw: string): boolean {
  const normalized = raw.replace(/[\s-]/g, "");
  return /^(\+?880|0)1[3-9]\d{8}$/.test(normalized);
}

export function generateOrderId(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `MN-${year}-${suffix}`;
}

export function getSavingsPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) {
    return null;
  }
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
