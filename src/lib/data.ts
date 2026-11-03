import "server-only";
import { and, asc, desc, eq, getTableColumns, gte, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { ensureDb } from "@/db/ensure";
import {
  callbackRequests,
  categories,
  orderItems,
  orders,
  products,
  reviews,
  stores,
  subscribers,
  type Category,
  type Order,
  type OrderItem,
  type Review,
  type Store,
} from "@/db/schema";
import { site } from "@/lib/site";
import type {
  CatalogFilters,
  CatalogResult,
  CheckoutPayload,
  FilterOptions,
  ProductWithCategory,
  SortKey,
} from "@/lib/types";

const productSelection = {
  ...getTableColumns(products),
  categoryName: categories.name,
  categorySlug: categories.slug,
};

function baseProductQuery() {
  return db.select(productSelection).from(products).innerJoin(categories, eq(products.categoryId, categories.id));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/ё/g, "е").trim();
}

function searchCondition(q: string): SQL | undefined {
  const words = normalize(q)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .map((w) => (w.length > 5 ? w.slice(0, Math.max(4, w.length - 2)) : w));
  if (!words.length) return undefined;
  const conds = words.map((w) => {
    const pattern = `%${w}%`;
    return or(
      sql`translate(lower(${products.name}), 'ё', 'е') like ${pattern}`,
      sql`translate(lower(${products.description}), 'ё', 'е') like ${pattern}`,
      sql`translate(lower(${categories.name}), 'ё', 'е') like ${pattern}`,
      sql`translate(lower(${products.colors}::text), 'ё', 'е') like ${pattern}`,
    )!;
  });
  return and(...conds);
}

function buildConditions(filters: CatalogFilters): SQL | undefined {
  const conds: SQL[] = [];
  if (filters.category) conds.push(eq(categories.slug, filters.category));
  if (filters.sizes?.length) {
    conds.push(or(...filters.sizes.map((s) => sql`${products.sizes} @> ${JSON.stringify([s])}::jsonb`))!);
  }
  if (filters.colors?.length) {
    conds.push(or(...filters.colors.map((c) => sql`${products.colors} @> ${JSON.stringify([{ name: c }])}::jsonb`))!);
  }
  if (typeof filters.minPrice === "number") conds.push(gte(products.price, filters.minPrice));
  if (typeof filters.maxPrice === "number") conds.push(lte(products.price, filters.maxPrice));
  if (filters.onlyNew) conds.push(eq(products.isNew, true));
  if (filters.onlySale) conds.push(sql`${products.compareAtPrice} is not null and ${products.compareAtPrice} > ${products.price}`);
  if (filters.q) {
    const s = searchCondition(filters.q);
    if (s) conds.push(s);
  }
  return conds.length ? and(...conds) : undefined;
}

function orderFor(sort: SortKey | undefined) {
  switch (sort) {
    case "new":
      return [desc(products.isNew), desc(products.createdAt), desc(products.id)];
    case "price-asc":
      return [asc(products.price), asc(products.id)];
    case "price-desc":
      return [desc(products.price), asc(products.id)];
    case "popular":
      return [desc(products.popularity), asc(products.id)];
    default:
      return [desc(products.isFeatured), desc(products.popularity), asc(products.id)];
  }
}

export async function getCategories(): Promise<Category[]> {
  await ensureDb();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await ensureDb();
  const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProducts(filters: CatalogFilters = {}): Promise<CatalogResult> {
  await ensureDb();
  const perPage = filters.perPage ?? 12;
  const page = Math.max(1, filters.page ?? 1);
  const where = buildConditions(filters);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(where);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);

  const items = await baseProductQuery()
    .where(where)
    .orderBy(...orderFor(filters.sort))
    .limit(perPage)
    .offset((safePage - 1) * perPage);

  return { items, total, page: safePage, perPage, totalPages };
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  await ensureDb();
  const rows = await baseProductQuery().where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getProductsByIds(ids: number[]): Promise<ProductWithCategory[]> {
  if (!ids.length) return [];
  await ensureDb();
  return baseProductQuery().where(inArray(products.id, ids));
}

export async function getRelatedProducts(product: ProductWithCategory, limit = 4): Promise<ProductWithCategory[]> {
  await ensureDb();
  const sameCategory = await baseProductQuery()
    .where(and(eq(products.categoryId, product.categoryId), ne(products.id, product.id)))
    .orderBy(desc(products.popularity))
    .limit(limit);
  if (sameCategory.length >= limit) return sameCategory;
  const excluded = [product.id, ...sameCategory.map((p) => p.id)];
  const fill = await baseProductQuery()
    .where(and(eq(products.isFeatured, true), sql`${products.id} not in (${sql.join(excluded.map((id) => sql`${id}`), sql`, `)})`))
    .orderBy(desc(products.popularity))
    .limit(limit - sameCategory.length);
  return [...sameCategory, ...fill];
}

export async function getHomeCollections() {
  await ensureDb();
  const [featured, fresh, bestsellers] = await Promise.all([
    baseProductQuery().where(eq(products.isFeatured, true)).orderBy(desc(products.popularity)).limit(8),
    baseProductQuery().where(eq(products.isNew, true)).orderBy(desc(products.createdAt)).limit(8),
    baseProductQuery().where(eq(products.isBestseller, true)).orderBy(desc(products.popularity)).limit(8),
  ]);
  return { featured, fresh, bestsellers };
}

export async function getFilterOptions(categorySlug?: string): Promise<FilterOptions> {
  await ensureDb();
  const where = categorySlug ? eq(categories.slug, categorySlug) : undefined;
  const [rows, cats] = await Promise.all([
    db
      .select({ sizes: products.sizes, colors: products.colors, price: products.price })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
    getCategories(),
  ]);

  const sizeSet = new Set<string>();
  const colorMap = new Map<string, string>();
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = 0;
  for (const row of rows) {
    row.sizes.forEach((s) => sizeSet.add(s));
    row.colors.forEach((c) => colorMap.set(c.name, c.hex));
    minPrice = Math.min(minPrice, row.price);
    maxPrice = Math.max(maxPrice, row.price);
  }
  const sizeOrder = ["XS", "S", "M", "L", "XL", "36", "37", "38", "39", "40", "Единый размер"];
  const sizes = [...sizeSet].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));
  const colors = [...colorMap.entries()].map(([name, hex]) => ({ name, hex }));
  return {
    sizes,
    colors,
    minPrice: Number.isFinite(minPrice) ? minPrice : 0,
    maxPrice,
    categories: cats,
  };
}

export async function searchProducts(q: string, limit = 6): Promise<ProductWithCategory[]> {
  await ensureDb();
  const cond = searchCondition(q);
  if (!cond) return [];
  return baseProductQuery().where(cond).orderBy(desc(products.popularity)).limit(limit);
}

export async function getReviews(): Promise<Review[]> {
  await ensureDb();
  return db.select().from(reviews).orderBy(asc(reviews.sortOrder));
}

export async function getStores(): Promise<Store[]> {
  await ensureDb();
  return db.select().from(stores).orderBy(asc(stores.sortOrder));
}

/* ——— Заказы ——— */

export function deliveryCostFor(method: string, subtotal: number) {
  if (method === "pickup") return 0;
  if (subtotal >= site.delivery.freeFrom) return 0;
  if (method === "courier") return site.delivery.courier;
  if (method === "cdek") return site.delivery.cdek;
  return 0;
}

export function promoDiscountFor(code: string | undefined, subtotal: number) {
  if (!code) return 0;
  const percent = site.promoCodes[code.trim().toUpperCase()];
  if (!percent) return 0;
  return Math.round((subtotal * percent) / 100);
}

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.floor(Math.random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  return `GB-${stamp}${rand}`;
}

export type CreatedOrder = { number: string; total: number };

export async function createOrder(payload: CheckoutPayload): Promise<CreatedOrder> {
  await ensureDb();
  const ids = [...new Set(payload.items.map((i) => i.productId))];
  const dbProducts = await getProductsByIds(ids);
  const byId = new Map(dbProducts.map((p) => [p.id, p]));

  const lines = payload.items
    .filter((i) => byId.has(i.productId) && i.quantity > 0)
    .map((i) => {
      const p = byId.get(i.productId)!;
      return {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.images[0] ?? null,
        price: p.price,
        quantity: Math.min(10, Math.max(1, Math.floor(i.quantity))),
        size: i.size,
        color: i.color,
      };
    });

  if (!lines.length) throw new Error("Корзина пуста");

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const discount = promoDiscountFor(payload.promoCode, subtotal);
  const deliveryCost = deliveryCostFor(payload.deliveryMethod, subtotal - discount);
  const total = subtotal - discount + deliveryCost;

  return db.transaction(async (tx) => {
    let number = generateOrderNumber();
    // Крайне маловероятно, но на всякий случай гарантируем уникальность номера.
    for (let attempt = 0; attempt < 3; attempt++) {
      const exists = await tx.select({ id: orders.id }).from(orders).where(eq(orders.number, number)).limit(1);
      if (!exists.length) break;
      number = generateOrderNumber();
    }
    const [order] = await tx
      .insert(orders)
      .values({
        number,
        customerName: payload.customerName,
        phone: payload.phone,
        email: payload.email || null,
        deliveryMethod: payload.deliveryMethod,
        paymentMethod: payload.paymentMethod,
        city: payload.city || null,
        address: payload.address || null,
        pickupStore: payload.pickupStore || null,
        comment: payload.comment || null,
        promoCode: discount > 0 ? payload.promoCode?.toUpperCase() : null,
        subtotal,
        discount,
        deliveryCost,
        total,
      })
      .returning({ id: orders.id, number: orders.number });

    await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
    return { number: order.number, total };
  });
}

export async function getOrderByNumber(number: string): Promise<{ order: Order; items: OrderItem[] } | null> {
  await ensureDb();
  const [order] = await db.select().from(orders).where(eq(orders.number, number)).limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)).orderBy(asc(orderItems.id));
  return { order, items };
}

export async function subscribeEmail(email: string) {
  await ensureDb();
  await db.insert(subscribers).values({ email: email.toLowerCase() }).onConflictDoNothing();
}

export async function createCallbackRequest(input: { name: string; phone: string; message?: string }) {
  await ensureDb();
  await db.insert(callbackRequests).values({ name: input.name, phone: input.phone, message: input.message || null });
}
