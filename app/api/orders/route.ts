import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { Order } from "@/types/order";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Decode token to get user ID (simplified)
    let userId: string;
    try {
      const decoded = Buffer.from(token, "base64").toString();
      userId = decoded.split(":")[0];
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const orderData = await request.json();

    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!orderData.shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Shipping address is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>("orders");

    // Create order
    const order: Order = {
      id: `ORD-${Date.now()}`,
      userId,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentMethod: orderData.paymentMethod || "credit_card",
    };

    await ordersCollection.insertOne(order as any);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully!",
        order: {
          id: order.id,
          total: order.total,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get user's orders
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = Buffer.from(token, "base64").toString();
      userId = decoded.split(":")[0];
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const ordersCollection = db.collection<Order>("orders");

    const orders = await ordersCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
