import * as dotenv from 'dotenv';
dotenv.config();

import { db } from '../db';
import { products } from '../db/schema';
import { type InferInsertModel } from 'drizzle-orm';

type InsertProduct = InferInsertModel<typeof products>;

const seedProducts: InsertProduct[] = [
  {
    nameEn: "Rustic Terracotta Bowl",
    nameFr: "Bol en Terre Cuite Rustique",
    descriptionEn: "A handcrafted terracotta bowl with organic texture and warm earth tones. Perfect for serving salads or displaying fruit.",
    descriptionFr: "Un bol en terre cuite fait main avec une texture organique et des tons chauds de terre. Parfait pour servir des salades ou présenter des fruits.",
    price: "45.00",
    category: "bowls",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    imageUrls: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
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
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    imageUrls: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
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
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    imageUrls: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
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
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    imageUrls: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
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
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    imageUrls: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
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
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800",
    imageUrls: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800"],
    inStock: false,
    featured: false,
    dimensions: "18cm diameter x 30cm height",
    materials: "Stoneware clay, natural texture",
    careInstructions: "Wipe with soft cloth",
  },
];

async function seedDb() {
  try {
    console.log('Seeding products...');
    // Products are already correctly typed with InsertProduct, so we can insert them directly
    const insertedProducts = await db.insert(products).values(seedProducts).returning();
    console.log(`Successfully inserted ${insertedProducts.length} products`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDb().then(() => process.exit(0));