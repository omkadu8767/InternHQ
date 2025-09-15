#!/bin/bash

# Render Build Script for Vue.js Frontend

echo "🚀 Starting Render deployment build..."

# Set environment to production
export NODE_ENV=production

# Clear npm cache to avoid issues
npm cache clean --force

# Install dependencies with exact versions
echo "📦 Installing dependencies..."
npm ci --only=production
npm install --only=dev

# Build the application
echo "🔨 Building Vue.js application..."
npm run build

# Verify build
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo "✅ Build successful!"
    echo "📁 Build output:"
    ls -la dist/
    echo "📊 Build size:"
    du -sh dist/
else
    echo "❌ Build failed - dist directory is empty or missing"
    exit 1
fi

echo "🎉 Frontend build completed successfully!"