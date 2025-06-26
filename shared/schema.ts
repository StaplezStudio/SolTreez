import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const merkleTrees = pgTable("merkle_trees", {
  id: serial("id").primaryKey(),
  treeAddress: text("tree_address").notNull().unique(),
  network: text("network").notNull(),
  canopyDepth: integer("canopy_depth").notNull(),
  maxDepth: integer("max_depth").notNull(),
  maxBufferSize: integer("max_buffer_size").notNull(),
  transactionSignature: text("transaction_signature"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const treeConfigurations = pgTable("tree_configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  canopyDepth: integer("canopy_depth").notNull(),
  maxDepth: integer("max_depth").notNull(),
  maxBufferSize: integer("max_buffer_size").notNull(),
  network: text("network").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMerkleTreeSchema = createInsertSchema(merkleTrees).omit({
  id: true,
  createdAt: true,
});

export const insertTreeConfigurationSchema = createInsertSchema(treeConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const merkleTreeParamsSchema = z.object({
  canopyDepth: z.number().min(0).max(20), // UI and docs say 0-17, schema allows up to 20
  maxDepth: z.number().min(5).max(30),    // Consistent with safety requirement (min 5)
  maxBufferSize: z.number().min(8).max(2048),
  network: z.enum(["devnet", "mainnet-beta"]),
  rpcEndpoint: z.string().url().optional(),
});

export const treeConfigurationSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  canopyDepth: z.number().min(0).max(30), // UI/docs say 0-17, schema allows up to 30
  maxDepth: z.number().min(5).max(30),
  maxBufferSize: z.number().min(8).max(2048),
  network: z.enum(["devnet", "mainnet-beta"]),
  isDefault: z.boolean().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MerkleTree = typeof merkleTrees.$inferSelect;
export type InsertMerkleTree = z.infer<typeof insertMerkleTreeSchema>;
export type MerkleTreeParams = z.infer<typeof merkleTreeParamsSchema>;
export type TreeConfiguration = typeof treeConfigurations.$inferSelect;
export type InsertTreeConfiguration = z.infer<typeof insertTreeConfigurationSchema>;
