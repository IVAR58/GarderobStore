import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export type ProductColor = { name: string; hex: string };

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    details: jsonb("details").$type<string[]>().notNull().default([]),
    price: integer("price").notNull(),
    compareAtPrice: integer("compare_at_price"),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    colors: jsonb("colors").$type<ProductColor[]>().notNull().default([]),
    sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
    isNew: boolean("is_new").notNull().default(false),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    inStock: boolean("in_stock").notNull().default(true),
    popularity: integer("popularity").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.categoryId), index("products_price_idx").on(t.price)],
);

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  author: text("author").notNull(),
  badge: text("badge"),
  dateLabel: text("date_label").notNull(),
  rating: integer("rating").notNull().default(5),
  body: text("body").notNull(),
  source: text("source").notNull().default("Яндекс Карты"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  hours: text("hours").notNull(),
  phone: text("phone"),
  mapUrl: text("map_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: varchar("number", { length: 20 }).notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  deliveryMethod: varchar("delivery_method", { length: 30 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 30 }).notNull(),
  city: text("city"),
  address: text("address"),
  pickupStore: text("pickup_store"),
  comment: text("comment"),
  promoCode: text("promo_code"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  deliveryCost: integer("delivery_cost").notNull().default(0),
  total: integer("total").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id"),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  color: text("color"),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const callbackRequests = pgTable("callback_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Store = typeof stores.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
