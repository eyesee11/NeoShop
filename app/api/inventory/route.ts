import { NextRequest, NextResponse } from "next/server";
import { getInventoryStats, getLowStockProducts } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication
    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getInventoryStats();
    const lowStockProducts = await getLowStockProducts(10);

    return NextResponse.json({
      stats,
      lowStockProducts,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}

// Disable caching for this route to ensure always-fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;
