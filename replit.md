# E-commerce Application

## Overview

This is a full-stack e-commerce application built with React and Express.js, featuring user authentication, product management, shopping cart functionality, and Stripe payment integration. The application follows a modern architecture with TypeScript throughout and uses in-memory storage for simplicity.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query for server state, Context API for cart and authentication
- **Routing**: React Router for client-side navigation
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Authentication**: JWT tokens with bcrypt password hashing
- **Data Storage**: In-memory storage (MemStorage class)
- **Payment Processing**: Stripe integration for checkout

## Key Components

### Authentication System
- JWT-based authentication with role-based access control (user/admin)
- Secure password hashing using bcrypt
- Protected routes with middleware authentication
- Context-based auth state management on frontend

### Product Management
- Full CRUD operations for products
- Category-based organization
- Search and filtering capabilities
- Stock management
- Admin-only product management interface

### Shopping Cart
- Session-based cart management
- Real-time quantity updates
- Persistent cart state for authenticated users
- Cart synchronization across components

### Payment Integration
- Stripe payment processing
- Secure checkout flow
- Order management system
- Payment intent creation and confirmation

### UI Components
- Comprehensive design system using shadcn/ui
- Responsive design with Tailwind CSS
- Reusable component library
- Consistent styling and theming

## Data Flow

1. **User Authentication**: Users register/login → JWT token issued → Token stored in localStorage → Protected API calls include Authorization header
2. **Product Browsing**: Products fetched from API → Displayed in grid/list views → Search/filter functionality updates query parameters
3. **Cart Management**: Add to cart → Update cart state → Sync with backend → Real-time UI updates
4. **Checkout Process**: Cart items → Billing information → Stripe payment → Order creation → Confirmation

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router)
- UI libraries (Radix UI primitives, Tailwind CSS)
- Form handling (React Hook Form, Zod validation)
- HTTP client (Fetch API with React Query)
- Payment processing (Stripe React components)

### Backend Dependencies
- Express.js for server framework
- JWT and bcrypt for authentication
- Stripe SDK for payment processing
- Zod for schema validation
- Various utility libraries (nanoid, cors middleware)

### Development Dependencies
- TypeScript for type safety
- Vite for build tooling
- ESLint and Prettier for code quality
- Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with middleware mode integration
- Environment variables for Stripe keys
- CORS configuration for cross-origin requests

### Production Build
- Vite builds optimized static assets
- ESBuild bundles server code
- Single deployment artifact with both frontend and backend
- Environment-specific configuration

### Environment Variables
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key for frontend
- `STRIPE_SECRET_KEY`: Stripe secret key for backend payments
- `JWT_SECRET`: Secret for JWT token signing
- `DATABASE_URL`: Database connection string (configured for future use)

## Changelog

```
Changelog:
- July 04, 2025: Initial setup - Created full-stack e-commerce platform
  - ✓ Complete MERN-like architecture with React + Express
  - ✓ JWT user authentication system (login/register)
  - ✓ Product management with CRUD operations
  - ✓ Shopping cart functionality with real-time updates
  - ✓ Stripe payment integration (requires API keys)
  - ✓ Admin dashboard for inventory management
  - ✓ AI-powered product recommendations mock implementation
  - ✓ Responsive design with Tailwind CSS and shadcn/ui
  - ✓ In-memory data storage with seeded products
  - ✓ Search, filtering, and category navigation
  - ✓ Order management system
  - ✓ Fixed JSX parsing issues by converting context files to .tsx
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```