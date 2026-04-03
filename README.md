# 🏗️ Brixel - Architectural Equipment E-Commerce

**"Build Better, Build with Brixel"**

Full-stack e-commerce platform for architectural equipment, serving RUET students and Rajshahi city.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + React 18
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Styling**: Vanilla CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. **Node.js** (v18+) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Edit .env.local with your MongoDB URI

# Seed the database (creates admin user + sample products)
npm run seed

# Start development server
npm run dev
```

### Environment Variables (.env.local)

```
MONGODB_URI=mongodb://localhost:27017/brixel
JWT_SECRET=your_super_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Using MongoDB Atlas (cloud)?** Replace the URI with your Atlas connection string:
> `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brixel`

### Default Admin Login

- **Email**: admin@brixel.com
- **Password**: admin123

## Features

### Customer Features
- 🛒 Browse products by category (Drafting Tools, Model Making, etc.)
- 🔍 Search products
- 📦 Shopping cart with quantity management
- 📋 Checkout with delivery zone selection (Rajshahi city)
- 💳 Payment: Cash on Delivery, bKash, Nagad
- 📍 Order tracking with visual timeline
- 👤 User registration and authentication

### Admin Features
- 📊 Dashboard with revenue stats, order counts
- 📦 Product management (CRUD with image upload)
- 🛒 Order management with status updates
- ⚠️ Low stock alerts
- 👥 Customer overview

### Delivery
- 🚚 2-day delivery in Rajshahi city
- 📍 10 delivery zones including RUET Campus
- 💰 Flat ৳100 delivery charge

## Deployment (Vercel)

1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings
4. Deploy!

## Contact

- 📞 01840150075
- ✉️ screwedone7@gmail.com

---

Built with ❤️ for RUET students
