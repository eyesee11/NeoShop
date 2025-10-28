import { Product } from "@/types/product";
import { getDatabase } from "./mongodb";

const COLLECTION_NAME = "products";

export async function readProducts(): Promise<Product[]> {
  try {
    const db = await getDatabase();
    const products = await db
      .collection<Product>(COLLECTION_NAME)
      .find({})
      .toArray();

    // Convert MongoDB _id to string id if needed
    return products.map((p) => ({
      ...p,
      id: p.id || (p as any)._id?.toString(),
    }));
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  try {
    const db = await getDatabase();
    const product = await db
      .collection<Product>(COLLECTION_NAME)
      .findOne({ slug });

    if (!product) return undefined;

    return {
      ...product,
      id: product.id || (product as any)._id?.toString(),
    };
  } catch (error) {
    console.error("Error getting product by slug:", error);
    return undefined;
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const db = await getDatabase();
    const product = await db
      .collection<Product>(COLLECTION_NAME)
      .findOne({ id });

    if (!product) return undefined;

    return {
      ...product,
      id: product.id || (product as any)._id?.toString(),
    };
  } catch (error) {
    console.error("Error getting product by id:", error);
    return undefined;
  }
}

export async function addProduct(product: Product): Promise<Product> {
  try {
    const db = await getDatabase();
    await db.collection<Product>(COLLECTION_NAME).insertOne(product as any);
    return product;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  try {
    const db = await getDatabase();
    const updateData = {
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    const result = await db
      .collection<Product>(COLLECTION_NAME)
      .findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) return null;

    return {
      ...result,
      id: result.id || (result as any)._id?.toString(),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

export async function getLowStockProducts(
  threshold: number = 10
): Promise<Product[]> {
  try {
    const db = await getDatabase();
    const products = await db
      .collection<Product>(COLLECTION_NAME)
      .find({ inventory: { $lt: threshold } })
      .toArray();

    return products.map((p) => ({
      ...p,
      id: p.id || (p as any)._id?.toString(),
    }));
  } catch (error) {
    console.error("Error getting low stock products:", error);
    return [];
  }
}

export async function getInventoryStats() {
  try {
    const db = await getDatabase();
    const products = await db
      .collection<Product>(COLLECTION_NAME)
      .find({})
      .toArray();

    return {
      total: products.length,
      lowStock: products.filter((p) => p.inventory < 10).length,
      outOfStock: products.filter((p) => p.inventory === 0).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.inventory, 0),
    };
  } catch (error) {
    console.error("Error getting inventory stats:", error);
    return {
      total: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
    };
  }
}
