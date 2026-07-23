import { db } from "../lib/db/index";
import { reagentLots, usageRecords } from "../lib/db/schema";

// デモ前のクリーンアップ用: ロット記録を全削除する（商品マスタは残す）。
// usage_records は reagent_lots を参照するので先に消す。
async function main() {
  await db.delete(usageRecords);
  const deleted = await db.delete(reagentLots).returning();
  console.log(`deleted ${deleted.length} lot(s)（productsは保持）`);
  await db.$client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
