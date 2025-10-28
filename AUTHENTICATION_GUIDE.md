# 🔐 Authentication & Payment System Guide

## Overview

This NeoShop e-commerce application now includes a complete authentication and payment system with a beautiful neo-brutalist design.

## 🎯 Features Implemented

### 1. **User Authentication**

- User registration with validation
- User login with session management
- JWT-like token system (Base64 encoded)
- Persistent sessions via localStorage
- Protected routes for checkout

### 2. **Payment/Checkout Flow**

- Complete checkout page with forms
- Shipping address collection
- Payment details (card validation)
- Order summary with calculations
- Cart integration
- Order placement with authentication

### 3. **UI/UX Enhancements**

- Login/Register page with toggle
- Order success page with confirmation
- Cart counter in header
- User name display when logged in
- Toast notifications for all actions

---

## 📂 File Structure

### Authentication Files

```
app/
  ├── login/
  │   └── page.tsx           # Combined login/register page
  ├── checkout/
  │   └── page.tsx           # Checkout page (protected)
  ├── order-success/
  │   └── page.tsx           # Order confirmation page
  └── api/
      ├── auth/
      │   ├── register/
      │   │   └── route.ts   # POST /api/auth/register
      │   └── login/
      │       └── route.ts   # POST /api/auth/login
      └── orders/
          └── route.ts       # POST/GET /api/orders

components/
  ├── AuthProvider.tsx       # Authentication context
  ├── Header.tsx             # Updated with auth buttons
  └── AddToCartButton.tsx    # Updated with cart events

types/
  ├── auth.ts               # User, LoginCredentials, etc.
  └── order.ts              # Order, CartItem, ShippingAddress
```

---

## 🔑 Authentication System

### How It Works

1. **Registration** (`/api/auth/register`)

   - User provides: email, password, name
   - Password is hashed with Base64 (simple hash for demo)
   - User stored in MongoDB `users` collection
   - Returns: user object + token

2. **Login** (`/api/auth/login`)

   - User provides: email, password
   - Password validated against stored hash
   - Returns: user object + token

3. **Token Format**

   ```
   Base64(userId:timestamp)
   ```

   Example: `MTIzNDU2Nzg5MDoxNzAwMDAwMDAw`

4. **Session Storage**
   - Token and user saved to localStorage
   - AuthProvider reads from localStorage on mount
   - Provides `isAuthenticated`, `user`, `login()`, `register()`, `logout()`

### Usage in Components

```tsx
import { useAuth } from "@/components/AuthProvider";

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <p>Please login</p>;
  }

  return <p>Welcome, {user?.name}!</p>;
}
```

---

## 🛒 Checkout Flow

### Step-by-Step Process

1. **Add to Cart**

   - User clicks "Add to Cart" on product page
   - Product saved to localStorage as `{ productId, quantity }`
   - Cart count updates in header

2. **Navigate to Checkout** (`/checkout`)

   - User clicks "Cart" button in header
   - If not logged in → redirects to `/login?redirect=/checkout`
   - If logged in → shows checkout page

3. **Fill Forms**

   - **Shipping Address**: 7 required fields

     - Full Name
     - Street Address
     - City
     - State/Province
     - ZIP/Postal Code
     - Country
     - Phone Number

   - **Payment Details**: 4 required fields
     - Card Number (16 digits, auto-formatted)
     - Cardholder Name
     - Expiry Date (MM/YY format)
     - CVV (3 digits)

4. **Order Summary** (Sidebar)

   - Lists all cart items with images
   - Shows: Subtotal, Tax (8%), Shipping ($9.99 or FREE over $100)
   - Displays total

5. **Place Order**
   - Validates all form fields
   - Sends POST to `/api/orders` with Bearer token
   - Order stored in MongoDB `orders` collection
   - Cart cleared from localStorage
   - Redirects to `/order-success?orderId=xxx`

### API Endpoints

#### POST `/api/orders`

Creates a new order for authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "items": [
    {
      "productId": "1",
      "productName": "Product Name",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "555-1234"
  },
  "paymentDetails": {
    "cardNumber": "1234567890123456",
    "cardName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  },
  "totalAmount": 299.99
}
```

**Response:**

```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "message": "Order placed successfully"
}
```

#### GET `/api/orders`

Retrieves all orders for authenticated user.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "123",
      "items": [...],
      "shippingAddress": {...},
      "totalAmount": 299.99,
      "status": "pending",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

---

## 🎨 UI Components

### Login/Register Page (`/login`)

- **Toggle between modes**: Login ⇄ Register
- **Login form**: Email, Password
- **Register form**: Name, Email, Password, Confirm Password
- **Features**:
  - Password validation (min 6 chars)
  - Confirm password matching
  - Loading states
  - Toast notifications
  - Redirect support (e.g., `/login?redirect=/checkout`)

### Checkout Page (`/checkout`)

- **Protected route**: Redirects to login if not authenticated
- **Three sections**:
  1. Shipping Address Form (left)
  2. Payment Details Form (left)
  3. Order Summary (right, sticky)
- **Features**:
  - Card number auto-formatting (spaces every 4 digits)
  - Expiry date MM/YY formatting
  - CVV validation (3 digits)
  - Free shipping over $100
  - Real-time total calculation
  - Loading states during order placement

### Order Success Page (`/order-success`)

- **Celebration UI**: Large emoji, gradient background
- **Shows**: Order ID, Status, Email
- **What's Next section**: 4-step explanation
- **Action buttons**: Continue Shopping, View Orders
- **Support info**: Contact email

### Updated Header

- **Cart button**: Shows item count badge
- **Auth section**:
  - If logged in: Shows user name + Logout button
  - If not logged in: Shows Login button
- **Real-time updates**: Cart count updates on add/remove

---

## 🗄️ Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  id: string,              // UUID
  email: string,           // Unique
  name: string,
  password: string,        // Base64 hashed
  createdAt: Date,
  address?: string
}
```

### Orders Collection

```typescript
{
  _id: ObjectId,
  userId: string,          // References User.id
  items: [
    {
      productId: string,
      productName: string,
      price: number,
      quantity: number
    }
  ],
  shippingAddress: {
    fullName: string,
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    phone: string
  },
  paymentDetails: {
    cardNumber: string,    // Last 4 digits only in production!
    cardName: string,
    expiryDate: string,
    cvv: string            // Should NOT be stored in production!
  },
  totalAmount: number,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  createdAt: Date
}
```

⚠️ **Security Note**: In production:

- Use bcrypt for password hashing (not Base64)
- Use proper JWT tokens with secret keys
- Never store full card numbers or CVVs
- Use payment gateway APIs (Stripe, PayPal)
- Implement HTTPS only
- Add CSRF protection
- Add rate limiting

---

## 🧪 Testing the Flow

### 1. Register a New User

1. Navigate to `/login`
2. Click "Register" tab
3. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm: test123
4. Click "Create Account"
5. Should redirect to home, see name in header

### 2. Add Products to Cart

1. Browse products on homepage
2. Click product to view details
3. Click "Add to Cart" button
4. See toast notification
5. Notice cart count in header updates

### 3. Complete Checkout

1. Click "Cart" in header
2. Review cart items and total
3. Fill shipping address (all 7 fields)
4. Fill payment details:
   - Card: 4111 1111 1111 1111 (or any 16 digits)
   - Name: Test User
   - Expiry: 12/25
   - CVV: 123
5. Click "Place Order & Pay"
6. Should see success toast and redirect to order success

### 4. View Order Confirmation

1. On `/order-success` page
2. See order ID in query params
3. See confirmation message
4. Click "View My Orders" → goes to dashboard
5. Click "Continue Shopping" → goes to home

### 5. Logout and Login

1. Click "Logout" in header
2. Should clear session and show "Login" button
3. Click "Login"
4. Fill email and password
5. Should log in and restore session

---

## 🔧 Configuration

### Environment Variables (`.env.local`)

```bash
MONGODB_URI=mongodb+srv://...
ADMIN_API_KEY=your-admin-key
REVALIDATION_SECRET=your-revalidation-secret
```

### localStorage Keys

- `cart`: Array of `{ productId, quantity }`
- `user`: User object `{ id, email, name, ... }`
- `authToken`: Base64 encoded token
- `wishlist`: Array of full Product objects

---

## 🚀 Next Steps (Optional Enhancements)

1. **Security Improvements**

   - Replace Base64 with bcrypt
   - Implement proper JWT with refresh tokens
   - Add HTTPS-only cookies
   - Integrate Stripe or PayPal

2. **Features**

   - Order tracking page
   - Order history with filters
   - Email notifications (SendGrid/Mailgun)
   - Password reset flow
   - User profile page
   - Address book (save multiple addresses)

3. **UX Enhancements**

   - Save card for future purchases (tokenized)
   - Guest checkout option
   - Wishlist → Add to Cart
   - Product reviews and ratings
   - Related products recommendations

4. **Admin Features**
   - View all orders
   - Update order status
   - User management
   - Sales analytics

---

## 📝 Summary

✅ **Complete authentication system** with register/login
✅ **Full checkout flow** with cart, forms, validation
✅ **Order management** with MongoDB storage
✅ **Beautiful UI** with neo-brutalist design
✅ **Toast notifications** for all user actions
✅ **Protected routes** requiring authentication
✅ **Cart management** with localStorage
✅ **Responsive design** for all screen sizes

The app is now a fully functional e-commerce platform with user accounts, shopping cart, and secure checkout! 🎉
