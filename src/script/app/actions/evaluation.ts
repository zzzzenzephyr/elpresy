"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function fetchPredictDataList() {
  try {
    const result = await db.execute(sql`
      SELECT id, created_at 
      FROM predict 
      ORDER BY created_at DESC
    `);
    
    return { success: true, data: result as any };
  } catch (error) {
    console.error("Failed to fetch predict data list", error);
    return { success: false, error: "Failed to fetch predict data list" };
  }
}

export async function fetchPredictDataById(id: string) {
  try {
    const result = await db.execute(sql`
      SELECT data 
      FROM predict 
      WHERE id = ${id}
    `);
    
    if (result.length === 0) {
      return { success: false, error: "Data not found" };
    }
    
    return { success: true, data: (result[0] as any).data };
  } catch (error) {
    console.error("Failed to fetch predict data by id", error);
    return { success: false, error: "Failed to fetch predict data by id" };
  }
}

export async function saveEvaluationData(evalData: any) {
  if (!evalData) return { success: true };

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS evaluation (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    const id = randomUUID();
    const dataJson = JSON.stringify(evalData);

    await db.execute(sql`
      INSERT INTO evaluation (id, data)
      VALUES (${id}, ${dataJson}::jsonb)
    `);

    return { success: true, id };
  } catch (error) {
    console.error("Failed to save evaluation data", error);
    return { success: false, error: "Failed to save evaluation data" };
  }
}
