# 🛒 NeoShop - Modern E-commerce Application

A comprehensive Next.js 15 e-commerce application showcasing different rendering strategies (SSG, ISR, SSR, CSR) with a unique neo-brutalist design combined with glassmorphism aesthetics.

## 🎯 Project Overview

This project demonstrates a complete e-commerce platform with:

- Multiple Next.js rendering strategies across different pages
- Full-stack implementation with API routes
- Modern UI design (Neo-brutalism + Glassmorphism)
- TypeScript for type safety
- File-bas

## 🚀 Features

### Core Functionality

- ✅ Product catalog with filtering and search
- ✅ Product detail pages with ISR
- ✅ Real-time inventory dashboard
- ✅ Admin panel for product management
- ✅ Recommendations page with Server Components
- ✅ API-based authentication
- ✅ Responsive neo-brutalist design

### Technical Features

- **SSG (Static Site Generation)**: Home page with build-time data fetching
- **ISR (Incremental Static Regeneration)**: Product pages with 60s revalidation
- **SSR (Server-Side Rendering)**: Dashboard with always-fresh data
- **CSR (Client-Side Rendering)**: Admin panel with dynamic updates
- **Server Components**: Recommendations page with hybrid rendering

## 📁 Project Structure

```
ecom-app/
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── [slug]/route.ts      # Get product by slug
│   │   │   ├── update/[id]/route.ts # Update product
│   │   │   └── route.ts             # Get all products, create product
│   │   ├── inventory/route.ts       # Get inventory stats (SSR)
│   │   └── revalidate/route.ts      # On-demand revalidation
│   ├── products/
│   │   └── [slug]/page.tsx          # Product detail (ISR)
│   ├── dashboard/page.tsx           # Inventory dashboard (CSR with SSR API)
│   ├── admin/page.tsx               # Admin panel (CSR)
│   ├── recommendations/page.tsx     # Recommendations (Server Components)
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page (SSG)
│   └── globals.css                  # Global styles
├── components/
│   ├── Header.tsx                   # Navigation header
│   ├── Footer.tsx                   # Footer component
│   ├── ProductCard.tsx              # Product card component
│   ├── ProductList.tsx              # Product list with filtering (Client)
│   ├── SearchBar.tsx                # Search and filter (Client)
│   └── WishlistButton.tsx           # Wishlist button (Client)
├── lib/
│   └── db.ts                        # Database functions
├── types/
│   └── product.ts                   # TypeScript interfaces
├── data/
│   └── products.json                # Product database
├── .env.local                       # Environment variables
└── .env.example                     # Environment variables template
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Navigate to the project directory**

```bash
cd c:\Users\91819\Desktop\ecom-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

The `.env.local` file is already configured with:

```env
ADMIN_API_KEY=super-secret-admin-key-2025
REVALIDATION_SECRET=revalidate-secret-key-2025
```

For production, copy `.env.example` to `.env.local` and update the secrets.

4. **Run the development server**

```bash
npm run dev
```

5. **Run tests** (optional)

```bash
# Run all unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Philosophy

### Neo-Brutalism

- Bold, thick borders (4px black borders everywhere)
- Sharp shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`)
- High contrast color schemes
- Prominent typography (Space Grotesk font)
- Geometric, boxy layouts

### Glassmorphism

- Backdrop blur effects (`backdrop-blur-sm`)
- Semi-transparent backgrounds (`bg-white/80`)
- Layered visual hierarchy
- Soft gradients combined with hard edges

## 📄 Page-by-Page Breakdown

### 1. Home Page (`/`)

**Route**: `/`  
**Rendering**: **Static Site Generation (SSG)**  
**Revalidation**: 60 seconds

**Purpose**: Display all products with client-side filtering and search.

**Why SSG?**

- Content doesn't change frequently
- Optimal performance with pre-rendered HTML
- Excellent for SEO
- Fast initial page load
- Automatic revalidation keeps data fresh

**Data Flow**:

1. `readProducts()` fetches data at build time
2. HTML generated with all products
3. Client components handle filtering/search
4. Page regenerates every 60 seconds automatically

---

### 2. Product Detail Page (`/products/[slug]`)

**Route**: `/products/wireless-bluetooth-headphones`  
**Rendering**: **Incremental Static Regeneration (ISR)**  
**Revalidation**: 60 seconds

**Purpose**: Display detailed product information with up-to-date inventory.

**Why ISR?**

- Pre-generate pages for all products at build time
- Automatically update stale pages every 60 seconds
- Best of both worlds: static performance + fresh data
- Perfect for product pages where price/inventory changes

**Data Flow**:

1. `generateStaticParams()` creates pages for all products at build
2. `getProductBySlug()` fetches product data
3. Page served from cache for 60 seconds
4. After 60s, Next.js regenerates page in background
5. On-demand revalidation triggered via API when product updated

---

### 3. Inventory Dashboard (`/dashboard`)

**Route**: `/dashboard`  
**Rendering**: **Client-Side Rendering (CSR)** + **Server-Side Rendering (API)**

**Purpose**: Display real-time inventory statistics and low-stock alerts.

**Why CSR with SSR API?**

- Data must be absolutely fresh on every request
- Dashboard needs live data for accurate inventory management
- API endpoint uses `dynamic = 'force-dynamic'` to prevent caching
- Refresh button allows manual data updates

**Data Flow**:

1. Page renders on client
2. `useEffect` fetches from `/api/inventory`
3. API reads fresh data from database (SSR, no cache)
4. Stats displayed with timestamps
5. Manual refresh available

---

### 4. Admin Panel (`/admin`)

**Route**: `/admin`  
**Rendering**: **Client-Side Rendering (CSR)**

**Purpose**: Manage product inventory with CRUD operations.

**Why CSR?**

- Highly interactive with forms and real-time updates
- Requires authentication (API key)
- Frequent state changes
- Dynamic content that varies per admin action

**Data Flow**:

1. Client fetches products from `/api/products`
2. Forms submit to protected API routes (POST/PUT)
3. API validates `x-api-key` header
4. Database updated
5. UI refreshed with new data
6. Triggers on-demand revalidation for affected pages

---

### 5. Recommendations Page (`/recommendations`)

**Route**: `/recommendations`  
**Rendering**: **React Server Components**

**Purpose**: Display recommended products with hybrid server/client rendering.

**Why Server Components?**

- Data fetching happens on server (secure, fast)
- No client-side JavaScript for data fetching
- Client components only for interactive features (wishlist button)
- Demonstrates modern App Router architecture
- Reduces client bundle size

**Data Flow**:

1. Server Component fetches products directly from database
2. HTML rendered on server with product data
3. Client Components (WishlistButton) hydrated for interactivity
4. Hybrid approach: static content + dynamic interactions

---

## 🔒 API Authentication

All admin routes (POST/PUT) are protected with API key authentication:

```typescript
headers: {
  'x-api-key': 'super-secret-admin-key-2025'
}
```

**Protected Endpoints**:

- `POST /api/products` - Create product
- `PUT /api/products/update/[id]` - Update product
- `GET /api/inventory` - Get inventory stats

## 🔄 On-Demand Revalidation

The app implements on-demand ISR revalidation:

```typescript
// Triggered when product is created/updated
await fetch(
  `/api/revalidate?secret=${REVALIDATION_SECRET}&path=/products/${slug}`
);
```

This ensures product pages update immediately after admin changes.

## 📊 Data Model

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
  image?: string;
}
```

## 🎯 Rendering Strategy Summary

| Page            | Route              | Rendering         | Why?                                         |
| --------------- | ------------------ | ----------------- | -------------------------------------------- |
| Home            | `/`                | SSG               | Static content, optimal performance, SEO     |
| Product Detail  | `/products/[slug]` | ISR               | Pre-rendered + auto-updates for dynamic data |
| Dashboard       | `/dashboard`       | CSR + SSR API     | Always-fresh data, real-time stats           |
| Admin           | `/admin`           | CSR               | Highly interactive, authenticated            |
| Recommendations | `/recommendations` | Server Components | Hybrid server/client, reduced bundle size    |

## 🚢 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Environment variables needed in Vercel:

- `ADMIN_API_KEY`
- `REVALIDATION_SECRET`

## 🧪 Testing

### Manual Testing Checklist

- ✅ Home page loads with all products
- ✅ Search and filter work correctly
- ✅ Product detail pages display correct information
- ✅ Dashboard shows real-time inventory
- ✅ Admin can create new products
- ✅ Admin can update existing products
- ✅ Wishlist functionality works
- ✅ Responsive design on mobile/tablet
- ✅ ISR revalidation triggers correctly

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: JSON file-based storage
- **Fonts**: Space Grotesk (Google Fonts)
- **Images**: Unsplash (via CDN)

## 🔥 Bonus Features Implemented

- ✅ TypeScript throughout the project
- ✅ Server Components (Recommendations page)
- ✅ On-demand ISR revalidation
- ✅ API key authentication
- ✅ Modern App Router features (layout.js, route handlers)
- ✅ Glassmorphism + Neo-brutalism design
- ✅ Responsive design
- ✅ Client/Server component separation

## 📸 Screenshots

![alt text](<Screenshot (112).png>) ![alt text](<Screenshot (113).png>) ![alt text](<Screenshot (114).png>) ![alt text](<Screenshot (115).png>) ![alt text](<Screenshot (116).png>) ![alt text](<Screenshot (117).png>)

## 🚀 Future Enhancements

- [ ] E2E tests with Playwright
- [ ] User reviews and ratings
- [ ] Advanced search with Algolia
- [ ] Image upload for products

## 📝 License

This project is created for educational purposes as part of a Next.js internship assignment.

## 👨‍💻 Author

**Ayush Chauhan**  
Date: October 29, 2025

---

Created with ❤️ using Next.js 15, TypeScript, and TailwindCSS and the power of Coffee

---

**Note**: This is a demonstration project showcasing Next.js rendering strategies and modern web development practices. It's not intended for production use without proper authentication, database, and security implementations.
