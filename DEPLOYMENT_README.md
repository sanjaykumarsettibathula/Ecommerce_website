# EcommercePro Deployment Documentation

This directory contains comprehensive guides for deploying the EcommercePro application with the client (frontend) on Vercel and the server (backend) on Render.

## Deployment Guides

### 1. [Deployment Steps](./DEPLOYMENT_STEPS.md)

A complete guide covering the entire deployment process, including:
- Database setup
- Backend deployment to Render
- Frontend deployment to Vercel
- Verification and troubleshooting

### 2. [Server Deployment Modifications](./SERVER_DEPLOYMENT_MODIFICATIONS.md)

Details the modifications made to the server code to support separate deployment, including:
- The new build script for Render
- CORS configuration
- Environment variables
- Static file serving

### 3. [Server Deployment Steps](./SERVER_DEPLOYMENT_STEPS.md)

A detailed guide specifically for deploying the backend to Render, including:
- Database setup
- Render configuration
- Environment variables
- Verification and troubleshooting

### 4. [Client Deployment Steps](./CLIENT_DEPLOYMENT_STEPS.md)

A detailed guide specifically for deploying the frontend to Vercel, including:
- Vercel configuration
- Environment variables
- Verification and troubleshooting

### 5. [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

A comprehensive checklist to ensure a successful deployment, covering:
- Pre-deployment tasks
- Database setup
- Backend deployment
- Frontend deployment
- Post-deployment verification
- Security and performance checks

## Server Modifications

The following files have been added or modified to support separate deployment:

1. `server/build-server-only.js` - A new build script for Render that doesn't try to copy client build files
2. `server/package.json` - Added a new `build:render` script

## Environment Variables

### Backend (Render)

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token generation
- `SESSION_SECRET` - Secret for session management
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins (include your Vercel frontend URL)
- `PORT` - Set to `10000` for Render
- `NODE_ENV` - Set to `production`
- `STRIPE_SECRET_KEY` - Stripe secret key (if using payments)

### Frontend (Vercel)

- `VITE_API_URL` - Your Render backend URL
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key (if using payments)

## Deployment Flow

1. Set up your PostgreSQL database
2. Deploy the backend to Render
3. Note down the Render service URL
4. Deploy the frontend to Vercel with the Render URL as `VITE_API_URL`
5. Update the backend's `ALLOWED_ORIGINS` to include the Vercel URL
6. Verify the complete application

## Support

If you encounter any issues during deployment, refer to the troubleshooting sections in each guide or consult the documentation for Vercel, Render, or your database provider.