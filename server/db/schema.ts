import { pgTable, text, boolean, decimal, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { type InferModel } from 'drizzle-orm';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  nameEn: text('name_en').notNull(),
  nameFr: text('name_fr').notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionFr: text('description_fr').notNull(),
  price: text('price').notNull(), // Using text for now to match existing schema
  category: text('category').notNull(),
  inStock: boolean('in_stock').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  imageUrl: text('image_url').notNull(),
  imageUrls: text('image_urls').array().notNull(),
  dimensions: text('dimensions'),
  materials: text('materials'),
  careInstructions: text('care_instructions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: text('session_id').notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone'),
  shippingAddress: text('shipping_address').notNull(),
  shippingCity: text('shipping_city').notNull(),
  shippingPostalCode: text('shipping_postal_code').notNull(),
  shippingCountry: text('shipping_country').notNull(),
  total: text('total').notNull(),
  status: text('status').notNull().default('pending'),
  items: text('items').notNull(), // Storing as JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Database types
export type DbProduct = InferModel<typeof products>;
export type DbCartItem = InferModel<typeof cartItems>;
export type DbOrder = InferModel<typeof orders>;

// API types that match the shared schema
export type Product = DbProduct;
export type CartItem = DbCartItem;
export type Order = Omit<DbOrder, 'items'> & { items: any[] };