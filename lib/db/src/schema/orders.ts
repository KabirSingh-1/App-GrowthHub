import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { appsTable } from "./apps";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  appId: integer("app_id").notNull().references(() => appsTable.id, { onDelete: "cascade" }),
  serviceType: text("service_type").notNull(),
  status: text("status").notNull().default("pending"),
  country: text("country"),
  quantity: integer("quantity"),
  amount: real("amount").notNull().default(0),
  keywords: text("keywords"),
  videoType: text("video_type"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
