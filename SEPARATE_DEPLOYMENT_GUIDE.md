# Separate Deployment Guide for EcommercePro

This guide explains how to deploy the EcommercePro application with the client (frontend) and server (backend) as separate deployments.

## Prerequisites

- Vercel account for frontend deployment
- Render account for backend deployment
- PostgreSQL database (You can use Neon, Railway, or any other PostgreSQL provider)
- Git repository with your project code

## 1. Backend Deployment (Render)

1. Create a new PostgreSQL database from your chosen provider
2. Log in to your Render account and create a new Web Service
3. Connect your Git repository
4. Configure the build settings:
   - **Build Command**: `npm install && npm run build:server-only`
   - **Start Command**: `npm run start`

5. Set up the following environment variables in Render:
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secure_jwt_secret
   SESSION_SECRET=your_secure_session_secret
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   PORT=10000
   ```

6. Deploy the service and note down the deployment URL (e.g., https://your-backend.onrender.com)

## 2. Frontend Deployment (Vercel)

1. Log in to your Vercel account
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

4. Set up the environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

5. Deploy the project

## 3. Post-Deployment Steps

1. Test the following functionality:
   - User registration/login
   - Product browsing and search
   - Cart operations
   - Wishlist management
   - Checkout process

2. Common Issues and Solutions:

   - **CORS Errors**:
     - Verify the `ALLOWED_ORIGINS` in backend matches your frontend domain
     - Check that all API requests use the correct backend URL

   - **Database Connection Issues**:
     - Verify `DATABASE_URL` is correct and accessible
     - Check if database requires SSL connection
     - Ensure database connection limits are properly configured

   - **Authentication Problems**:
     - Confirm `JWT_SECRET` is properly set
     - Verify token handling in frontend API calls
     - Check for proper HTTPS protocol usage

## 4. Optional Features Setup

If you're using additional features, set up these environment variables:

### Stripe Integration
```
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Google OAuth
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 5. Monitoring and Maintenance

1. Set up monitoring:
   - Use Render's built-in monitoring
   - Configure error tracking (e.g., Sentry)
   - Set up uptime monitoring

2. Regular maintenance:
   - Monitor database performance
   - Check error logs regularly
   - Keep dependencies updated
   - Perform regular backups