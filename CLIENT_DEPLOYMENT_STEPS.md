# Client Deployment to Vercel

This guide provides detailed steps for deploying the EcommercePro client (frontend) to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com/) account
2. Your EcommercePro repository on GitHub, GitLab, or Bitbucket
3. Backend already deployed to Render (or ready to deploy)

## Step 1: Prepare Your Repository

Ensure your code is pushed to your Git repository. Vercel will deploy directly from your repository.

## Step 2: Create a New Project on Vercel

1. Log in to your [Vercel](https://vercel.com/) account
2. Click on "Add New" and select "Project"
3. Import your Git repository
4. If you don't see your repository, you may need to configure Vercel to access your Git provider

## Step 3: Configure Project Settings

Configure the project with the following settings:

- **Framework Preset**: Select `Vite` from the dropdown
- **Root Directory**: Enter `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Configure Environment Variables

1. Expand the "Environment Variables" section
2. Add the following variables:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL (e.g., `https://ecommerce-pro-api.onrender.com`)
   
   If you're using Stripe for payments, also add:
   - **Name**: `VITE_STRIPE_PUBLIC_KEY`
   - **Value**: Your Stripe publishable key

3. Make sure to select all environments (Production, Preview, Development)

## Step 5: Deploy

1. Click the "Deploy" button
2. Vercel will start the deployment process, which includes:
   - Cloning your repository
   - Installing dependencies
   - Building the application
   - Deploying to the Vercel network

3. Wait for the deployment to complete (usually takes 1-2 minutes)

## Step 6: Verify the Deployment

1. Once deployment is complete, Vercel will provide a URL for your application
2. Click on the URL to open your deployed frontend
3. Test the following functionality:
   - Navigation between pages
   - Product browsing
   - User registration and login
   - Cart functionality
   - Checkout process (if applicable)

## Step 7: Configure Custom Domain (Optional)

1. In your project dashboard, click on "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS settings

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs for specific error messages
2. Ensure your code builds locally with `npm run build`
3. Verify that all dependencies are correctly listed in `package.json`

### API Connection Issues

If the frontend cannot connect to the backend:

1. Verify that `VITE_API_URL` is set correctly
2. Check that your backend is running and accessible
3. Ensure CORS is properly configured on the backend

### Environment Variable Issues

If environment variables aren't working:

1. Ensure they are prefixed with `VITE_` for client-side access
2. Redeploy after making changes to environment variables
3. Check that the variables are being accessed correctly in your code

## Continuous Deployment

Vercel automatically sets up continuous deployment from your Git repository:

1. When you push changes to your main branch, Vercel will automatically redeploy
2. You can configure preview deployments for pull requests
3. You can manually trigger deployments from the Vercel dashboard

## Monitoring and Analytics

Vercel provides several tools for monitoring your application:

1. **Analytics**: View page views, performance metrics, and more
2. **Logs**: Check deployment and runtime logs
3. **Integrations**: Add monitoring tools like Sentry or LogRocket

## Conclusion

Your EcommercePro frontend should now be successfully deployed to Vercel. Remember to update the backend's `ALLOWED_ORIGINS` environment variable on Render to include your Vercel URL to prevent CORS issues.