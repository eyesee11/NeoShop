/**
 * Simple Database Seeding Script
 * Run: node scripts/seed.js
 */

require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI not found in .env.local");
  process.exit(1);
}

const productsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
);

async function seedDatabase() {
  let client;

  try {
    console.log("🌱 Connecting to MongoDB...");
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB!");

    const db = client.db("ecom-app");
    const collection = db.collection("products");

    // Check if collection already has data
    const existingCount = await collection.countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  Collection already has ${existingCount} products.`);
      console.log("🗑️  Clearing existing products...");
      await collection.deleteMany({});
    }

    // Insert products
    console.log("📦 Inserting products...");
    const result = await collection.insertMany(productsData);

    console.log(`✅ Successfully seeded ${result.insertedCount} products!`);

    // Create indexes for better performance
    console.log("📊 Creating indexes...");
    await collection.createIndex({ slug: 1 }, { unique: true });
    await collection.createIndex({ id: 1 }, { unique: true });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ inventory: 1 });

    console.log("✅ Indexes created!");

    // Display seeded products
    console.log("\n📦 Products in database:");
    const products = await collection.find({}).toArray();
    products.forEach((product) => {
      console.log(
        `  ✓ ${product.name} (${product.slug}) - $${product.price} - Stock: ${product.inventory}`
      );
    });

    console.log("\n🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("👋 Connection closed");
    }
    process.exit(0);
  }
}

seedDatabase();
