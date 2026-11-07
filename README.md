# 🏪 Shree Seva Enterprises & Readymade — E-Commerce Web App & PWA

> **Premium Single-Owner Local Retail Platform & Installable Progressive Web Application**  
> **Location:** Pachora, Dist. Jalgaon, Maharashtra 424201, India  
> **Brand Identity:** Deep Maroon (`#8F1028`), Warm Yellow (`#FFC83D`), Cream (`#FFF9EF`), White (`#FFFFFF`)

---

## 📌 Business Overview

**Shree Seva Enterprises & Readymade** is a single-owner retail business located in **Pachora, Maharashtra**.  
Unlike generic multi-vendor platforms, Shree Seva operates a single physical retail storefront with a unified inventory serving local families with:
1. **Kirana & Daily Groceries** *(Primary priority: Atta, Basmati Rice, Sunflower Oil, Iodized Salt, Sugar, Toor Dal, Strong Tea, Parle-G, Maggi, Fresh Milk)*
2. **Cold Drinks & Chilled Beverages** *(Coca-Cola, Sprite, Thums Up, Frooti, Mineral Water)*
3. **General Stationery** *(Classmate notebooks, ballpoint pens, drawing pencils, fevicol)*
4. **Personal Care** *(Bathing soaps, toothpastes, shampoos, hair oils)*
5. **Home & Cleaning** *(Detergents, dishwash gels, toilet & surface cleaners)*
6. **Snacks & Confectionery** *(Chips, biscuits, namkeen, chocolates)*

Customers can browse products, filter by category and price, add items to cart, select **Home Delivery** or **Store Pickup**, place orders, and track live order progress.

---

## 🚀 Architecture & Tech Stack

```
shreesevawebapp/
├── public/                     # Static assets, Web App Manifest & Service Worker
│   ├── icons/                  # PWA branded app icons (192x192, 512x512, maskable, iOS touch)
│   ├── manifest.webmanifest    # W3C Web App Manifest
│   ├── manifest.json           # Secondary manifest link
│   └── sw.js                   # Service Worker (Stale-While-Revalidate + Cache fallback)
├── src/                        # Customer Frontend (React 19 + Vite 8 + TypeScript + Tailwind CSS v4)
│   ├── components/             # UI components, layout, cards, PWA modals & banners
│   ├── data/                   # Initial verified catalog data (fallback cache)
│   ├── hooks/                  # Custom hooks (usePWA, search, filters)
│   ├── layouts/                # MainLayout with header, offline alert & update banner
│   ├── pages/                  # Customer pages (Home, Categories, ProductDetail, Cart, Checkout, TrackOrder)
│   ├── services/
│   │   ├── api/client.ts       # Typed fetch API client
│   │   └── queries/            # TanStack React Query hooks with offline fallback
│   ├── store/                  # Zustand stores (Cart, Wishlist)
│   ├── pwa.ts                  # Service worker registration & update controller
│   └── main.tsx                # Frontend entry point
│
├── backend/                    # Dedicated Express + TypeScript Backend
│   ├── src/
│   │   ├── config/             # Cloudinary upload configuration
│   │   ├── db/
│   │   │   ├── schema/index.ts # Drizzle ORM Schema (13 tables & relations)
│   │   │   ├── index.ts        # Neon PostgreSQL HTTP serverless connection
│   │   │   └── seed.ts         # Idempotent database seed script
│   │   ├── routes/             # REST API routes (health, store, categories, products, orders, search)
│   │   ├── app.ts              # Express application setup, Helmet, CORS
│   │   └── server.ts           # Server bootstrap (Port 5000)
│   ├── drizzle/                # Generated SQL migrations
│   ├── drizzle.config.ts       # Drizzle Kit CLI configuration
│   └── package.json            # Backend dependencies
└── README.md
```

---

## 📱 Phase 3: Progressive Web App (PWA)

The web application is fully PWA-enabled and installable across Desktop, Android, and iOS devices.

### Key Capabilities:
- **Web App Manifest (`public/manifest.webmanifest`)**:
  - `name`: "Shree Seva Enterprises & Readymade"
  - `short_name`: "Shree Seva"
  - `theme_color`: `#8F1028` (Deep Maroon)
  - `background_color`: `#FFF9EF` (Warm Cream)
  - `display`: `standalone`
  - High-resolution adaptive & maskable icons generated in `public/icons/`.
- **Service Worker (`public/sw.js`)**:
  - Caches app shell, stylesheets, scripts, and static imagery using Stale-While-Revalidate.
  - Network-first caching for API endpoints (`/api/*`).
  - Offline fallback screen when internet connectivity is completely lost.
  - `SKIP_WAITING` listener for smooth in-app updates.
- **Install App Experience**:
  - **Desktop / Android**: Custom install trigger via the "Download App" button in the header and account screen using the native `beforeinstallprompt` event.
  - **iOS Safari**: Step-by-step guidance card instructing users to tap **Share** (`⎋`) and select **"Add to Home Screen"** (`⊞`).
- **Update & Network Banners**:
  - `<PWAUpdateNotification />`: Real-time notification bar when a new service worker version is detected with a 1-tap reload button.
  - `<OfflineBanner />`: Non-intrusive alert when the device goes offline.

---

## 🗄️ Phase 4: Neon PostgreSQL Database & Express Backend

The backend is built with **Node.js + Express + TypeScript** communicating directly with **Neon PostgreSQL (Serverless)** through **Drizzle ORM**.

### 13 Relational Database Tables:
1. `users`: Customers, store owner, counter staff, and delivery partners.
2. `addresses`: Delivery addresses in Pachora (landmarks, street, city, pincode `424201`).
3. `categories`: Kirana, Cold Drinks, Stationery, Personal Care, Home Cleaning, Snacks, Daily Essentials.
4. `products`: Daily grocery items with prices, units (`5 kg`, `1 L`, `200 Pages`), stock status, rating, and badges.
5. `product_images`: Multiple gallery and primary product images.
6. `inventory`: Product stock quantity, low-stock threshold, and availability flags.
7. `orders`: Order number (`SS-842910`), fulfillment type (`home_delivery` / `store_pickup`), status, subtotal, and total amount.
8. `order_items`: Order line items with historical snapshot of product name, image, and price.
9. `order_status_history`: Timestamped timeline (`Order Placed` → `Packed` → `Out for Delivery` → `Delivered`).
10. `delivery_personnel`: Local delivery team records (e.g. Ganesh Patil with vehicle number `MH 19 BY 4412`).
11. `deliveries`: Active deliveries linked to orders with estimated arrival times.
12. `payments`: Payment records (`cod`, `upi`, `card`), transaction IDs, amounts, and statuses.
13. `admin_activity_logs`: Audit trail for store management operations.

### REST API Endpoints:
- `GET /api/health` — Database health check and round-trip latency probe.
- `GET /api/store` — Pachora retail store information, service areas, and operating hours.
- `GET /api/categories` — List active categories ordered by priority.
- `GET /api/categories/:slug` — Category details with products.
- `GET /api/products` — Paginated and filtered catalog (`category`, `brand`, `minPrice`, `maxPrice`, `inStock`, `sort`).
- `GET /api/products/:slug` — Detailed product view with inventory and images.
- `GET /api/products/featured` — Featured grocery items.
- `GET /api/products/best-sellers` — Best sellers (Atta, Basmati Rice, Sunflower Oil, Parle-G, Coca-Cola).
- `GET /api/products/new-arrivals` — Newly stocked items.
- `GET /api/products/offers` — Discounted products and seasonal promotions.
- `GET /api/search?q=:query` — Catalog search across product names, brands, descriptions, and categories.
- `POST /api/orders` — Create a new order with items, payment details, and initial status history.
- `GET /api/orders/track/:orderNumber` — Live order tracking (includes pre-seeded `#SS-842910` matching reference UI).

---

## 🛠️ Getting Started & Commands

### Prerequisites:
- Node.js 18+ (tested with Node.js v24)
- npm 10+

### 1. Environment Configuration:
The project uses environment variables. An example file is provided:
- Root: `.env.example`
- Backend: `backend/.env.example`

Create `backend/.env` with your Neon database URL:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://neondb_owner:<password>@<neon-host>/neondb?sslmode=require
```

### 2. Available NPM Scripts:

#### Root Workspace:
```bash
# Start frontend Vite dev server (http://localhost:5173)
npm run dev

# Build frontend for production
npm run build

# Start backend dev server (tsx watch on port 5000)
npm run backend:dev

# Build backend TypeScript
npm run backend:build

# Generate Drizzle migration files
npm run db:generate

# Push schema directly to Neon PostgreSQL
npm run db:push

# Seed database with initial products, categories & reference order
npm run db:seed

# Launch Drizzle Studio database GUI
npm run db:studio
```

#### Backend Directory:
```bash
cd backend
npm run dev          # Start Express API server
npm run build        # Compile TypeScript to dist/
npm run test:api     # Verify all REST endpoints against Neon PostgreSQL
npm run db:seed      # Re-seed categories & products
```

---

## 🛡️ Offline Resilience & Graceful Fallback

The frontend is architected so that the shopping experience **never breaks**:
- When the backend and Neon database are connected, data is fetched live and cached via **TanStack React Query**.
- If the backend is loading or unreachable (e.g. during offline use or local development without backend), the app automatically falls back to local data (`src/data/products.ts` and `src/data/categories.ts`).
- Placing demo orders works reliably with local state updates and attempts background synchronization.

---

## 👥 Credits & Verification

- **Business:** Shree Seva Enterprises & Readymade, Pachora, Maharashtra.
- **Reference UI:** Faithfully recreates desktop header, hero banner, category grid, product cards, bottom navigation, order tracking, and mobile screens.
- **Database:** Neon Serverless PostgreSQL with SSL connection pooling.
