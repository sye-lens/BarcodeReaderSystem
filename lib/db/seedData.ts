import { products, reagentLots } from "./schema";

type ProductSeed = typeof products.$inferInsert;
type LotSeed = typeof reagentLots.$inferInsert;

// 商品マスタ（デモ用）。
// 実物バーコードから得た GTIN をここに追記して `pnpm db:seed` を再実行する。
// （スキャンで未登録GTINは 404 応答に gtin が入るので、それをコピーして追加する）
export const seedProducts = [
  // 手元にテスト用GS1文字列でE2E確認するための既知GTIN
  {
    gtin: "23456789012345",
    name: "デモ試薬A",
    manufacturer: "デモ社",
    category: "生化学",
  },
  // --- 閲覧デモ用ダミー（スキャン照合はできない。実物GTINは明日追記する）---
  {
    gtin: "04987000000017",
    name: "グルコース測定試薬",
    manufacturer: "サンプル製薬",
    category: "生化学",
  },
  {
    gtin: "04987000000024",
    name: "HbA1c測定試薬",
    manufacturer: "サンプル製薬",
    category: "免疫",
  },
  {
    gtin: "04987000000031",
    name: "CRPラテックス試薬",
    manufacturer: "テスト診断",
    category: "免疫",
  },
] satisfies ProductSeed[];

// ダミー商品にひもづく閲覧デモ用サンプルロット（ドリルダウンを賑やかに見せる用）。
export const seedLots = [
  {
    gtin: "04987000000017",
    lot_number: "GL2601",
    expiry_date: "2026-12-31",
    opened_at: "2026-07-01",
    status: "in_use",
  },
  {
    gtin: "04987000000017",
    lot_number: "GL2602",
    expiry_date: "2027-03-31",
    opened_at: "2026-07-15",
    status: "in_use",
  },
  {
    gtin: "04987000000024",
    lot_number: "HB2603",
    expiry_date: "2027-01-31",
    opened_at: "2026-07-10",
    status: "in_use",
  },
  {
    gtin: "04987000000031",
    lot_number: "CRP2605",
    expiry_date: "2026-11-30",
    opened_at: "2026-07-05",
    status: "in_use",
  },
] satisfies LotSeed[];
