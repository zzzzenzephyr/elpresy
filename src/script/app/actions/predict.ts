"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function fetchPreprocessDataList() {
  try {
    const result = await db.execute(sql`
      SELECT id, created_at, data 
      FROM preprocess 
      ORDER BY created_at DESC
    `);
    
    return { success: true, data: result as any };
  } catch (error) {
    console.error("Failed to fetch preprocess data list", error);
    return { success: false, error: "Failed to fetch preprocess data list" };
  }
}

export async function fetchPreprocessDataById(id: string) {
  try {
    const result = await db.execute(sql`
      SELECT data 
      FROM preprocess 
      WHERE id = ${id}
    `);
    
    if (result.length === 0) {
      return { success: false, error: "Data not found" };
    }
    
    return { success: true, data: (result[0] as any).data };
  } catch (error) {
    console.error("Failed to fetch preprocess data by id", error);
    return { success: false, error: "Failed to fetch preprocess data by id" };
  }
}

export async function savePredictData(predictData: any[]) {
  if (!predictData || predictData.length === 0) return { success: true };

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS predict (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    const id = randomUUID();
    const dataJson = JSON.stringify(predictData);

    await db.execute(sql`
      INSERT INTO predict (id, data)
      VALUES (${id}, ${dataJson}::jsonb)
    `);

    return { success: true, id };
  } catch (error) {
    console.error("Failed to save predict data", error);
    return { success: false, error: "Failed to save predict data" };
  }
}
