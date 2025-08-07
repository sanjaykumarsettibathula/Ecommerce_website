# Server Modifications for Separate Deployment

This guide explains the modifications made to the server code to support separate deployment on Render.

## 1. Created a New Build Script

We've created a new build script specifically for Render deployment that doesn't try to copy the client build files:

**File: `server/build-server-only.js`**

This script:
- Builds the server using esbuild
- Creates a minimal public directory with a placeholder index.html
- Doesn't attempt to copy client build files

## 2. Added a New npm Script

We've added a new npm script to the server's package.json:

```json
"build:render": "node build-server-only.js"
```

This script should be used in the Render build command.

## 3. CORS Configuration

The server's CORS configuration in `server/src/index.ts` already supports multiple origins through the `ALLOWED_ORIGINS` environment variable. When deploying, make sure to set this variable to include your Vercel frontend URL.

## 4. Environment Variables

Make sure to set the following environment variables on Render:

- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string
- `SESSION_SECRET`: Another secure random string
- `ALLOWED_ORIGINS`: Include your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- `PORT`: `10000` (Render uses this port by default)
- `NODE_ENV`: `production`
- `STRIPE_SECRET_KEY`: Your Stripe secret key (if using payments)

## 5. Static File Serving

The server's `vite.ts` file includes a `serveStatic` function that serves files from the `dist/public` directory in production. Our modified build script creates a minimal public directory with a placeholder index.html file to prevent errors.

## 6. API Endpoints

All API endpoints will continue to work as before. The frontend will need to be configured to use the Render backend URL by setting the `VITE_API_URL` environment variable on Vercel.

## Deployment Process

1. Push your code to your Git repository
2. Deploy the server to Render using the build command: `npm install && npm run build:render`
3. Deploy the client to Vercel
4. Set the appropriate environment variables on both platforms

## Testing

After deployment, test the following:

1. API endpoints using a tool like Postman
2. Frontend functionality by visiting your Vercel URL
3. Authentication and authorization
4. Database operations

If you encounter any issues, check the logs on Render and Vercel for error messages.