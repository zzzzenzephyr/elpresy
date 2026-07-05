import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Initialize the Neon serverless connection. 
// DATABASE_URL must be set in .env.local
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle ORM with the Neon HTTP client
export const db = drizzle({ client: sql });
