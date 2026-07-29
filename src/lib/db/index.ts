import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Initialize Postgres client for Supabase
// SUPABASE_URL must be set in .env.local (transaction pooler recommended)
const sql = postgres(process.env.SUPABASE_URL!, { prepare: false });

// Initialize Drizzle ORM
export const db = drizzle({ client: sql });
