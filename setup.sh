#!/bin/bash

echo "🚀 Setting up EcommercePro..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please configure your environment variables in .env file"
    echo "   Required variables:"
    echo "   - DATABASE_URL"
    echo "   - JWT_SECRET"
    echo "   - SESSION_SECRET"
    echo ""
    echo "   Optional variables:"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - VITE_STRIPE_PUBLIC_KEY"
    echo "   - GOOGLE_CLIENT_ID"
    echo "   - GOOGLE_CLIENT_SECRET"
else
    echo "✅ .env file already exists"
fi

# Check if database URL is configured
if grep -q "your-database-url" .env; then
    echo "⚠️  Please configure your DATABASE_URL in .env file"
fi

# Check if JWT secret is configured
if grep -q "your-super-secret-jwt-key" .env; then
    echo "⚠️  Please configure your JWT_SECRET in .env file"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in .env"
echo "2. Set up your PostgreSQL database"
echo "3. Run: npm run db:push"
echo "4. Start development server: npm run dev"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md" 