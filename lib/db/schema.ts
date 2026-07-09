import { text, date, timestamp, pgTable, unique, uuid } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  gtin: text().primaryKey(),
  name: text().notNull(),
  manufacturer: text(),
  category: text()
});

export const reagentLots = pgTable("reagent_lots", {
  id: uuid().primaryKey().defaultRandom(),
  gtin: text().references(() => products.gtin).notNull(),
  lot_number: text().notNull(),
  expiry_date: date().notNull(),
  status: text(),
  opened_at: date(),
  created_at: timestamp().defaultNow(),
},(t) => [
  unique().on(t.gtin, t.lot_number),
]);

export const usageRecords  = pgTable("usage_records", {
    id: uuid().primaryKey().defaultRandom(),
    lot_id: uuid().references(() => reagentLots.id).notNull(),
    used_at: timestamp().defaultNow(),
    user_id: uuid(),
});
