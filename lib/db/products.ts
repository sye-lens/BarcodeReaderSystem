import { count, eq } from "drizzle-orm";
import { db } from "./index";
import { products, reagentLots } from "./schema";

export type Product = typeof products.$inferSelect;

export type ProductWithLotCount = Product & { lotCount: number };

// 商品一覧（各商品のロット件数付き）。名前順で返す。
export async function findAllProductsWithLotCount(): Promise<
  ProductWithLotCount[]
> {
  return db
    .select({
      gtin: products.gtin,
      name: products.name,
      manufacturer: products.manufacturer,
      category: products.category,
      lotCount: count(reagentLots.id),
    })
    .from(products)
    .leftJoin(reagentLots, eq(reagentLots.gtin, products.gtin))
    .groupBy(products.gtin)
    .orderBy(products.name);
}

// GTINで商品マスタを1件引く。未登録なら undefined。
export async function findProductByGtin(gtin: string): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.gtin, gtin))
    .limit(1);
  return rows[0];
}
