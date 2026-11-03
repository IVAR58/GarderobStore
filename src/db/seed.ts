/**
 * Ручной запуск миграций и наполнения базы:
 *   npx tsx src/db/seed.ts            — применить миграции и засеять, если база пустая
 *   npx tsx src/db/seed.ts --reset    — очистить каталог/отзывы/магазины и засеять заново
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db, pool } from "@/db";
import { ensureDb, seedIfEmpty } from "@/db/ensure";

async function main() {
  const reset = process.argv.includes("--reset");
  await ensureDb();
  if (reset) {
    await db.execute(sql`truncate table order_items, orders, products, categories, reviews, stores restart identity cascade`);
    const seeded = await seedIfEmpty();
    console.log(seeded ? "База очищена и наполнена заново." : "Не удалось засеять базу.");
  } else {
    console.log("Миграции применены, данные на месте.");
  }
  const [{ count }] = (await db.execute<{ count: string }>(sql`select count(*)::text as count from products`)).rows;
  console.log(`Товаров в базе: ${count}`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
