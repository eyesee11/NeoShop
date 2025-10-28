/**
 * Test Setup Configuration
 * Author: Ayush Chauhan
 * Date: October 29, 2025
 */

// setup file for vitest
// this would normally include global test configuration
// mock setup, and test utilities

export const TEST_CONFIG = {
  ADMIN_API_KEY: process.env.ADMIN_API_KEY || "",
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET || "",
  API_BASE_URL: "http://localhost:3000/api",
};

export const mockFetch = (data: unknown, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  });
};

// helper to create mock products
export const createMockProduct = (overrides = {}) => ({
  id: "1",
  name: "Test Product",
  slug: "test-product",
  description: "A test product",
  price: 99.99,
  category: "Test",
  inventory: 10,
  lastUpdated: new Date().toISOString(),
  ...overrides,
});

// helper to create mock user
export const createMockUser = (overrides = {}) => ({
  id: "user123",
  email: "test@example.com",
  name: "Test User",
  ...overrides,
});

// helper to create mock order
export const createMockOrder = (overrides = {}) => ({
  _id: "order123",
  userId: "user123",
  items: [],
  shippingAddress: {
    fullName: "Test User",
    street: "123 Test St",
    city: "Test City",
    state: "TS",
    zipCode: "12345",
    country: "USA",
    phone: "555-0000",
  },
  totalAmount: 99.99,
  status: "pending",
  createdAt: new Date(),
  ...overrides,
});
