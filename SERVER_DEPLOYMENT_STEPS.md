# Server Deployment to Render

This guide provides detailed steps for deploying the EcommercePro server (backend) to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. A PostgreSQL database (we'll use [Neon.tech](https://neon.tech/) in this guide)
3. Your EcommercePro repository on GitHub, GitLab, or Bitbucket

## Step 1: Set Up Your Database

1. Create an account on [Neon.tech](https://neon.tech/) (or any PostgreSQL provider)
2. Create a new project
3. Create a new database
4. Note down your connection string, which should look like:
   ```
   postgresql://username:password@hostname:port/database?sslmode=require
   ```

## Step 2: Prepare Your Repository

Ensure your code is pushed to your Git repository with the server modifications for separate deployment:

1. The `build-server-only.js` script should be in the server directory
2. The server's package.json should include the `build:render` script

## Step 3: Create a New Web Service on Render

1. Log in to your [Render](https://render.com/) account
2. Click on "New" and select "Web Service"
3. Connect your Git repository
   - If you don't see your repository, you may need to configure Render to access your Git provider

## Step 4: Configure Web Service Settings

Configure the web service with the following settings:

- **Name**: `ecommerce-pro-api` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty if your repository root is the project root
- **Build Command**: `npm install && npm run build:render`
- **Start Command**: `npm start`
- **Plan**: Free (or select a paid plan for production use)

## Step 5: Configure Environment Variables

1. Scroll down to the "Environment" section
2. Add the following environment variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `DATABASE_URL` | Your PostgreSQL connection string | Database connection URL |
   | `JWT_SECRET` | A secure random string | Secret for JWT token generation |
   | `SESSION_SECRET` | Another secure random string | Secret for session management |
   | `ALLOWED_ORIGINS` | Your Vercel frontend URL (e.g., `https://your-app.vercel.app`) | Comma-separated list of allowed origins |
   | `PORT` | `10000` | Render uses this port by default |
   | `NODE_ENV` | `production` | Environment mode |
   | `STRIPE_SECRET_KEY` | Your Stripe secret key | Only if using payments |

   You can generate secure random strings using:
   ```
   openssl rand -hex 16
   ```

## Step 6: Deploy

1. Click "Create Web Service"
2. Render will start the deployment process, which includes:
   - Cloning your repository
   - Installing dependencies
   - Building the application
   - Starting the server

3. Wait for the deployment to complete (this may take 5-10 minutes on the free plan)

## Step 7: Verify the Deployment

1. Once deployment is complete, Render will provide a URL for your service (e.g., `https://ecommerce-pro-api.onrender.com`)
2. Test your API endpoints using a tool like Postman or by visiting endpoints that return data (e.g., `/api/products`)
3. Note down your Render service URL for configuring the frontend

## Step 8: Configure Custom Domain (Optional)

1. In your web service dashboard, click on "Settings" and then "Custom Domain"
2. Add your custom domain
3. Follow Render's instructions to configure DNS settings

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs for specific error messages
2. Ensure your code builds locally with `npm run build:render`
3. Verify that all dependencies are correctly listed in `package.json`

### Database Connection Issues

If the server cannot connect to the database:

1. Verify your `DATABASE_URL` is correct
2. Ensure your database provider allows connections from Render's IP addresses
3. Check if your database requires SSL connections

### Server Startup Issues

If the server fails to start:

1. Check the logs for error messages
2. Ensure all required environment variables are set
3. Verify that the start command is correct

## Monitoring and Logs

Render provides several tools for monitoring your application:

1. **Logs**: Access real-time logs from the "Logs" tab
2. **Metrics**: View CPU and memory usage
3. **Events**: Track deployments and other events

## Scaling (For Production Use)

As your application grows:

1. Upgrade to a paid plan for better performance and reliability
2. Configure auto-scaling if needed
3. Set up a database with higher capacity

## Conclusion

Your EcommercePro backend should now be successfully deployed to Render. Make sure to update your frontend's `VITE_API_URL` environment variable on Vercel to point to your Render service URL.