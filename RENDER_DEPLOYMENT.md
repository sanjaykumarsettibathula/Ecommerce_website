# Render Deployment Guide for EcommercePro

## Prerequisites

- GitHub account with your EcommercePro repository
- Render account (free tier available)
- PostgreSQL database (Render PostgreSQL recommended)

## Step 1: Prepare Your Repository

1. **Ensure your repository is on GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create a `render.yaml` configuration file:**
   ```yaml
   services:
     - type: web
       name: ecommerce-pro
       env: node
       plan: free
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: DATABASE_URL
           fromDatabase:
             name: ecommerce-db
             property: connectionString
         - key: JWT_SECRET
           generateValue: true
         - key: SESSION_SECRET
           generateValue: true
   
   databases:
     - name: ecommerce-db
       databaseName: ecommerce
       user: ecommerce_user
   ```

## Step 2: Set Up Render Database

1. **Go to [render.com](https://render.com)**
2. **Click "New +" and select "PostgreSQL"**
3. **Configure the database:**
   - Name: `ecommerce-db`
   - Database: `ecommerce`
   - User: `ecommerce_user`
   - Plan: Free (or paid for production)
4. **Copy the connection string**

## Step 3: Deploy Your Application

### Method 1: Render Dashboard (Recommended)

1. **Go to [render.com](https://render.com)**
2. **Click "New +" and select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

   **Basic Settings:**
   - Name: `ecommerce-pro`
   - Environment: `Node`
   - Region: Choose closest to your users
   - Branch: `main`
   - Root Directory: Leave empty (root)

   **Build & Deploy:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Method 2: Using render.yaml

1. **Push your repository with `render.yaml`**
2. **Go to Render dashboard**
3. **Click "New +" and select "Blueprint"**
4. **Connect your repository**
5. **Render will automatically detect and use the `render.yaml`**

## Step 4: Configure Environment Variables

1. **Go to your Render service dashboard**
2. **Navigate to Environment > Environment Variables**
3. **Add the following variables:**

   ```bash
   # Required
   DATABASE_URL=your_render_postgresql_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   SESSION_SECRET=your_session_secret_key
   
   # Optional
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=https://your-service.onrender.com
   NODE_ENV=production
   ```

## Step 5: Database Migration

1. **Go to your Render database dashboard**
2. **Copy the connection string**
3. **Run migrations locally with the Render database:**
   ```bash
   DATABASE_URL=your_render_db_url npm run db:push
   ```

## Step 6: Test Your Deployment

1. **Wait for deployment to complete**
2. **Visit your Render URL** (e.g., `https://your-service.onrender.com`)
3. **Test the following features:**
   - User registration/login
   - Product browsing
   - Cart functionality
   - Wishlist
   - Admin dashboard

## Step 7: Custom Domain Setup

1. **Go to your Render service dashboard**
2. **Navigate to Settings > Custom Domains**
3. **Add your custom domain**
4. **Update DNS records as instructed**
5. **Update `FRONTEND_URL` in environment variables**

## Troubleshooting

### Common Issues

1. **Build Failures:**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation passes locally
   - Check for missing environment variables

2. **Database Connection Issues:**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible from Render
   - Ensure database is not paused (free tier limitation)

3. **Application Crashes:**
   - Check application logs in Render dashboard
   - Verify all environment variables are set
   - Test locally with production environment

4. **Cold Start Issues:**
   - Free tier has cold starts
   - Consider upgrading to paid plan for better performance
   - Implement health checks

### Environment Variables Checklist

- [ ] `DATABASE_URL` - Render PostgreSQL connection string
- [ ] `JWT_SECRET` - Strong secret key for JWT tokens
- [ ] `SESSION_SECRET` - Strong secret key for sessions
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key (optional)
- [ ] `VITE_STRIPE_PUBLIC_KEY` - Stripe public key (optional)
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional)
- [ ] `FRONTEND_URL` - Your Render domain
- [ ] `NODE_ENV` - Set to "production"

## Performance Optimization

1. **Enable Auto-Deploy** for automatic deployments
2. **Set up Health Checks** to monitor your service
3. **Configure Caching** for better performance
4. **Optimize Database Queries**
5. **Use CDN** for static assets

## Monitoring

1. **Set up Render Alerts** for service monitoring
2. **Monitor Database Performance**
3. **Set up Error Tracking** (Sentry)
4. **Monitor Response Times**

## Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable HTTPS (automatic with Render)
- [ ] Set up proper CORS
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Use environment variables for secrets

## Free Tier Limitations

- **Cold Starts**: Service may take time to start
- **Database**: Limited to 90 days on free tier
- **Bandwidth**: Limited monthly bandwidth
- **Build Time**: Limited build minutes per month

## Upgrading to Paid Plan

Consider upgrading if you need:
- Faster cold starts
- More bandwidth
- Longer database retention
- Better support
- Custom domains with SSL

## Support

If you encounter issues:
1. Check Render deployment logs
2. Review environment variables
3. Test locally first
4. Check Render documentation
5. Contact Render support if needed

## Alternative: Render Blueprint

For easier deployment, you can use a Render Blueprint:

1. **Create a `render.yaml` file in your repository**
2. **Push to GitHub**
3. **Use Render Blueprint deployment**
4. **Render will automatically set up both service and database** 