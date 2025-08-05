# Google OAuth Setup Guide

## Prerequisites
1. A Google account
2. Access to Google Cloud Console

## Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

## Step 2: Create OAuth 2.0 Credentials
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Set the following:
   - **Name**: Your app name (e.g., "EcommercePro")
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:5001/api/auth/google/callback`

## Step 3: Get Your Credentials
1. After creating the OAuth client, you'll get:
   - **Client ID**: Copy this
   - **Client Secret**: Copy this

## Step 4: Set Environment Variables
Create a `.env` file in your project root with:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# JWT Secret for token signing
JWT_SECRET=your_jwt_secret_here

# Session Secret for OAuth sessions
SESSION_SECRET=your_session_secret_here

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

## Step 5: Restart Your Application
After setting the environment variables, restart your application:

```bash
npm run dev
```

## Troubleshooting

### Common Issues:

1. **"Google OAuth not configured" warning**
   - Make sure you've set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env` file
   - Restart the application after adding the environment variables

2. **"Google authentication failed" error**
   - Check that your redirect URI matches exactly: `http://localhost:5001/api/auth/google/callback`
   - Ensure your Google Cloud project has the Google+ API enabled

3. **"No user found" error**
   - This usually means the user creation in the database failed
   - Check your database connection and storage implementation

4. **Redirect loop or 404 errors**
   - Make sure your frontend is running on `http://localhost:3000`
   - Ensure your backend is running on `http://localhost:5001`

### Testing the Setup:
1. Start your application
2. Go to `http://localhost:3000/auth`
3. Click "Continue with Google"
4. You should be redirected to Google's consent screen
5. After authorizing, you should be redirected back and logged in

## Security Notes:
- Never commit your `.env` file to version control
- Use different OAuth credentials for development and production
- Regularly rotate your JWT and session secrets