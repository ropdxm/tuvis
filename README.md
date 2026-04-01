# DDD optom — Phone Accessories Store

A full-stack Next.js e-commerce app for phone accessories, inspired by the DDD optom store in Shymkent, Kazakhstan. Features product browsing with subcategories, shopping cart, Kaspi QR payment, and a real-time manager dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (white/clean theme, mobile-first)
- **Database**: Firebase Firestore (real-time)
- **Payments**: Kaspi QR code (manual confirmation flow)
- **Fonts**: Outfit + DM Sans

## Features

- 📱 **Product catalog** — 8 categories (cases, earphones, chargers, cables, power banks, screen protectors, holders, speakers) with subcategories (e.g. iPhone 17, Samsung S24, Type-C, Lightning)
- 🛒 **Shopping cart** — quantity controls, persistent in localStorage
- 💳 **Kaspi QR payment** — customer scans QR, enters name & phone, presses "I paid"
- 📊 **Manager dashboard** (`/dashboard`) — real-time order monitoring, confirm/cancel orders, WhatsApp quick-contact with customers
- 🌍 **Trilingual** — Russian, Kazakh, English with language switcher
- 📱 **Mobile-first responsive design** — optimized for phones, tablets, and desktop
- 🔄 **Real-time order updates** — customer sees status change live via Firestore `onSnapshot`

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with store info |
| `/menu` | Product catalog with categories, subcategories, search |
| `/cart` | Shopping cart with totals |
| `/payment` | Kaspi QR code + customer info + "I paid" button |
| `/order/[id]` | Order confirmation with live status |
| `/dashboard` | Manager panel (password: `tuvis2024`) |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Cloud Firestore**
3. Create a **Web App** and copy config values
4. Generate a **Service Account key** (Project Settings → Service Accounts)

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in Firebase credentials in `.env.local`.

### 4. Seed the database (optional)

The app works with sample data even without Firebase. To load into Firestore:

```bash
npm run seed
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Payment Flow

1. Customer browses catalog → adds items to cart → proceeds to payment
2. Payment page shows a **Kaspi QR code** (currently a placeholder — replace with your real QR)
3. Customer enters their **name** and **phone number**, then presses **"I paid"**
4. Order is created in Firestore with status `awaiting_confirmation`
5. Customer is redirected to order page showing live status
6. **Manager** opens `/dashboard`, sees new order with customer info
7. Manager verifies payment in Kaspi, then clicks **Confirm** or **Cancel**
8. Customer sees status update in real-time
9. Manager can contact customer via **WhatsApp** or **phone** directly from dashboard

## Replacing the QR Code

Open `src/app/payment/page.tsx` and replace the SVG placeholder QR with your actual Kaspi QR image:

```tsx
{/* Replace this SVG with: */}
<img src="/kaspi-qr.png" alt="Kaspi QR" width={200} height={200} />
```

Put your QR image in the `public/` folder.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + custom styles
│   ├── menu/page.tsx               # Product catalog
│   ├── cart/page.tsx               # Shopping cart
│   ├── payment/page.tsx            # Kaspi QR payment + "I paid"
│   ├── order/[id]/page.tsx         # Order status (real-time)
│   ├── dashboard/page.tsx          # Manager dashboard
│   └── api/orders/route.ts         # Orders API (GET/PATCH)
├── components/
│   ├── Header.tsx                  # Navigation header
│   ├── MenuItemCard.tsx            # Product card
│   └── CartItemRow.tsx             # Cart item row
├── context/
│   ├── LanguageContext.tsx          # i18n provider
│   └── CartContext.tsx             # Cart state
├── lib/
│   ├── firebase.ts                 # Firebase client
│   ├── firebaseAdmin.ts           # Firebase Admin (server)
│   ├── translations.ts            # All UI translations
│   ├── sampleData.ts              # Sample products (fallback)
│   └── seedFirebase.ts            # DB seeder script
└── types/index.ts                  # TypeScript types
```

## Firestore Collections

| Collection | Fields |
|---|---|
| `categories` | `id`, `name`, `order`, `icon` |
| `subcategories` | `id`, `name`, `categoryId`, `order` |
| `menuItems` | `id`, `name`, `description`, `price`, `image`, `categoryId`, `subcategoryId`, `available` |
| `orders` | `items[]`, `subtotal`, `total`, `status`, `customerName`, `customerPhone`, `language`, `createdAt` |

## Customization

- **Products**: Edit `src/lib/sampleData.ts` or manage in Firebase Console
- **QR code**: Replace placeholder in `payment/page.tsx` with your Kaspi QR image
- **Dashboard password**: Change `MANAGER_PASSWORD` in `dashboard/page.tsx`
- **Translations**: Edit `src/lib/translations.ts`
- **Colors**: Edit `tailwind.config.ts`
