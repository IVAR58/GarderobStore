import type { Category, Product } from "@/db/schema";

export type ProductWithCategory = Product & {
  categoryName: string;
  categorySlug: string;
};

export type SortKey = "featured" | "new" | "price-asc" | "price-desc" | "popular";

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "featured", label: "Рекомендуемые" },
  { value: "new", label: "Сначала новые" },
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
];

export type CatalogFilters = {
  category?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  onlyNew?: boolean;
  onlySale?: boolean;
  q?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
};

export type CatalogResult = {
  items: ProductWithCategory[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type FilterOptions = {
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  minPrice: number;
  maxPrice: number;
  categories: Category[];
};

export type CartLine = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  categoryName: string;
};

export type WishItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  categoryName: string;
  addedAt: number;
};

export type DeliveryMethod = "pickup" | "courier" | "cdek";
export type PaymentMethod = "card" | "sbp" | "cash";

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  email?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  city?: string;
  address?: string;
  pickupStore?: string;
  comment?: string;
  promoCode?: string;
  items: Array<{
    productId: number;
    quantity: number;
    size: string | null;
    color: string | null;
  }>;
};
