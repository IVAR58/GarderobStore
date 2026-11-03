import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, reviews, stores } from "@/db/schema";
import { colorsOf, img, seedCategories, seedProducts, seedReviews, seedStores, SIZES } from "@/db/seed-data";

const globalForEnsure = globalThis as typeof globalThis & {
  __garderobDbReady?: Promise<void>;
};

async function runMigrations() {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
}

export async function seedIfEmpty() {
  await db.delete(reviews);
  await db.delete(stores);
  await db.delete(products);
  await db.delete(categories);

  const insertedCategories = await db
    .insert(categories)
    .values(
      seedCategories.map((c, i) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        image: c.image,
        sortOrder: i,
      })),
    )
    .returning({ id: categories.id, slug: categories.slug });

  const idBySlug = new Map(insertedCategories.map((c) => [c.slug, c.id]));
  const now = Date.now();

  await db.insert(products).values(
    seedProducts.map((p, i) => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      details: p.details,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      categoryId: idBySlug.get(p.category)!,
      images: p.images.map((id) => img(id)),
      colors: colorsOf(...p.colors),
      sizes: p.sizes ?? SIZES.clothing,
      isNew: Boolean(p.isNew),
      isBestseller: Boolean(p.isBestseller),
      isFeatured: Boolean(p.isFeatured),
      inStock: true,
      popularity: p.popularity,
      createdAt: new Date(now - i * 36e5 * 7),
    })),
  );

  await db.insert(reviews).values(
    seedReviews.map((r, i) => ({
      author: r.author,
      badge: r.badge,
      dateLabel: r.dateLabel,
      rating: r.rating,
      body: r.body,
      source: "Яндекс Карты",
      sortOrder: i,
    })),
  );

  await db.insert(stores).values(
    seedStores.map((s, i) => ({
      name: s.name,
      address: s.address,
      city: s.city,
      hours: s.hours,
      phone: s.phone ?? null,
      mapUrl: s.mapUrl,
      sortOrder: i,
    })),
  );

  return true;
}

/**
 * Гарантирует, что схема применена и начальные данные загружены.
 * Выполняется один раз на процесс; повторные вызовы возвращают кешированный промис.
 */
export function ensureDb(): Promise<void> {
  if (!globalForEnsure.__garderobDbReady) {
    globalForEnsure.__garderobDbReady = (async () => {
      await runMigrations();
      await seedIfEmpty();
    })().catch((error) => {
      globalForEnsure.__garderobDbReady = undefined;
      throw error;
    });
  }
  return globalForEnsure.__garderobDbReady;
}
