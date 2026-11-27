import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  FREE_SHIPPING_THRESHOLD,
  INSIDE_DHAKA_FEE,
  OUTSIDE_DHAKA_FEE,
  buildCartItemKey,
  calculateDeliveryFee,
  formatBdt,
  formatVariantLabel,
  generateOrderId,
  getFreeShippingRemaining,
  removeCartItem,
  updateCartItemQuantity,
  upsertCartItem,
  validateBangladeshPhone,
} from "../src/lib/commerce";
import type { CartItem } from "../src/types/commerce";

const sampleItem: CartItem = {
  key: "prod-1::42::Chestnut::",
  productId: "prod-1",
  slug: "hand-stitched-leather-loafer",
  name: "Hand-Stitched Leather Loafer",
  category: "footwear",
  image: "/images/products/hand-stitched-leather-loafer.jpg",
  imageAlt: "Leather loafer",
  unitPrice: 5850,
  quantity: 1,
  variantLabel: "EU 42 / Chestnut",
  selectedVariant: { size: "42", color: "Chestnut" },
};

describe("commerce helpers", () => {
  it("formats BDT amounts with Tk prefix and comma separators", () => {
    assert.equal(formatBdt(0), "Tk 0");
    assert.equal(formatBdt(680), "Tk 680");
    assert.equal(formatBdt(4290), "Tk 4,290");
    assert.equal(formatBdt(12500), "Tk 12,500");
  });

  it("calculates delivery fees and free shipping threshold accurately", () => {
    assert.equal(calculateDeliveryFee(0, "inside-dhaka"), 0);
    assert.equal(calculateDeliveryFee(1500, "inside-dhaka"), INSIDE_DHAKA_FEE);
    assert.equal(calculateDeliveryFee(1500, "outside-dhaka"), OUTSIDE_DHAKA_FEE);
    assert.equal(calculateDeliveryFee(FREE_SHIPPING_THRESHOLD, "inside-dhaka"), 0);
    assert.equal(calculateDeliveryFee(FREE_SHIPPING_THRESHOLD + 500, "outside-dhaka"), 0);

    assert.equal(getFreeShippingRemaining(1200), 1800);
    assert.equal(getFreeShippingRemaining(3500), 0);
  });

  it("builds deterministic cart keys and readable variant labels", () => {
    const key = buildCartItemKey("p-1", { size: "42", color: "Chestnut" });
    assert.equal(key, "p-1::42::Chestnut::");
    assert.equal(formatVariantLabel({ size: "42", color: "Chestnut" }, "EU Size"), "EU Size 42 / Chestnut");
    assert.equal(formatVariantLabel({ pack: "500g" }), "500g");
  });

  it("merges duplicate cart items, clamps quantities, and removes items", () => {
    const afterAdd = upsertCartItem([], sampleItem);
    assert.equal(afterAdd.length, 1);
    assert.equal(afterAdd[0].quantity, 1);

    const afterDuplicate = upsertCartItem(afterAdd, { ...sampleItem, quantity: 2 });
    assert.equal(afterDuplicate.length, 1);
    assert.equal(afterDuplicate[0].quantity, 3);

    const clamped = updateCartItemQuantity(afterDuplicate, sampleItem.key, 99);
    assert.equal(clamped[0].quantity, 20);

    const removedByZero = updateCartItemQuantity(clamped, sampleItem.key, 0);
    assert.equal(removedByZero.length, 0);

    const removedExplicit = removeCartItem(afterDuplicate, sampleItem.key);
    assert.equal(removedExplicit.length, 0);
  });

  it("validates Bangladesh mobile numbers properly", () => {
    assert.equal(validateBangladeshPhone("01712345678"), true);
    assert.equal(validateBangladeshPhone("+8801812345678"), true);
    assert.equal(validateBangladeshPhone("019 1234-5678"), true);
    assert.equal(validateBangladeshPhone("01212345678"), false);
    assert.equal(validateBangladeshPhone("12345"), false);
  });

  it("generates Mononshil order IDs matching MN-YYYY-XXXX pattern", () => {
    const orderId = generateOrderId(new Date("2026-11-27T10:00:00Z"));
    assert.match(orderId, /^MN-2026-\d{4}$/);
  });
});
