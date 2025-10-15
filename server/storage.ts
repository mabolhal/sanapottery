import { type Product, type InsertProduct, type UpdateProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    
    // Seed with initial products
    this.seedProducts();
  }

  private async seedProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        nameEn: "Rustic Terracotta Bowl",
        nameFr: "Bol en Terre Cuite Rustique",
        descriptionEn: "A handcrafted terracotta bowl with organic texture and warm earth tones. Perfect for serving salads or displaying fruit.",
        descriptionFr: "Un bol en terre cuite fait main avec une texture organique et des tons chauds de terre. Parfait pour servir des salades ou présenter des fruits.",
        price: "45.00",
        category: "bowls",
        imageUrl: "/assets/vase.png",
        imageUrls: ["/assets/vase.png"],
        inStock: true,
        featured: true,
        dimensions: "20cm diameter x 8cm height",
        materials: "Terracotta clay, natural glaze",
        careInstructions: "Hand wash recommended, microwave safe",
      },
      {
        nameEn: "Sage Green Vase",
        nameFr: "Vase Vert Sauge",
        descriptionEn: "An elegant vase in calming sage green tones, hand-thrown and finished with a smooth matte glaze.",
        descriptionFr: "Un vase élégant aux tons vert sauge apaisants, tourné à la main et fini avec un glaçage mat lisse.",
        price: "68.00",
        category: "vases",
        imageUrl: "/assets/vase.png",
        imageUrls: ["/assets/vase.png"],
        inStock: true,
        featured: true,
        dimensions: "15cm diameter x 25cm height",
        materials: "Stoneware clay, matte glaze",
        careInstructions: "Wipe clean with damp cloth",
      },
      {
        nameEn: "Morning Coffee Mug",
        nameFr: "Tasse à Café du Matin",
        descriptionEn: "Start your day with this perfectly sized coffee mug, featuring a comfortable handle and warm glaze.",
        descriptionFr: "Commencez votre journée avec cette tasse à café de taille parfaite, dotée d'une anse confortable et d'un glaçage chaleureux.",
        price: "32.00",
        category: "mugs",
        imageUrl: "/assets/vase.png",
        imageUrls: ["/assets/vase.png"],
        inStock: true,
        featured: false,
        dimensions: "9cm diameter x 10cm height",
        materials: "Stoneware clay",
        careInstructions: "Dishwasher and microwave safe",
      },
      {
        nameEn: "Artisan Dinner Plate",
        nameFr: "Assiette de Dîner Artisanale",
        descriptionEn: "A beautifully crafted dinner plate with subtle variations that make each piece unique.",
        descriptionFr: "Une assiette de dîner magnifiquement conçue avec des variations subtiles qui rendent chaque pièce unique.",
        price: "52.00",
        category: "plates",
        imageUrl: "/assets/vase.png",
        imageUrls: ["/assets/vase.png"],
        inStock: true,
        featured: false,
        dimensions: "27cm diameter",
        materials: "Porcelain, food-safe glaze",
        careInstructions: "Dishwasher safe",
      },
      {
        nameEn: "Minimalist Serving Bowl",
        nameFr: "Bol de Service Minimaliste",
        descriptionEn: "A clean, modern serving bowl with smooth lines and a pristine white finish.",
        descriptionFr: "Un bol de service épuré et moderne avec des lignes lisses et une finition blanche immaculée.",
        price: "58.00",
        category: "bowls",
        imageUrl: "/assets/vase.png",
        imageUrls: ["/assets/vase.png"],
        inStock: true,
        featured: false,
        dimensions: "25cm diameter x 10cm height",
        materials: "Porcelain",
        careInstructions: "Dishwasher and microwave safe",
      },
      {
        nameEn: "Textured Ceramic Vase",
        nameFr: "Vase en Céramique Texturé",
        descriptionEn: "A statement vase featuring intricate hand-carved textures and a natural finish.",
        descriptionFr: "Un vase remarquable présentant des textures complexes sculptées à la main et une finition naturelle.",
        price: "85.00",
        category: "vases",
        imageUrl: "/assets/vase.png",
        imageUrls: ["/assets/vase.png"],
        inStock: false,
        featured: false,
        dimensions: "18cm diameter x 30cm height",
        materials: "Stoneware clay, natural texture",
        careInstructions: "Wipe with soft cloth",
      },
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updateProduct: UpdateProduct): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...updateProduct,
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async addCartItem(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists for this session
    const existing = Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existing) {
      // Update quantity
      existing.quantity += insertItem.quantity;
      this.cartItems.set(existing.id, existing);
      return existing;
    }

    const id = randomUUID();
    const cartItem: CartItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const existing = this.cartItems.get(id);
    if (!existing) return undefined;

    existing.quantity = quantity;
    this.cartItems.set(id, existing);
    return existing;
  }

  async removeCartItem(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const items = await this.getCartItems(sessionId);
    for (const item of items) {
      this.cartItems.delete(item.id);
    }
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const existing = this.orders.get(id);
    if (!existing) return undefined;

    existing.status = status;
    this.orders.set(id, existing);
    return existing;
  }
}

export const storage = new MemStorage();
