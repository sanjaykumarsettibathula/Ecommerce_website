#!/bin/bash

echo "🚀 EcommercePro Deployment Helper"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    echo "   git push"
    exit 1
fi

echo "✅ Repository is ready for deployment"
echo ""

echo "Choose your deployment platform:"
echo "1. Vercel (Recommended for full-stack apps)"
echo "2. Render (Good for full-stack with database)"
echo "3. Both"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Deploying to Vercel..."
        echo ""
        echo "Steps:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Login to Vercel: vercel login"
        echo "3. Deploy: vercel --prod"
        echo ""
        echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"
        ;;
    2)
        echo ""
        echo "🎯 Deploying to Render..."
        echo ""
        echo "Steps:"
        echo "1. Go to render.com and create account"
        echo "2. Create a PostgreSQL database"
        echo "3. Create a new Web Service"
        echo "4. Connect your GitHub repository"
        echo "5. Configure environment variables"
        echo ""
        echo "📖 See RENDER_DEPLOYMENT.md for detailed instructions"
        ;;
    3)
        echo ""
        echo "🎯 Deploying to both Vercel and Render..."
        echo ""
        echo "Vercel Steps:"
        echo "1. Install Vercel CLI: npm i -g vercel"
        echo "2. Login to Vercel: vercel login"
        echo "3. Deploy: vercel --prod"
        echo ""
        echo "Render Steps:"
        echo "1. Go to render.com and create account"
        echo "2. Create a PostgreSQL database"
        echo "3. Create a new Web Service"
        echo "4. Connect your GitHub repository"
        echo "5. Configure environment variables"
        echo ""
        echo "📖 See VERCEL_DEPLOYMENT.md and RENDER_DEPLOYMENT.md for detailed instructions"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔧 Environment Variables Checklist:"
echo "Required:"
echo "  - DATABASE_URL (PostgreSQL connection string)"
echo "  - JWT_SECRET (Strong secret key)"
echo "  - SESSION_SECRET (Strong secret key)"
echo ""
echo "Optional:"
echo "  - STRIPE_SECRET_KEY (For payments)"
echo "  - VITE_STRIPE_PUBLIC_KEY (For payments)"
echo "  - GOOGLE_CLIENT_ID (For OAuth)"
echo "  - GOOGLE_CLIENT_SECRET (For OAuth)"
echo "  - FRONTEND_URL (Your deployment URL)"
echo "  - NODE_ENV (Set to 'production')"
echo ""
echo "📚 Documentation:"
echo "  - VERCEL_DEPLOYMENT.md"
echo "  - RENDER_DEPLOYMENT.md"
echo "  - DEPLOYMENT.md (General guide)"
echo ""
echo "🎉 Good luck with your deployment!" 