# EcommercePro Deployment Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Google OAuth credentials (optional)

## Environment Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Configure your environment variables:**
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"
   
   # JWT Secret (generate a strong secret)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   
   # Session Secret
   SESSION_SECRET="your-session-secret-key-change-this-in-production"
   
   # Stripe Keys (get from Stripe Dashboard)
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   VITE_STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Frontend URL
   FRONTEND_URL="http://localhost:3000"
   ```

## Database Setup

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   ```

2. **Run database migrations:**
   ```bash
   npm run db:push
   ```

3. **Seed the database (optional):**
   ```bash
   npm run dev
   # The server will automatically seed the database on first run
   ```

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**

### Option 2: Railway

1. **Connect your GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

### Option 3: DigitalOcean App Platform

1. **Create a new app in DigitalOcean**
2. **Connect your GitHub repository**
3. **Set environment variables**
4. **Deploy**

### Option 4: Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for JWT tokens |
| `SESSION_SECRET` | Yes | Secret key for sessions |
| `STRIPE_SECRET_KEY` | No | Stripe secret key for payments |
| `VITE_STRIPE_PUBLIC_KEY` | No | Stripe public key for frontend |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `FRONTEND_URL` | No | Frontend URL for OAuth callbacks |
| `NODE_ENV` | No | Environment (development/production) |

## Stripe Setup

1. **Create a Stripe account**
2. **Get your API keys from the Stripe Dashboard**
3. **Add the keys to your environment variables**
4. **Test payments will work with test keys**

## Google OAuth Setup (Optional)

1. **Go to Google Cloud Console**
2. **Create a new project**
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials**
5. **Add authorized redirect URIs:**
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

## Database Management

### Generate new migration:
```bash
npm run db:generate
```

### Apply migrations:
```bash
npm run db:migrate
```

### View database in browser:
```bash
npm run db:studio
```

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check your `DATABASE_URL`
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Authentication errors:**
   - Check `JWT_SECRET` is set
   - Verify token expiration

3. **Stripe payments not working:**
   - Verify Stripe keys are correct
   - Check Stripe webhook configuration

4. **Google OAuth not working:**
   - Verify redirect URIs are correct
   - Check Google Cloud Console settings

### Logs

Check application logs for detailed error information:
```bash
# Development
npm run dev

# Production
npm start
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Change default session secret
- [ ] Use HTTPS in production
- [ ] Set up proper CORS configuration
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## Performance Optimization

- [ ] Enable compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Optimize database queries
- [ ] Enable gzip compression

## Monitoring

Consider setting up:
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Uptime monitoring
- Database monitoring 