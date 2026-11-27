export type CategorySlug = "footwear" | "apparel" | "grocery";

export type DeliveryZone = "inside-dhaka" | "outside-dhaka";

export type PaymentMethod = "cod" | "bkash" | "nagad" | "card";

export type ProductBadge = "Best Seller" | "New Arrival" | "Limited" | "Organic";

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface ProductPackOption {
  label: string;
  price: number;
  compareAtPrice?: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  badge?: ProductBadge;
  image: string;
  imageAlt: string;
  sizes?: string[];
  sizeLabel?: string;
  colors?: ProductColorOption[];
  packs?: ProductPackOption[];
  highlights: string[];
  specs: ProductSpec[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortTitle: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface SelectedVariant {
  size?: string;
  color?: string;
  pack?: string;
}

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: CategorySlug;
  image: string;
  imageAlt: string;
  unitPrice: number;
  quantity: number;
  variantLabel: string;
  selectedVariant: SelectedVariant;
}

export interface CheckoutCustomer {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  area: string;
  zone: DeliveryZone;
  notes?: string;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;
  paymentSummary: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  estimatedDelivery: string;
}

export type CatalogSort = "featured" | "price-asc" | "price-desc" | "rating";

export type PriceFilter = "all" | "under-1000" | "1000-3500" | "over-3500";

export interface CatalogFilters {
  category?: CategorySlug | "all";
  query?: string;
  sort?: CatalogSort;
  price?: PriceFilter;
  offersOnly?: boolean;
}
