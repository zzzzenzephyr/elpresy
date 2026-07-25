"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import type { FirebaseData } from "@/script/app/firebase/types";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export async function recordFirebaseData(records: FirebaseData[]) {
  if (!records || records.length === 0) return { success: true };

  try {
    for (const record of records) {
      const id = randomUUID();
      // Only inserting existing columns found in table structure
      await db.execute(sql`
        INSERT INTO firebase (id, current, voltage, power_watt, last_updated, "createdAt")
        VALUES (
          ${id}, 
          ${record.current || 0}, 
          ${record.voltage || 0}, 
          ${record.power_watt || 0}, 
          ${String(record.last_updated || "0")},
          ${record.createdAt || new Date().toISOString()}
        )
      `);
    }
    revalidatePath("/[locale]/(shell)/firebase", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to record firebase data", error);
    return { success: false, error: "Failed to save records" };
  }
}
