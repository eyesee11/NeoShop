# MongoDB Atlas Setup Guide

This guide will help you connect your e-commerce application to MongoDB Atlas.

## 📋 Prerequisites

- A MongoDB Atlas account (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- Node.js 18+ installed

## 🚀 Quick Setup Steps

### 1. Create a MongoDB Atlas Cluster

1. **Sign up/Login** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a new project** (e.g., "EcomApp")
3. **Create a free cluster**:
   - Choose a cloud provider (AWS, Google Cloud, or Azure)
   - Select a region close to you
   - Choose M0 Sandbox (Free tier)
   - Click "Create Cluster"

### 2. Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create a username and secure password
5. Set **Database User Privileges** to "Read and write to any database"
6. Click **Add User**

### 3. Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
4. Click **Confirm**

### 4. Get Your Connection String

1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Driver**: Node.js, **Version**: 6.7 or later
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=ecom-app
   ```

### 5. Update Your .env.local File

1. Open `.env.local` in your project
2. Replace the `MONGODB_URI` value with your connection string
3. **Important**: Replace `<username>` and `<password>` with your actual credentials

Example:

```env
MONGODB_URI=mongodb+srv://myuser:MySecurePass123@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority&appName=ecom-app
```

### 6. Seed Your Database

Run the seeding script to migrate your products from JSON to MongoDB:

```bash
npm run seed
```

This will:

- Connect to your MongoDB Atlas cluster
- Create a `products` collection in the `ecom-app` database
- Import all products from `data/products.json`
- Create indexes for better performance

### 7. Start Your Application

```bash
npm run dev
```

Your app should now be connected to MongoDB Atlas! 🎉

## 🔍 Verify Connection

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You should see all products displayed
3. Check the terminal for any connection errors
4. In MongoDB Atlas, go to **Browse Collections** to see your data

## 📊 MongoDB Atlas Dashboard Features

### View Your Data

1. Go to **Database** → **Browse Collections**
2. Select database: `ecom-app`
3. Select collection: `products`
4. You can view, edit, and delete documents directly

### Monitor Performance

1. Go to **Metrics** to see:
   - Query performance
   - Connection counts
   - Data size
   - Operation statistics

### Backup (Free tier includes daily snapshots)

1. Go to **Backup** to configure automatic backups
2. Free tier: 1 snapshot retained for 2 days

## 🔧 Troubleshooting

### Error: "MongoServerError: bad auth"

- **Solution**: Double-check your username and password in `.env.local`
- Make sure you're using the database user credentials, not your Atlas login

### Error: "MongoServerSelectionError: connection refused"

- **Solution**: Check your Network Access settings
- Add your IP address or use 0.0.0.0/0 for development

### Error: "Invalid/Missing environment variable: MONGODB_URI"

- **Solution**: Ensure `.env.local` file exists and contains `MONGODB_URI`
- Restart your dev server after adding the variable

### Products not showing up

- **Solution**: Run the seed script again:
  ```bash
  npm run seed
  ```

## 🔐 Security Best Practices

### For Development

- ✅ Use a strong password for your database user
- ✅ Keep `.env.local` in `.gitignore` (already configured)
- ✅ Never commit credentials to version control

### For Production

- 🔒 Use specific IP whitelist instead of 0.0.0.0/0
- 🔒 Use environment variables in your hosting platform (Vercel, Netlify, etc.)
- 🔒 Rotate credentials regularly
- 🔒 Enable MongoDB Atlas alerts for suspicious activity
- 🔒 Use read-only users for frontend queries when possible

## 📦 Database Schema

### Products Collection

```typescript
{
  id: string;           // Unique product identifier
  name: string;         // Product name
  slug: string;         // URL-friendly identifier (indexed)
  description: string;  // Product description
  price: number;        // Product price
  category: string;     // Product category (indexed)
  inventory: number;    // Stock quantity (indexed)
  lastUpdated: string;  // ISO timestamp
  image?: string;       // Product image URL
}
```

### Indexes Created

- `slug` (unique) - Fast product lookups by URL
- `id` (unique) - Fast product lookups by ID
- `category` - Fast filtering by category
- `inventory` - Fast low-stock queries

## 🎯 Next Steps

### Enhance Your Database

1. **Add more collections**:

   - `users` - User accounts
   - `orders` - Order history
   - `reviews` - Product reviews
   - `wishlists` - User wishlists

2. **Add validation**:

   - Use MongoDB schema validation
   - Enforce data types and required fields

3. **Add aggregations**:
   - Sales analytics
   - Popular products
   - Revenue reports

### Advanced Features

- **Atlas Search**: Full-text search for products
- **Charts**: Visualize your data
- **Triggers**: Automate workflows on data changes
- **Realm**: Mobile/web sync

## 📚 Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Next.js with MongoDB](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching)
- [MongoDB University](https://university.mongodb.com/) - Free courses

## 🆘 Need Help?

- MongoDB Community Forums: [community.mongodb.com](https://community.mongodb.com)
- Stack Overflow: Tag `mongodb` and `nextjs`
- MongoDB Support: Available in Atlas dashboard

---

**Note**: The free M0 tier includes:

- 512 MB storage
- Shared RAM
- Shared vCPU
- Perfect for development and small projects!

For production apps with higher traffic, consider upgrading to M10+ dedicated clusters.
