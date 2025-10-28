# 🧪 Test Suite

Unit tests for NeoShop E-commerce API endpoints.

**Author**: Ayush Chauhan  
**Date**: October 29, 2025

## 📁 Test Structure

```
tests/
├── api/
│   ├── products.test.ts     # Tests for product endpoints
│   ├── auth.test.ts         # Tests for authentication
│   ├── orders.test.ts       # Tests for order management
│   ├── inventory.test.ts    # Tests for inventory stats
│   └── revalidate.test.ts   # Tests for ISR revalidation
├── setup.ts                 # Test configuration and helpers
└── README.md                # This file
```

## 🚀 Running Tests

### Install Testing Dependencies

```bash
npm install -D vitest @vitest/ui
```

### Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### Run Tests

```bash
# run all tests
npm test

# run tests in watch mode
npm test -- --watch

# run tests with UI
npm run test:ui

# run specific test file
npm test products.test.ts

# run tests with coverage
npm run test:coverage
```

## 📊 Test Coverage

### API Endpoints Tested

- ✅ **Products API**

  - GET /api/products
  - GET /api/products/[slug]
  - POST /api/products
  - PUT /api/products/update/[id]

- ✅ **Authentication API**

  - POST /api/auth/register
  - POST /api/auth/login

- ✅ **Orders API**

  - POST /api/orders
  - GET /api/orders

- ✅ **Inventory API**

  - GET /api/inventory

- ✅ **Revalidation API**
  - POST /api/revalidate

## 🧩 Test Categories

### 1. Data Validation Tests

- Field presence checks
- Data type validation
- Format validation (email, slug, etc.)
- Range validation (positive numbers, etc.)

### 2. Business Logic Tests

- Price calculations
- Inventory management
- Order total computation
- Tax and shipping calculations

### 3. Security Tests

- API key validation
- Authentication token checks
- Authorization verification

### 4. Edge Cases

- Empty inputs
- Invalid data
- Boundary conditions
- Error scenarios

## 📝 Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect } from "vitest";

describe("Feature Name", () => {
  it("should do something specific", () => {
    // arrange
    const input = "test data";

    // act
    const result = processInput(input);

    // assert
    expect(result).toBeDefined();
  });
});
```

### Best Practices

1. **Descriptive test names**: Use clear, specific descriptions
2. **One assertion per test**: Keep tests focused
3. **AAA pattern**: Arrange, Act, Assert
4. **Mock external dependencies**: Keep tests isolated
5. **Test edge cases**: Don't just test happy paths

## 🔧 Test Utilities

### Setup Helpers

Located in `setup.ts`:

- `createMockProduct()` - Generate mock product data
- `createMockUser()` - Generate mock user data
- `createMockOrder()` - Generate mock order data
- `mockFetch()` - Mock fetch responses

### Usage Example

```typescript
import { createMockProduct } from "../setup";

it("should process product", () => {
  const product = createMockProduct({
    price: 199.99,
  });

  expect(product.price).toBe(199.99);
});
```

## 📈 Current Test Statistics

- **Total Test Files**: 5
- **Test Categories**:
  - Products: ~20 tests
  - Auth: ~15 tests
  - Orders: ~25 tests
  - Inventory: ~15 tests
  - Revalidation: ~10 tests
- **Total Tests**: ~85 tests

## 🐛 Known Limitations

These are **unit tests** that validate logic and data structures. They don't:

- Make actual HTTP requests
- Connect to real databases
- Test UI components
- Perform integration testing

For full integration testing, consider adding:

- Supertest for API testing
- Playwright for E2E testing
- React Testing Library for component tests

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

---

**Note**: These tests validate business logic and data structures. For production, implement integration tests with actual database connections and API calls.
