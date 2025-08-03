@echo off
echo 🚀 Setting up EcommercePro...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ⚠️  Please configure your environment variables in .env file
    echo    Required variables:
    echo    - DATABASE_URL
    echo    - JWT_SECRET
    echo    - SESSION_SECRET
    echo.
    echo    Optional variables:
    echo    - STRIPE_SECRET_KEY
    echo    - VITE_STRIPE_PUBLIC_KEY
    echo    - GOOGLE_CLIENT_ID
    echo    - GOOGLE_CLIENT_SECRET
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Configure your environment variables in .env
echo 2. Set up your PostgreSQL database
echo 3. Run: npm run db:push
echo 4. Start development server: npm run dev
echo.
echo For detailed instructions, see DEPLOYMENT.md
pause 