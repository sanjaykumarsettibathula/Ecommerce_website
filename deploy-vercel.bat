@echo off
echo 🚀 Deploying EcommercePro to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please log in to Vercel...
    vercel login
)

REM Build the application
echo 🔨 Building application...
npm run build

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your application is now live on Vercel!
echo.
echo 📝 Don't forget to:
echo 1. Set up your environment variables in Vercel dashboard
echo 2. Configure your database connection
echo 3. Set up Stripe keys (if using payments)
echo 4. Configure Google OAuth (if using)
pause 