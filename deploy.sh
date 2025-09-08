#!/bin/bash
echo "�� FinClick.AI - Vercel Deployment"
echo "=================================="

# Check if Vercel CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

# Check if user is logged in
echo "🔐 Checking Vercel login status..."
if ! npx vercel whoami &> /dev/null; then
    echo "❌ Please log in to Vercel first:"
    echo "   npx vercel login"
    exit 1
fi

echo "✅ User is logged in to Vercel"

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Deployment completed!"
echo "🌐 Your app is now live on Vercel!"
echo "📝 Don't forget to add environment variables in Vercel Dashboard"
