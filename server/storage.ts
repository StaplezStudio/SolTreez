import { users, merkleTrees, treeConfigurations, type User, type InsertUser, type MerkleTree, type InsertMerkleTree, type TreeConfiguration, type InsertTreeConfiguration } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

// No storage interface needed - all data handled client-side

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createMerkleTree(insertTree: InsertMerkleTree): Promise<MerkleTree> {
    const [tree] = await db
      .insert(merkleTrees)
      .values({
        ...insertTree,
        status: insertTree.status || "pending",
        transactionSignature: insertTree.transactionSignature || null,
      })
      .returning();
    return tree;
  }

  async getMerkleTrees(): Promise<MerkleTree[]> {
    return await db.select().from(merkleTrees).orderBy(merkleTrees.createdAt);
  }

  async getMerkleTree(id: number): Promise<MerkleTree | undefined> {
    const [tree] = await db.select().from(merkleTrees).where(eq(merkleTrees.id, id));
    return tree || undefined;
  }

  async updateMerkleTreeStatus(id: number, status: string, transactionSignature?: string): Promise<MerkleTree | undefined> {
    const [tree] = await db
      .update(merkleTrees)
      .set({
        status,
        ...(transactionSignature && { transactionSignature }),
      })
      .where(eq(merkleTrees.id, id))
      .returning();
    return tree || undefined;
  }

  async deleteMerkleTree(id: number): Promise<boolean> {
    const result = await db.delete(merkleTrees).where(eq(merkleTrees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearAllData(): Promise<void> {
    await db.delete(merkleTrees);
    await db.delete(treeConfigurations);
    await db.delete(users);
  }

  // Tree configuration methods
  async createTreeConfiguration(insertConfig: InsertTreeConfiguration): Promise<TreeConfiguration> {
    // If this is set as default, unset all other defaults first
    if (insertConfig.isDefault) {
      await db.update(treeConfigurations)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(treeConfigurations.isDefault, true));
    }

    const [config] = await db
      .insert(treeConfigurations)
      .values(insertConfig)
      .returning();
    return config;
  }

  async getTreeConfigurations(): Promise<TreeConfiguration[]> {
    return await db.select().from(treeConfigurations).orderBy(treeConfigurations.createdAt);
  }

  async getTreeConfiguration(id: number): Promise<TreeConfiguration | undefined> {
    const [config] = await db.select().from(treeConfigurations).where(eq(treeConfigurations.id, id));
    return config || undefined;
  }

  async updateTreeConfiguration(id: number, updateData: Partial<InsertTreeConfiguration>): Promise<TreeConfiguration | undefined> {
    // If this is set as default, unset all other defaults first
    if (updateData.isDefault) {
      await db.update(treeConfigurations)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(treeConfigurations.isDefault, true));
    }

    const [config] = await db
      .update(treeConfigurations)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(treeConfigurations.id, id))
      .returning();
    return config || undefined;
  }

  async deleteTreeConfiguration(id: number): Promise<boolean> {
    const result = await db.delete(treeConfigurations).where(eq(treeConfigurations.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async setDefaultConfiguration(id: number): Promise<boolean> {
    // Unset all defaults first
    await db.update(treeConfigurations)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(treeConfigurations.isDefault, true));

    // Set the new default
    const result = await db
      .update(treeConfigurations)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(eq(treeConfigurations.id, id));
    
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
