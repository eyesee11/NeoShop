import { NextRequest, NextResponse } from "next/server";
import { readProducts, addProduct } from "@/lib/db";
import { Product } from "@/types/product";

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, inventory, image } = body;

    // Validate required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      inventory === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug and ID
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const products = await readProducts();
    const id = (
      Math.max(...products.map((p) => parseInt(p.id)), 0) + 1
    ).toString();

    const newProduct: Product = {
      id,
      name,
      slug,
      description,
      price: parseFloat(price),
      category,
      inventory: parseInt(inventory),
      lastUpdated: new Date().toISOString(),
      image: image || undefined,
    };

    const product = await addProduct(newProduct);

    // Trigger revalidation for the home page and product page
    const revalidateUrl = `${request.nextUrl.origin}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&path=/`;
    await fetch(revalidateUrl);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
