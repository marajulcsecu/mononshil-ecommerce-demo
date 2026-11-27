import { PRODUCTS } from "@/data/products";
import { CATEGORY_BN, PRODUCT_BN } from "@/data/translations-bn";
import type { CatalogFilters, CategorySlug, Product } from "@/types/commerce";

export function hasProductOffer(product: Product): boolean {
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    return true;
  }
  if (product.packs?.some((pack) => pack.compareAtPrice && pack.compareAtPrice > pack.price)) {
    return true;
  }
  return false;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function searchProducts(products: Product[], rawQuery: string): Product[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) {
    return products;
  }

  return products.filter((product) => {
    const bnProduct = PRODUCT_BN[product.slug];
    const bnCategory = CATEGORY_BN[product.category];
    const haystack = [
      product.name,
      product.sku,
      product.category,
      product.shortDescription,
      product.description,
      ...product.highlights,
      bnProduct?.name ?? "",
      bnProduct?.shortDescription ?? "",
      bnProduct?.description ?? "",
      ...(bnProduct?.highlights ?? []),
      bnCategory?.name ?? "",
      bnCategory?.shortTitle ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

export function filterAndSortProducts(
  products: Product[],
  filters: CatalogFilters
): Product[] {
  let result = [...products];

  if (filters.category && filters.category !== "all") {
    result = result.filter((product) => product.category === filters.category);
  }

  if (filters.query && filters.query.trim().length > 0) {
    result = searchProducts(result, filters.query);
  }

  if (filters.offersOnly) {
    result = result.filter((product) => hasProductOffer(product));
  }

  if (filters.price && filters.price !== "all") {
    result = result.filter((product) => {
      if (filters.price === "under-1000") return product.price < 1000;
      if (filters.price === "1000-3500") return product.price >= 1000 && product.price <= 3500;
      if (filters.price === "over-3500") return product.price > 3500;
      return true;
    });
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "featured":
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
      break;
  }

  return result;
}

export function getRelatedProducts(
  products: Product[],
  current: Product,
  limit = 4
): Product[] {
  const sameCategory = products.filter(
    (item) => item.id !== current.id && item.category === current.category
  );
  const others = products.filter(
    (item) => item.id !== current.id && item.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function getCategoryProductCount(category: CategorySlug): number {
  return PRODUCTS.filter((product) => product.category === category).length;
}
