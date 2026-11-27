import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES } from "../src/data/categories";
import { PRODUCTS } from "../src/data/products";
import {
  CATEGORY_BN,
  PACK_BN,
  PRODUCT_BN,
  getLocalizedProduct,
} from "../src/data/translations-bn";
import { formatPrice, toBanglaDigits } from "../src/lib/i18n";
import { searchProducts } from "../src/lib/catalog";

describe("bilingual localization (EN / BN)", () => {
  it("converts numbers and BDT currency cleanly for English and Bangla", () => {
    assert.equal(toBanglaDigits("2026"), "২০২৬");
    assert.equal(formatPrice(4290, "en"), "Tk 4,290");
    assert.equal(formatPrice(4290, "bn"), "৳ ৪,২৯০");
    assert.equal(formatPrice(680, "bn"), "৳ ৬৮০");
  });

  it("provides Bangla translations for every category, product, and pack label", () => {
    for (const category of CATEGORIES) {
      assert.ok(CATEGORY_BN[category.slug], `Missing BN category for ${category.slug}`);
    }

    for (const product of PRODUCTS) {
      const localized = getLocalizedProduct(product, "bn");
      assert.ok(PRODUCT_BN[product.slug], `Missing BN product for ${product.slug}`);
      assert.notEqual(localized.name, product.name);
      assert.equal(localized.specs.length, product.specs.length);

      if (product.packs) {
        for (const pack of product.packs) {
          assert.ok(PACK_BN[pack.label], `Missing BN pack label for ${pack.label}`);
        }
      }
    }
  });

  it("supports searching products in both English and Bangla", () => {
    const banglaHoney = searchProducts(PRODUCTS, "মধু");
    assert.equal(banglaHoney.length, 1);
    assert.equal(banglaHoney[0].slug, "sundarbans-wild-raw-honey");

    const banglaPanjabi = searchProducts(PRODUCTS, "পাঞ্জাবি");
    assert.equal(banglaPanjabi.length, 1);
    assert.equal(banglaPanjabi[0].slug, "fine-handloom-cotton-panjabi");

    const banglaShoes = searchProducts(PRODUCTS, "জুতা");
    assert.equal(banglaShoes.length, 5);
  });
});
