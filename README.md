# EcommercePro 🛍️

A modern, full-stack e-commerce platform built with React, TypeScript, Express, and PostgreSQL. Features include user authentication, product management, shopping cart, wishlist, payments with Stripe, and admin dashboard.

## ✨ Features

- **🛒 Shopping Cart** - Add, remove, and manage cart items
- **❤️ Wishlist** - Save products for later
- **💳 Payments** - Secure checkout with Stripe
- **🔐 Authentication** - JWT-based auth with Google OAuth support
- **👨‍💼 Admin Dashboard** - Product and order management
- **📱 Responsive Design** - Works on all devices
- **🎨 Modern UI** - Built with Tailwind CSS and Radix UI
- **⚡ Real-time Updates** - React Query for data management
- **🔍 Search & Filter** - Find products easily
- **📊 Analytics** - Sales and order tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd EcommercePro
   ```

2. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database:**
   ```bash
   npm run db:push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📁 Project Structure

```
EcommercePro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and contexts
│   │   └── hooks/         # Custom hooks
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage
│   └── db.ts             # Database connection
├── shared/                 # Shared types and schemas
├── migrations/             # Database migrations
└── docs/                  # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Query** - Data fetching
- **React Router** - Navigation
- **React Hook Form** - Form handling

### Backend
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **JWT** - Authentication
- **Stripe** - Payments
- **Passport.js** - OAuth

### Development
- **Vite** - Build tool
- **ESBuild** - Server bundling
- **TypeScript** - Type checking

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:server       # Start server only

# Database
npm run db:push          # Push schema to database
npm run db:generate      # Generate new migration
npm run db:migrate       # Run migrations
npm run db:studio        # Open database studio

# Build & Deploy
npm run build            # Build for production
npm start                # Start production server
npm run preview          # Preview production build

# Code Quality
npm run check            # TypeScript check
npm run lint             # ESLint check
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `SESSION_SECRET` | Yes | Secret key for sessions |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for payments |
| `VITE_STRIPE_PUBLIC_KEY` | No | Stripe public key for frontend |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

- **Vercel** - Recommended for full-stack apps
- **Railway** - Easy deployment with database
- **DigitalOcean** - App Platform
- **Heroku** - Traditional deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](./DEPLOYMENT.md#troubleshooting)
2. Review the [deployment documentation](./DEPLOYMENT.md)
3. Open an issue on GitHub

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Multi-vendor support
- [ ] Inventory management
- [ ] Customer reviews
- [ ] Discount codes
- [ ] Shipping calculator

---

Made with ❤️ by the EcommercePro team