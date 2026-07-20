"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function savePreprocessData(dataFilter: any[]) {
  if (!dataFilter || dataFilter.length === 0) return { success: true };

  try {
    // Ensure the preprocess table exists
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS preprocess (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // Insert the dataFilter array as JSON
    const id = randomUUID();
    const dataJson = JSON.stringify(dataFilter);

    await db.execute(sql`
      INSERT INTO preprocess (id, data)
      VALUES (${id}, ${dataJson}::jsonb)
    `);

    return { success: true };
  } catch (error) {
    console.error("Failed to save preprocess data", error);
    return { success: false, error: "Failed to save preprocess data" };
  }
}
