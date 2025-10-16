import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Utility functions for database operations
export async function getProducts() {
  return await db.select().from(schema.products);
}

export async function getProduct(id: string) {
  return await db.select().from(schema.products).where(sql`id = ${id}`).limit(1);
}

export async function createProduct(data: typeof schema.products.$inferInsert) {
  return await db.insert(schema.products).values(data).returning();
}

export async function updateProduct(id: string, data: Partial<typeof schema.products.$inferInsert>) {
  return await db.update(schema.products).set(data).where(sql`id = ${id}`).returning();
}

export async function deleteProduct(id: string) {
  return await db.delete(schema.products).where(sql`id = ${id}`).returning();
}