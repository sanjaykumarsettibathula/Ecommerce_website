# EcommercePro Deployment Guide

This guide provides step-by-step instructions for deploying the EcommercePro application with the client (frontend) on Vercel and the server (backend) on Render.

## Prerequisites

1. A [Vercel](https://vercel.com/) account
2. A [Render](https://render.com/) account
3. A [PostgreSQL database](https://neon.tech/) (we'll use Neon.tech in this guide)
4. Git repository with your EcommercePro code

## Step 1: Prepare Your Database

1. Create a PostgreSQL database on [Neon.tech](https://neon.tech/) or any other PostgreSQL provider
2. Note down your database connection string, which should look like:
   ```
   postgresql://username:password@hostname:port/database?sslmode=require
   ```

## Step 2: Deploy the Backend to Render

1. Log in to your [Render](https://render.com/) account
2. Click on "New" and select "Web Service"
3. Connect your Git repository
4. Configure the web service with the following settings:
   - **Name**: `ecommerce-pro-api` (or any name you prefer)
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty if your repository root is the project root
   - **Build Command**: `npm install && npm run build:render`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select a paid plan for production use)

5. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string (e.g., generate with `openssl rand -hex 16`)
   - `SESSION_SECRET`: Another secure random string
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins (include your Vercel frontend URL)
   - `PORT`: `10000` (Render uses this port by default)
   - `NODE_ENV`: `production`
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (if using payments)

6. Click "Create Web Service"
7. Wait for the deployment to complete (this may take a few minutes)
8. Note down your Render service URL (e.g., `https://ecommerce-pro-api.onrender.com`)

## Step 3: Deploy the Frontend to Vercel

1. Log in to your [Vercel](https://vercel.com/) account
2. Click on "Add New" and select "Project"
3. Import your Git repository
4. Configure the project with the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add the following environment variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://ecommerce-pro-api.onrender.com`)
   - `VITE_STRIPE_PUBLIC_KEY`: Your Stripe publishable key (if using payments)

6. Click "Deploy"
7. Wait for the deployment to complete
8. Your frontend should now be accessible at the Vercel URL

## Step 4: Verify the Deployment

1. Visit your Vercel URL to ensure the frontend is working
2. Test the API endpoints by making requests to your Render URL
3. Verify that the frontend can communicate with the backend

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Ensure your backend's `ALLOWED_ORIGINS` environment variable includes your Vercel frontend URL
2. Check that your frontend is using the correct backend URL in `VITE_API_URL`

### Database Connection Issues

If the backend cannot connect to the database:

1. Verify your `DATABASE_URL` is correct
2. Ensure your database provider allows connections from Render's IP addresses
3. Check if your database requires SSL connections

### Authentication Issues

If users cannot log in or register:

1. Ensure `JWT_SECRET` and `SESSION_SECRET` are set correctly
2. Verify that the frontend is sending requests to the correct backend URL

## Monitoring and Maintenance

- Use Render's built-in logs to monitor your backend
- Use Vercel's analytics to monitor your frontend
- Set up alerts for any critical issues

## Scaling

As your application grows:

1. Consider upgrading to paid plans on Render and Vercel
2. Scale your database as needed
3. Implement caching strategies
4. Consider using a CDN for static assets

## Conclusion

Your EcommercePro application should now be successfully deployed with the frontend on Vercel and the backend on Render. If you encounter any issues, refer to the troubleshooting section or consult the documentation for Vercel, Render, or your database provider.