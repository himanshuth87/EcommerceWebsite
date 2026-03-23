# Priority Bags — React Ecommerce

A full-stack ecommerce site for a premium luggage brand, rebuilt in **React + Vite** with a **Node.js / Express** API and **Supabase (PostgreSQL)** database. Deployable to **Vercel** in minutes.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + React Router 6 + Vite 5 |
| Backend | Node.js + Express 4 |
| Database | Supabase (PostgreSQL via `pg`) |
| Payments | Razorpay |
| Auth | JWT + bcryptjs |
| Hosting | Vercel |

---

## Local Development

### 1 · Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

### 2 · Configure environment
```bash
cp .env.example .env
# Open .env and fill in DATABASE_URL, JWT_SECRET, RAZORPAY keys, etc.
```

### 3 · Set up Supabase database
Go to **Supabase → SQL Editor** and run `supabase_setup.sql`.

### 4 · Run (two terminals)
```bash
# Terminal 1 — React frontend (http://localhost:5173)
npm run dev:frontend

# Terminal 2 — Express API (http://localhost:3000)
npm run dev:backend
```

The Vite dev server proxies `/api` and `/tables` to the Express backend automatically.

---

## Deploy to Vercel

### Step 1 — Build the frontend
```bash
npm run build
```

### Step 2 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3 — Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
2. Set the following **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Supabase connection URI |
| `JWT_SECRET` | Any long random string |
| `JWT_EXPIRE` | `24h` |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGIN` | `https://your-app.vercel.app` |
| `RAZORPAY_KEY_ID` | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard |

3. Click **Deploy** ✅

> **Note:** The `vercel.json` routes API calls to Express and all other routes to the React SPA (`dist/index.html`).

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home — hero slider, categories, products, trust strip |
| `/products` | Products — sidebar filters, search, sort |
| `/products/:id` | Product Detail — colours, sizes, add to cart |
| `/checkout` | Checkout — 2-step shipping + payment |
| `/login` | Login / Register |
| `/account` | User account dashboard |
| `/about` | Brand story + team |
| `/premium` | Premium collection |

## API Endpoints

| Method | Route | Auth |
|--------|-------|------|
| GET | `/health` | — |
| POST | `/api/register` | — |
| POST | `/api/login` | — |
| GET | `/api/v1/catalog/products` | — |
| GET | `/api/v1/catalog/products/:id` | — |
| POST | `/api/v1/catalog/products` | Admin |
| DELETE | `/api/v1/catalog/products/:id` | Admin |
| POST | `/api/v1/user/register` | — |
| POST | `/api/v1/user/login` | — |
| GET | `/api/v1/user/me` | User |
| POST | `/api/create-order` | — |
| POST | `/api/v1/orders/create` | User |
| POST | `/api/v1/orders/verify` | User |
| GET | `/api/orders` | Admin |

## Default Admin (after running supabase_setup.sql)
- **Email:** `admin@prioritybags.com`
- **Password:** `admin123` ← **change this immediately in production**
