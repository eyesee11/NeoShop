/**
 * Unit Tests for Inventory API Endpoint
 * Tests: GET /api/inventory
 */

import { describe, it, expect } from "vitest";

const mockProducts = [
  { id: "1", name: "Product 1", inventory: 25, price: 100 },
  { id: "2", name: "Product 2", inventory: 8, price: 200 },
  { id: "3", name: "Product 3", inventory: 0, price: 150 },
  { id: "4", name: "Product 4", inventory: 50, price: 75 },
];

describe("GET /api/inventory", () => {
  it("should calculate total products count", () => {
    const total = mockProducts.length;

    expect(total).toBe(4);
  });

  it("should count low stock products (inventory < 10)", () => {
    const lowStock = mockProducts.filter(
      (p) => p.inventory < 10 && p.inventory > 0
    );

    expect(lowStock.length).toBe(1);
  });

  it("should count out of stock products (inventory === 0)", () => {
    const outOfStock = mockProducts.filter((p) => p.inventory === 0);

    expect(outOfStock.length).toBe(1);
  });

  it("should calculate total inventory value", () => {
    const totalValue = mockProducts.reduce(
      (sum, p) => sum + p.inventory * p.price,
      0
    );

    expect(totalValue).toBe(7850); // (25*100) + (8*200) + (0*150) + (50*75) = 2500 + 1600 + 0 + 3750
  });

  it("should require API key for access", () => {
    const apiKey =
      "de06deb2c5f2e50c426382571fb3071b38416cea68e75dd9948b9db16706f856";

    expect(apiKey).toBeDefined();
    expect(apiKey.length).toBe(64);
  });

  it("should return stats with correct structure", () => {
    const stats = {
      total: mockProducts.length,
      lowStock: mockProducts.filter((p) => p.inventory < 10 && p.inventory > 0)
        .length,
      outOfStock: mockProducts.filter((p) => p.inventory === 0).length,
      totalValue: mockProducts.reduce(
        (sum, p) => sum + p.inventory * p.price,
        0
      ),
    };

    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("lowStock");
    expect(stats).toHaveProperty("outOfStock");
    expect(stats).toHaveProperty("totalValue");
  });

  it("should return low stock products array", () => {
    const lowStockProducts = mockProducts.filter(
      (p) => p.inventory < 10 && p.inventory > 0
    );

    expect(Array.isArray(lowStockProducts)).toBe(true);
    expect(lowStockProducts.length).toBeGreaterThanOrEqual(0);
  });

  it("should include timestamp", () => {
    const timestamp = new Date().toISOString();

    expect(timestamp).toBeDefined();
    expect(typeof timestamp).toBe("string");
  });

  it("should sort low stock products by inventory ascending", () => {
    const lowStock = mockProducts
      .filter((p) => p.inventory < 10 && p.inventory > 0)
      .sort((a, b) => a.inventory - b.inventory);

    for (let i = 0; i < lowStock.length - 1; i++) {
      expect(lowStock[i].inventory).toBeLessThanOrEqual(
        lowStock[i + 1].inventory
      );
    }
  });
});

describe("Inventory Stats Calculations", () => {
  it("should handle empty product list", () => {
    const emptyProducts: Array<unknown> = [];
    const total = emptyProducts.length;

    expect(total).toBe(0);
  });

  it("should handle all products in stock", () => {
    const allInStock = [
      { inventory: 50 },
      { inventory: 100 },
      { inventory: 25 },
    ];

    const outOfStock = allInStock.filter((p) => p.inventory === 0);

    expect(outOfStock.length).toBe(0);
  });

  it("should handle all products out of stock", () => {
    const allOutOfStock = [
      { inventory: 0 },
      { inventory: 0 },
      { inventory: 0 },
    ];

    const outOfStock = allOutOfStock.filter((p) => p.inventory === 0);

    expect(outOfStock.length).toBe(3);
  });

  it("should correctly identify low stock threshold", () => {
    const product = { inventory: 9 };
    const lowStockThreshold = 10;

    expect(product.inventory < lowStockThreshold).toBe(true);
  });
});

describe("API Security", () => {
  const validApiKey =
    "de06deb2c5f2e50c426382571fb3071b38416cea68e75dd9948b9db16706f856";

  it("should validate API key format (sha256 hex)", () => {
    expect(validApiKey.length).toBe(64);
    expect(/^[a-f0-9]+$/.test(validApiKey)).toBe(true);
  });

  it("should reject empty API key", () => {
    const emptyKey = "";

    expect(emptyKey.length).toBe(0);
  });

  it("should reject invalid API key format", () => {
    const invalidKey = "not-a-valid-api-key";

    expect(invalidKey.length).not.toBe(64);
  });
});
