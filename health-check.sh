#!/bin/bash

# Health Check Script for Define Strength Website
# This script performs basic health checks for the deployed website

echo "🏋️ Define Strength - Health Check Script"
echo "========================================"

# Configuration
WEBSITE_URL="${1:-http://localhost:8080}"
API_URL="${2:-http://localhost:3001}"

echo "Website URL: $WEBSITE_URL"
echo "API URL: $API_URL"
echo ""

# Function to check HTTP status
check_http_status() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description... "
    
    if command -v curl > /dev/null 2>&1; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
        if [ "$status_code" = "200" ]; then
            echo "✅ OK ($status_code)"
            return 0
        else
            echo "❌ FAILED ($status_code)"
            return 1
        fi
    else
        echo "⚠️  curl not found - skipping"
        return 0
    fi
}

# Function to check if content contains expected text
check_content() {
    local url=$1
    local expected_text=$2
    local description=$3
    
    echo -n "Checking $description... "
    
    if command -v curl > /dev/null 2>&1; then
        content=$(curl -s "$url")
        if echo "$content" | grep -q "$expected_text"; then
            echo "✅ OK"
            return 0
        else
            echo "❌ FAILED - expected text not found"
            return 1
        fi
    else
        echo "⚠️  curl not found - skipping"
        return 0
    fi
}

# Health Checks
echo "🔍 Running Health Checks..."
echo ""

# Website checks
check_http_status "$WEBSITE_URL" "Website Home Page"
check_http_status "$WEBSITE_URL/shop" "Shop Page"
check_content "$WEBSITE_URL" "Define Strength" "Website Title"

echo ""

# API checks (if API URL is provided and accessible)
if [ "$API_URL" != "http://localhost:3001" ] || nc -z localhost 3001 2>/dev/null; then
    echo "🔗 API Health Checks..."
    check_http_status "$API_URL/health" "API Health Endpoint"
    check_http_status "$API_URL/api/products" "Products API"
    check_http_status "$API_URL/api/products/categories/all" "Categories API"
else
    echo "⚠️  API server not accessible - skipping API checks"
fi

echo ""

# Performance checks
echo "⚡ Performance Checks..."
if command -v curl > /dev/null 2>&1; then
    echo -n "Checking response time... "
    response_time=$(curl -o /dev/null -s -w "%{time_total}" "$WEBSITE_URL")
    if [ "${response_time%.*}" -lt 3 ]; then
        echo "✅ OK (${response_time}s)"
    else
        echo "⚠️  SLOW (${response_time}s)"
    fi
else
    echo "⚠️  curl not found - skipping performance checks"
fi

echo ""

# Security checks
echo "🔒 Security Checks..."
if command -v curl > /dev/null 2>&1; then
    echo -n "Checking security headers... "
    headers=$(curl -s -I "$WEBSITE_URL")
    
    if echo "$headers" | grep -qi "x-frame-options\|x-content-type-options"; then
        echo "✅ OK"
    else
        echo "⚠️  Some security headers missing"
    fi
else
    echo "⚠️  curl not found - skipping security checks"
fi

echo ""
echo "🎉 Health check completed!"
echo ""
echo "📋 Manual Checks Required:"
echo "- Verify user registration works"
echo "- Verify user login works" 
echo "- Verify shopping cart functionality"
echo "- Verify product search and filtering"
echo "- Test on mobile devices"
echo "- Verify payment processing (sandbox mode)"
echo ""
