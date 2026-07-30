'use server';

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

// Helper function to retry DB calls on failure (e.g. Supabase cold start / connection issues)
// Exact same method as used in firebase/page.tsx
async function fetchWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delayMs = 1500
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`DB connection failed, retrying in ${delayMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetchWithRetry(operation, retries - 1, Math.round(delayMs * 1.5));
    }
    throw error;
  }
}

export async function fetchFirebaseData() {
  try {
    const result = await fetchWithRetry(() => db.execute(sql`SELECT * FROM firebase`));
    return result.map((row: any) => ({
      ...row,
      createdAt: row.createdAt || row.createdat
    })) as any[];
  } catch (error) {
    console.error("Final Supabase Database Error after retries:", error);
    return [];
  }
}

export async function fetchPreprocessData() {
  try {
    const result = await fetchWithRetry(() => db.execute(sql`SELECT * FROM preprocess`));
    return result.map((row: any) => ({
      ...row,
      createdAt: row.createdAt || row.created_at || row.createdat
    })) as any[];
  } catch (error) {
    console.error("Final Supabase Database Error after retries:", error);
    return [];
  }
}
