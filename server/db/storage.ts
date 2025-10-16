import { db } from '../db';
import { products, cartItems, orders } from './schema';
import { eq, desc } from 'drizzle-orm';
import { type Product, type InsertProduct, type UpdateProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<void>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

export class DbStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).execute();
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
      .execute();
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products)
      .values({
        ...insertProduct,
        imageUrls: insertProduct.imageUrls || [],
        inStock: insertProduct.inStock ?? true,
        featured: insertProduct.featured ?? false
      })
      .returning();
    return product;
  }

  async updateProduct(id: string, updateProduct: UpdateProduct): Promise<Product | undefined> {
    const [updated] = await db.update(products)
      .set(updateProduct)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products)
      .where(eq(products.id, id))
      .execute();
    return result.rowCount > 0;
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select()
      .from(cartItems)
      .where(eq(cartItems.sessionId, sessionId))
      .execute();
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems)
      .values({
        sessionId: item.sessionId,
        productId: item.productId,
        quantity: item.quantity || 1
      })
      .returning();
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeCartItem(id: string): Promise<boolean> {
    const result = await db.delete(cartItems)
      .where(eq(cartItems.id, id))
      .execute();
    return result.rowCount > 0;
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems)
      .where(eq(cartItems.sessionId, sessionId))
      .execute();
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const dbOrders = await db.select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .execute();
    
    return dbOrders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1)
      .execute();
    
    if (!result[0]) return undefined;
    
    return {
      ...result[0],
      items: JSON.parse(result[0].items)
    };
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders)
      .values({
        ...order,
        status: order.status || 'pending',
        items: JSON.stringify(order.items)
      })
      .returning();
    return {
      ...created,
      items: JSON.parse(created.items)
    };
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }
}