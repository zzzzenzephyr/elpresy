import { pgTable, text, doublePrecision, jsonb, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const firebase = pgTable("firebase", {
	id: text().primaryKey(),
	current: doublePrecision(),
	voltage: doublePrecision(),
	powerWatt: doublePrecision("power_watt"),
	lastUpdated: text("last_updated"),
	createdat: text(),
});

export const preprocess = pgTable("preprocess", {
	id: text().primaryKey(),
	data: jsonb().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const predict = pgTable("predict", {
	id: text().primaryKey(),
	data: jsonb().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const evaluation = pgTable("evaluation", {
	id: text().primaryKey(),
	data: jsonb().notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});
