import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  content: text("content").notNull(),
  mediaUrl: text("mediaUrl"),
  mediaType: text("mediaType"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true,
  timestamp: true 
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;