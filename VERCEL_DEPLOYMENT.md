# Vercel Deployment Guide for EcommercePro

## Prerequisites

- GitHub account with your EcommercePro repository
- Vercel account (free tier available)
- PostgreSQL database (Neon, Supabase, or Railway recommended)

## Step 1: Prepare Your Repository

1. **Ensure your repository is on GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a `vercel.json` configuration file:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ]
   }
   ```

## Step 2: Set Up Database

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Update your `.env` file with the connection string

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy your project:**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts:**
   - Link to existing project: `No`
   - Project name: `ecommerce-pro`
   - Directory: `./` (current directory)
   - Override settings: `No`

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings

## Step 4: Configure Environment Variables

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings > Environment Variables**
3. **Add the following variables:**

   ```bash
   # Required
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   SESSION_SECRET=your_session_secret_key
   
   # Optional
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

## Step 5: Database Migration

1. **Install Drizzle Kit globally:**
   ```bash
   npm install -g drizzle-kit
   ```

2. **Run database migrations:**
   ```bash
   drizzle-kit push
   ```

## Step 6: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://your-project.vercel.app`)
2. **Test the following features:**
   - User registration/login
   - Product browsing
   - Cart functionality
   - Wishlist
   - Admin dashboard

## Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check your `DATABASE_URL` in Vercel environment variables
   - Ensure your database allows external connections
   - Test connection locally first

2. **Build Errors:**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation passes locally

3. **API Routes Not Working:**
   - Check the `vercel.json` configuration
   - Ensure routes are properly configured
   - Check server logs in Vercel dashboard

### Environment Variables Checklist

- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Strong secret key for JWT tokens
- [ ] `SESSION_SECRET` - Strong secret key for sessions
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (optional)
- [ ] `VITE_STRIPE_PUBLIC_KEY` - Stripe public key (optional)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)
- [ ] `FRONTEND_URL` - Your Vercel domain
- [ ] `NODE_ENV` - Set to "production"

## Custom Domain Setup

1. **Go to your Vercel project dashboard**
2. **Navigate to Settings > Domains**
3. **Add your custom domain**
4. **Update DNS records as instructed**
5. **Update `FRONTEND_URL` in environment variables**

## Performance Optimization

1. **Enable Vercel Analytics** (optional)
2. **Set up caching headers**
3. **Optimize images**
4. **Enable compression**

## Monitoring

1. **Set up Vercel Analytics**
2. **Monitor function execution times**
3. **Set up error tracking (Sentry)**
4. **Monitor database performance**

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up proper CORS
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variables
3. Test locally first
4. Check Vercel documentation
5. Contact Vercel support if needed 