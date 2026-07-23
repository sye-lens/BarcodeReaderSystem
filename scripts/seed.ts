import { db } from "../lib/db/index";
import { products, reagentLots } from "../lib/db/schema";
import { seedProducts, seedLots } from "../lib/db/seedData";

// マスタデータは lib/db/seedData.ts に分離。ここは投入処理のみ。
async function main() {
  const insertedProducts = await db
    .insert(products)
    .values(seedProducts)
    .onConflictDoNothing() // 既存GTINはスキップ（冪等）
    .returning();
  console.log(`seeded ${insertedProducts.length} product(s)（既存分はスキップ）`);
  for (const p of insertedProducts) console.log(`  + ${p.gtin} ${p.name}`);

  const insertedLots = await db
    .insert(reagentLots)
    .values(seedLots)
    .onConflictDoNothing() // (gtin, lot_number) 既存はスキップ
    .returning();
  console.log(`seeded ${insertedLots.length} lot(s)（既存分はスキップ）`);

  await db.$client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
