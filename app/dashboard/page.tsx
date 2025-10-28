"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { useAuth } from "@/components/AuthProvider";
import { Order } from "@/types/order";

interface InventoryStats {
  total: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string>("");

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/inventory", {
        headers: {
          "x-api-key":
            "de06deb2c5f2e50c426382571fb3071b38416cea68e75dd9948b9db16706f856",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
      }

      const data = await response.json();
      setStats(data.stats);
      setLowStockProducts(data.lowStockProducts);
      setTimestamp(data.timestamp);

      // Fetch orders if authenticated
      if (isAuthenticated) {
        const token = localStorage.getItem("authToken");
        if (token) {
          const ordersResponse = await fetch("/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setOrders(ordersData.orders || []);
          }
        }
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-4xl font-black animate-pulse">
            Loading Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="border-4 border-black p-8 bg-red-100">
          <h2 className="text-2xl font-black mb-2">Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-4 border-black p-8 bg-gradient-to-r from-yellow-200 to-orange-200 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black uppercase mb-2">
              Inventory Dashboard
            </h1>
            <p className="text-lg font-bold">
              Real-time product inventory statistics
            </p>
          </div>
          <button
            onClick={fetchInventoryData}
            className="px-6 py-3 border-4 border-black font-bold bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            🔄 Refresh
          </button>
        </div>
        {timestamp && (
          <p className="mt-4 text-sm font-bold">
            Last updated: {new Date(timestamp).toLocaleString()}
          </p>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="border-4 border-black p-6 bg-blue-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-5xl mb-2">📦</div>
            <div className="text-4xl font-black mb-1">{stats.total}</div>
            <div className="text-sm font-bold uppercase">Total Products</div>
          </div>

          <div className="border-4 border-black p-6 bg-yellow-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-5xl mb-2">⚠️</div>
            <div className="text-4xl font-black mb-1">{stats.lowStock}</div>
            <div className="text-sm font-bold uppercase">Low Stock</div>
          </div>

          <div className="border-4 border-black p-6 bg-red-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-5xl mb-2">❌</div>
            <div className="text-4xl font-black mb-1">{stats.outOfStock}</div>
            <div className="text-sm font-bold uppercase">Out of Stock</div>
          </div>

          <div className="border-4 border-black p-6 bg-green-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-5xl mb-2">💰</div>
            <div className="text-4xl font-black mb-1">
              ${stats.totalValue.toFixed(2)}
            </div>
            <div className="text-sm font-bold uppercase">Total Value</div>
          </div>
        </div>
      )}

      <div className="border-4 border-black p-6 bg-white/90 backdrop-blur-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        <h2 className="text-3xl font-black uppercase mb-6">
          ⚠️ Low Stock Alert
        </h2>

        {lowStockProducts.length === 0 ? (
          <p className="text-lg font-bold text-gray-600">
            All products are well-stocked! 🎉
          </p>
        ) : (
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="block border-4 border-black p-4 bg-yellow-50 hover:bg-yellow-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-black">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-black">
                        {product.inventory}
                      </div>
                      <div className="text-xs font-bold uppercase">
                        Units Left
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black">${product.price}</div>
                      <div className="text-xs font-bold uppercase">Price</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-4 border-black bg-green-100/80 backdrop-blur-sm mb-8">
        <p className="text-sm font-bold">
          ℹ️ this page is client-side rendered (CSR) and grabs fresh data on
          every visit for real-time accuracy
        </p>
      </div>

      {isAuthenticated && (
        <div className="border-4 border-black p-6 bg-white/90 backdrop-blur-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-3xl font-black uppercase mb-6">
            📦 My Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg font-bold text-gray-600 mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 border-4 border-black font-bold bg-gradient-to-r from-yellow-300 to-orange-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                🛍️ Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border-4 border-black p-4 bg-blue-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-black">
                        Order #{order._id?.toString().slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 border-4 border-black font-black uppercase ${
                        order.status === "pending"
                          ? "bg-yellow-300"
                          : order.status === "processing"
                          ? "bg-blue-300"
                          : order.status === "shipped"
                          ? "bg-purple-300"
                          : order.status === "delivered"
                          ? "bg-green-300"
                          : "bg-red-300"
                      }`}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="font-bold mb-1">Items:</p>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          • {item.productName} x{item.quantity} - $
                          {(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t-4 border-black pt-3">
                    <div>
                      <p className="text-sm font-bold">Shipping to:</p>
                      <p className="text-sm">
                        {order.shippingAddress.fullName},{" "}
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">Total:</p>
                      <p className="text-2xl font-black">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
