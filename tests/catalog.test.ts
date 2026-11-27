import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS } from "../src/data/products";
import {
  filterAndSortProducts,
  getProductBySlug,
  getRelatedProducts,
  hasProductOffer,
  searchProducts,
} from "../src/lib/catalog";

describe("catalog data and filtering", () => {
  it("contains 15 products evenly distributed across 3 categories", () => {
    assert.equal(PRODUCTS.length, 15);
    assert.equal(PRODUCTS.filter((p) => p.category === "footwear").length, 5);
    assert.equal(PRODUCTS.filter((p) => p.category === "apparel").length, 5);
    assert.equal(PRODUCTS.filter((p) => p.category === "grocery").length, 5);
  });

  it("filters by category, price range, and offers", () => {
    const groceries = filterAndSortProducts(PRODUCTS, { category: "grocery" });
    assert.equal(groceries.length, 5);
    assert.ok(groceries.every((p) => p.category === "grocery"));

    const under1000 = filterAndSortProducts(PRODUCTS, { price: "under-1000" });
    assert.ok(under1000.length > 0);
    assert.ok(under1000.every((p) => p.price < 1000));

    const offers = filterAndSortProducts(PRODUCTS, { offersOnly: true });
    assert.ok(offers.length >= 3);
    assert.ok(offers.every((p) => hasProductOffer(p)));
  });

  it("sorts by ascending and descending price", () => {
    const asc = filterAndSortProducts(PRODUCTS, { sort: "price-asc" });
    for (let i = 1; i < asc.length; i += 1) {
      assert.ok(asc[i].price >= asc[i - 1].price);
    }

    const desc = filterAndSortProducts(PRODUCTS, { sort: "price-desc" });
    for (let i = 1; i < desc.length; i += 1) {
      assert.ok(desc[i].price <= desc[i - 1].price);
    }
  });

  it("searches across product name, category, and description", () => {
    const honeyResults = searchProducts(PRODUCTS, "sundarbans");
    assert.equal(honeyResults.length, 1);
    assert.equal(honeyResults[0].slug, "sundarbans-wild-raw-honey");

    const panjabiResults = searchProducts(PRODUCTS, "panjabi");
    assert.equal(panjabiResults.length, 1);
    assert.equal(panjabiResults[0].slug, "fine-handloom-cotton-panjabi");
  });

  it("resolves product by slug and returns non-overlapping related products", () => {
    const product = getProductBySlug("velocity-knit-runner");
    assert.ok(product);
    const related = getRelatedProducts(PRODUCTS, product, 4);
    assert.equal(related.length, 4);
    assert.ok(related.every((item) => item.id !== product.id));
  });
});
