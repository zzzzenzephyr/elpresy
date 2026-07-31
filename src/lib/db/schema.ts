import { pgTable, text, timestamp, real, jsonb } from "drizzle-orm/pg-core";

// Existing firebase table representation
export const firebase = pgTable("firebase", {
  id: text("id").primaryKey(),
  current: real("current"),
  voltage: real("voltage"),
  powerWatt: real("power_watt"),
  lastUpdated: text("last_updated"),
  createdAt: text("createdAt"),
});

// New preprocess table to store manually uploaded dataFilter state
export const preprocess = pgTable("preprocess", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const predict = pgTable("predict", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evaluation = pgTable("evaluation", {
  id: text("id").primaryKey(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
