# 🚀 Deployment Guide - Vercel & Render

This guide will help you deploy your EcommercePro application to either Vercel or Render.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository set up
- Environment variables configured
- Database set up (PostgreSQL)

## 🎯 Quick Deployment Options

### Option 1: Vercel (Recommended)

**Pros:**
- Excellent for full-stack applications
- Automatic deployments from Git
- Built-in CDN and edge functions
- Free tier available

**Steps:**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   # Windows
   deploy-vercel.bat
   
   # Unix/Mac
   chmod +x deploy-vercel.sh
   ./deploy-vercel.sh
   
   # Or manually
   npm run deploy:vercel
   ```

4. **Configure Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from your `.env` file

### Option 2: Render

**Pros:**
- Free PostgreSQL database included
- Easy environment variable management
- Automatic deployments
- Good for full-stack apps

**Steps:**

1. **Create Render Account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy using render.yaml:**
   ```bash
   # Windows
   deploy-render.bat
   
   # Unix/Mac
   chmod +x deploy-render.sh
   ./deploy-render.sh
   
   # Or manually
   npm run deploy:render
   ```

3. **Configure Environment Variables:**
   - Go to Render Dashboard → Your Service → Environment
   - Add all required variables

## 🔧 Manual Deployment Steps

### Vercel Manual Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add SESSION_SECRET
   vercel env add STRIPE_SECRET_KEY
   vercel env add VITE_STRIPE_PUBLIC_KEY
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   ```

### Render Manual Deployment

1. **Create New Web Service:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

3. **Add Environment Variables:**
   - Click "Environment" tab
   - Add all variables from your `.env` file

4. **Create Database:**
   - Go to "New +" → "PostgreSQL"
   - Connect it to your web service

## 🌐 Environment Variables Setup

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-key` |
| `SESSION_SECRET` | Secret for sessions | `your-session-secret` |
| `NODE_ENV` | Environment | `production` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | `pk_test_...` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `your-google-secret` |
| `FRONTEND_URL` | Frontend URL for OAuth | `https://yourdomain.com` |

## 🗄️ Database Setup

### Vercel (External Database)

1. **Use Neon (Recommended):**
   - Go to [neon.tech](https://neon.tech)
   - Create free PostgreSQL database
   - Copy connection string to `DATABASE_URL`

2. **Or use Supabase:**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get connection string

### Render (Built-in Database)

1. **Create PostgreSQL Service:**
   - Render will create database automatically
   - Connection string provided in dashboard

2. **Run Migrations:**
   ```bash
   npm run db:push
   ```

## 🔐 Security Checklist

- [ ] Change default JWT secret
- [ ] Change default session secret
- [ ] Use HTTPS (automatic on Vercel/Render)
- [ ] Set up proper CORS
- [ ] Configure rate limiting
- [ ] Set up monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check TypeScript compilation

2. **Database Connection Fails:**
   - Verify `DATABASE_URL` is correct
   - Check database is accessible
   - Ensure migrations are run

3. **Authentication Errors:**
   - Verify `JWT_SECRET` is set
   - Check token expiration
   - Ensure CORS is configured

4. **API Calls Fail:**
   - Check `VITE_API_URL` is set correctly
   - Verify API routes are working
   - Check network connectivity

### Debug Commands

```bash
# Check build locally
npm run build

# Test TypeScript
npm run check

# Run database migrations
npm run db:push

# Test API locally
npm run dev:server
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in analytics dashboard
- Performance monitoring
- Error tracking

### Render Monitoring
- Built-in logs
- Performance metrics
- Health checks

## 🔄 Continuous Deployment

### Vercel
- Automatic deployments on Git push
- Preview deployments for PRs
- Branch deployments

### Render
- Automatic deployments on Git push
- Manual deployments available
- Rollback functionality

## 💰 Cost Optimization

### Vercel
- Free tier: 100GB bandwidth/month
- Pro: $20/month for more features
- Enterprise: Custom pricing

### Render
- Free tier: 750 hours/month
- Starter: $7/month
- Standard: $25/month

## 🎯 Next Steps

After deployment:

1. **Test all functionality:**
   - User registration/login
   - Product browsing
   - Cart operations
   - Checkout process
   - Admin features

2. **Set up monitoring:**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

3. **Configure custom domain:**
   - Add domain in platform dashboard
   - Update DNS settings
   - Configure SSL

4. **Set up backups:**
   - Database backups
   - Code backups
   - Environment backups

---

**Need help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) for more detailed instructions. 