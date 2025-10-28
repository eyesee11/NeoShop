# Deployment Guide - NeoShop E-commerce

## Quick Start (Local Development)

```bash
# Navigate to project
cd c:\Users\91819\Desktop\ecom-app

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

## Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start

# Server runs on http://localhost:3000
```

## Deploy to Vercel (Recommended)

### Option 1: Vercel CLI

1. Install Vercel CLI globally:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy from project directory:

```bash
cd c:\Users\91819\Desktop\ecom-app
vercel
```

4. Follow the prompts:

   - Set up and deploy? **Yes**
   - Which scope? **Your username**
   - Link to existing project? **No**
   - Project name? **neoshop** (or your choice)
   - Directory? **./
     **
   - Override settings? **No**

5. Set environment variables in Vercel dashboard:

   - `ADMIN_API_KEY`: Your secret admin key
   - `REVALIDATION_SECRET`: Your revalidation secret

6. Deploy production version:

```bash
vercel --prod
```

### Option 2: Vercel Dashboard (GitHub Integration)

1. Push code to GitHub:

```bash
cd c:\Users\91819\Desktop\ecom-app
git init
git add .
git commit -m "Initial commit: NeoShop e-commerce app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/neoshop.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)

3. Click "Add New Project"

4. Import your GitHub repository

5. Configure project:

   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **./ (default)**
   - Build Command: **npm run build** (default)
   - Output Directory: **.next** (default)

6. Add Environment Variables:

```
ADMIN_API_KEY=your-secret-admin-key-here
REVALIDATION_SECRET=your-revalidation-secret-here
```

7. Click "Deploy"

8. Your app will be live at: `https://your-project-name.vercel.app`

## Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Install Netlify CLI:

```bash
npm i -g netlify-cli
```

3. Login and deploy:

```bash
netlify login
netlify deploy
```

4. Follow prompts and select `.next` as the deploy directory

5. Set environment variables in Netlify dashboard

## Docker Deployment

1. Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. Build and run:

```bash
docker build -t neoshop .
docker run -p 3000:3000 \
  -e ADMIN_API_KEY=your-key \
  -e REVALIDATION_SECRET=your-secret \
  neoshop
```

## Environment Variables Reference

| Variable              | Description                                  | Example                       |
| --------------------- | -------------------------------------------- | ----------------------------- |
| `ADMIN_API_KEY`       | Secret key for admin API authentication      | `super-secret-admin-key-2025` |
| `REVALIDATION_SECRET` | Secret for triggering on-demand revalidation | `revalidate-secret-key-2025`  |

## Post-Deployment Checklist

- [ ] Test home page loads correctly
- [ ] Verify product detail pages work
- [ ] Test dashboard real-time data
- [ ] Try admin panel CRUD operations
- [ ] Check recommendations page
- [ ] Verify search and filters work
- [ ] Test on mobile devices
- [ ] Check performance metrics
- [ ] Verify ISR revalidation works
- [ ] Test API authentication

## Performance Optimization

### Enable Caching Headers

In `next.config.ts`, add:

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store' },
      ],
    },
  ];
}
```

### Image Optimization

Images are automatically optimized by Next.js Image component. For external images, add domains to `next.config.ts`:

```typescript
images: {
  domains: ['images.unsplash.com'],
}
```

## Monitoring & Analytics

### Vercel Analytics (Free)

Add to your project:

```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:

```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Troubleshooting

### Build Fails

- Clear `.next` folder: `rm -rf .next`
- Clear `node_modules`: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18+)

### API Routes Not Working

- Verify environment variables are set
- Check API key in requests matches environment variable
- Ensure `.env.local` is not committed to Git

### Images Not Loading

- Verify image URLs are accessible
- Check Next.js image configuration
- Ensure external domains are whitelisted

### ISR Not Revalidating

- Check `revalidate` value is set
- Verify revalidation secret is correct
- Test with on-demand revalidation API

## Security Checklist for Production

- [ ] Change default API keys
- [ ] Enable HTTPS only
- [ ] Add rate limiting to API routes
- [ ] Implement proper authentication (NextAuth.js)
- [ ] Add CSRF protection
- [ ] Set security headers
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable Content Security Policy
- [ ] Add WAF rules

## Database Migration (For Production)

Replace JSON file with MongoDB:

1. Install MongoDB driver:

```bash
npm install mongodb
```

2. Create `lib/mongodb.ts`:

```typescript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  await client.connect();
  return client.db("neoshop");
}
```

3. Update `lib/db.ts` to use MongoDB queries

## Live Demo

After deployment, your app will be available at:

- **Vercel**: `https://your-project.vercel.app`
- **Custom Domain**: Configure in deployment platform

## Support

For issues or questions:

1. Check the README.md
2. Review TECHNICAL_REPORT.md
3. Check Next.js documentation
4. Verify environment variables

---

**Last Updated**: October 29, 2025  
**Next.js Version**: 15.0+  
**Node Version**: 18+
