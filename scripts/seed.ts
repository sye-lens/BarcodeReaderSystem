import { db } from "../lib/db/index";
import { products } from "../lib/db/schema";

// デモ用の商品マスタ。実物バーコードから得た GTIN をここに追記して再実行する。
// （スキャンで未登録GTINは 404 応答に gtin が入るので、それをコピーして追加する）
const seedProducts = [
  // 手元にテスト用GS1文字列でE2E確認するための既知GTIN
  {
    gtin: "23456789012345",
    name: "デモ試薬A",
    manufacturer: "デモ社",
    category: "生化学",
  },
  // 例) 実物を読んだら以下のように追記:
  // { gtin: "04987... ", name: "○○試薬", manufacturer: "△△製薬", category: "免疫" },
];

async function main() {
  const inserted = await db
    .insert(products)
    .values(seedProducts)
    .onConflictDoNothing() // 既存GTINはスキップ（冪等）
    .returning();

  console.log(`seeded ${inserted.length} product(s)（既存分はスキップ）`);
  for (const p of inserted) console.log(`  + ${p.gtin} ${p.name}`);

  await db.$client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
