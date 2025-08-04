@echo off
echo 🚀 Deploying EcommercePro to Render...

REM Check if Render CLI is installed
render --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Render CLI...
    powershell -Command "Invoke-WebRequest -Uri https://api.render.com/downloads/install-render.ps1 -OutFile install-render.ps1; .\install-render.ps1"
)

REM Check if user is logged in to Render
render whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔐 Please log in to Render...
    render login
)

REM Build the application
echo 🔨 Building application...
npm run build

REM Deploy to Render using render.yaml
echo 🚀 Deploying to Render...
render deploy

echo ✅ Deployment complete!
echo 🌐 Your application is now live on Render!
echo.
echo 📝 Don't forget to:
echo 1. Set up your environment variables in Render dashboard
echo 2. Configure your database connection
echo 3. Set up Stripe keys (if using payments)
echo 4. Configure Google OAuth (if using)
pause 