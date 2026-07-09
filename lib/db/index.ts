import { drizzle } from 'drizzle-orm/pg-core';
import * as schema from './schema'; 

export const db = drizzle(process.env.DATABASE_URL!, { schema });

