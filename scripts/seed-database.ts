require("dotenv").config({
  path: require("path").resolve(process.cwd(), ".env.local"),
});

import { getDatabase } from "../lib/mongodb";
import productsData from "../data/products.json";

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seed...");

    const db = await getDatabase();
    const collection = db.collection("products");

    // Check if collection already has data
    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  Collection already has ${existingCount} products.`);
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      await new Promise<void>((resolve) => {
        readline.question(
          "Do you want to clear and reseed? (yes/no): ",
          async (answer: string) => {
            if (answer.toLowerCase() === "yes") {
              await collection.deleteMany({});
              console.log("🗑️  Cleared existing products.");
            }
            readline.close();
            resolve();
          }
        );
      });
    }

    // Insert products
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await collection.insertMany(productsData as any[]);

    console.log(`✅ Successfully seeded ${result.insertedCount} products!`);

    // Create indexes for better performance
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ inventory: 1 });

    console.log("📊 Created indexes for better query performance.");

    // Display seeded products
    console.log("\n📦 Products in database:");
    const products = await collection.find({}).toArray();
    products.forEach((product) => {
      console.log(`  - ${product.name} (${product.slug}) - $${product.price}`);
    });

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
