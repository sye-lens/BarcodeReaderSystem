import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { reagentLots } from "./schema";

export type ReagentLot = typeof reagentLots.$inferSelect;

// ある商品(gtin)のロット一覧。新しい登録順で返す。
export async function findLotsByGtin(gtin: string): Promise<ReagentLot[]> {
  return db
    .select()
    .from(reagentLots)
    .where(eq(reagentLots.gtin, gtin))
    .orderBy(desc(reagentLots.created_at));
}

export type NewReagentLotInput = {
  gtin: string;
  lotNumber: string;
  expiryDate: string; // "YYYY-MM-DD"
};

// ロットを登録する。(gtin, lot_number) が既存なら onConflictDoNothing で弾き、
// returning が空になるので null を返す（＝2回目以降の登録）。初回登録日を使用開始日とする。
export async function registerReagentLot(
  input: NewReagentLotInput,
): Promise<ReagentLot | null> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const rows = await db
    .insert(reagentLots)
    .values({
      gtin: input.gtin,
      lot_number: input.lotNumber,
      expiry_date: input.expiryDate,
      opened_at: today,
      status: "in_use",
    })
    .onConflictDoNothing()
    .returning();
  return rows[0] ?? null;
}
