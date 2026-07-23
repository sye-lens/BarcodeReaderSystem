import { eq } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

export type Product = typeof products.$inferSelect;

// GTINで商品マスタを1件引く。未登録なら undefined。
export async function findProductByGtin(gtin: string): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.gtin, gtin))
    .limit(1);
  return rows[0];
}
