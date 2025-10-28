import { NextRequest, NextResponse } from "next/server";
import { getProductById, updateProduct } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined) updates.price = parseFloat(body.price);
    if (body.category !== undefined) updates.category = body.category;
    if (body.inventory !== undefined)
      updates.inventory = parseInt(body.inventory);
    if (body.image !== undefined) updates.image = body.image;

    const updatedProduct = await updateProduct(id, updates);

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }

    // Trigger on-demand revalidation for the product page
    try {
      const revalidateUrl = `${request.nextUrl.origin}/api/revalidate?secret=${process.env.REVALIDATION_SECRET}&path=/products/${updatedProduct.slug}`;
      await fetch(revalidateUrl);
    } catch (error) {
      console.error("Failed to trigger revalidation:", error);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
