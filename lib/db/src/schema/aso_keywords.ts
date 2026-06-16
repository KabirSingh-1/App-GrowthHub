import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { appsTable } from "./apps";

export const asoKeywordsTable = pgTable("aso_keywords", {
  id: serial("id").primaryKey(),
  appId: integer("app_id").notNull().references(() => appsTable.id, { onDelete: "cascade" }),
  keyword: text("keyword").notNull(),
  rank: integer("rank"),
  volume: integer("volume").notNull().default(0),
  difficulty: integer("difficulty").notNull().default(0),
  traffic: integer("traffic").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAsoKeywordSchema = createInsertSchema(asoKeywordsTable).omit({ id: true, createdAt: true });
export type InsertAsoKeyword = z.infer<typeof insertAsoKeywordSchema>;
export type AsoKeyword = typeof asoKeywordsTable.$inferSelect;
