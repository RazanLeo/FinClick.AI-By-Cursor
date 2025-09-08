#!/bin/bash

# FinClick.AI - Vercel Deployment Script
echo "🚀 Starting FinClick.AI deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel
echo "🔐 Logging into Vercel..."
vercel login

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at the provided URL"
echo "📝 Don't forget to add environment variables in Vercel Dashboard"
