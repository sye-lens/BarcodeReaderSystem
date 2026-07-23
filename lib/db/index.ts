import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Supabase の pooler 経由では prepared statement が使えないため prepare: false。
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

// v1 では db.query.* を使う場合のみ relations を渡す。
// MVP はクエリビルダ(db.select().from(table)) で読むため schema/relations は未指定。
export const db = drizzle({ client });
