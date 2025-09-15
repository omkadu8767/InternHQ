#!/bin/bash

# Build script for Render static site deployment

echo "Starting build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building Vue.js application..."
npm run build

# Copy built files to serve them
echo "Build completed successfully!"
echo "Built files are in the 'dist' directory"

# Verify build
if [ -d "dist" ]; then
    echo "✅ Build successful - dist directory created"
    echo "📁 Files in dist:"
    ls -la dist/
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi