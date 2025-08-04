#!/bin/bash

echo "🚀 Deploying EcommercePro to Render..."

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📦 Installing Render CLI..."
    curl -s https://api.render.com/downloads/install-render.sh | bash
fi

# Check if user is logged in to Render
if ! render whoami &> /dev/null; then
    echo "🔐 Please log in to Render..."
    render login
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Render using render.yaml
echo "🚀 Deploying to Render..."
render deploy

echo "✅ Deployment complete!"
echo "🌐 Your application is now live on Render!"
echo ""
echo "📝 Don't forget to:"
echo "1. Set up your environment variables in Render dashboard"
echo "2. Configure your database connection"
echo "3. Set up Stripe keys (if using payments)"
echo "4. Configure Google OAuth (if using)" 