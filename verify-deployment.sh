#!/bin/bash

# Pre-Deployment Verification Script
# Run this script before deploying to production

echo "🔍 Define Strength - Pre-Deployment Verification"
echo "================================================"
echo ""

# Check if all required files exist
echo "📁 Checking required files..."
required_files=(
    "package.json"
    "vite.config.ts"
    ".env.production"
    "Dockerfile"
    "nginx.conf"
    "README.md"
    "DEPLOYMENT.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        missing_files+=("$file")
    fi
done

echo ""

# Check environment configuration
echo "🔧 Checking environment configuration..."
if [ -f ".env.production" ]; then
    echo "✅ Production environment file exists"
    if grep -q "VITE_API_BASE_URL" .env.production; then
        api_url=$(grep "VITE_API_BASE_URL" .env.production | cut -d'=' -f2)
        echo "✅ API URL configured: $api_url"
        
        if [[ "$api_url" == *"localhost"* ]]; then
            echo "⚠️  WARNING: API URL still points to localhost - update for production!"
        fi
    else
        echo "❌ VITE_API_BASE_URL not found in .env.production"
    fi
else
    echo "❌ .env.production file missing"
fi

echo ""

# Check build
echo "🏗️  Testing production build..."
if npm run build:prod > /dev/null 2>&1; then
    echo "✅ Production build successful"
    
    # Check dist folder
    if [ -d "dist" ]; then
        echo "✅ Build output directory exists"
        
        # Check key files in dist
        if [ -f "dist/index.html" ]; then
            echo "✅ index.html generated"
        else
            echo "❌ index.html missing from build"
        fi
        
        # Check bundle size
        bundle_size=$(du -sh dist 2>/dev/null | cut -f1)
        echo "📦 Bundle size: $bundle_size"
    else
        echo "❌ Build output directory missing"
    fi
else
    echo "❌ Production build failed"
fi

echo ""

# Check dependencies
echo "📦 Checking dependencies..."
if npm list > /dev/null 2>&1; then
    echo "✅ All dependencies installed correctly"
else
    echo "❌ Dependency issues detected - run 'npm install'"
fi

echo ""

# Summary
echo "📋 Pre-Deployment Summary"
echo "========================"

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing files: ${missing_files[*]}"
fi

if [ -f ".env.production" ] && [ -d "dist" ]; then
    echo "✅ Build and environment ready"
else
    echo "❌ Build or environment issues detected"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Ensure API backend is deployed and accessible"
echo "2. Update VITE_API_BASE_URL in .env.production"
echo "3. Choose deployment method (Docker, Netlify, Vercel, etc.)"
echo "4. Deploy and run health checks"
echo ""

if [ ${#missing_files[@]} -eq 0 ] && [ -f ".env.production" ] && [ -d "dist" ]; then
    echo "🎉 Ready for deployment!"
    exit 0
else
    echo "⚠️  Issues detected - resolve before deployment"
    exit 1
fi
