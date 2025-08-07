# Health Check Script for Define Strength Website (PowerShell)
# This script performs basic health checks for the deployed website

param(
    [string]$WebsiteUrl = "http://localhost:8080",
    [string]$ApiUrl = "http://localhost:3001"
)

Write-Host "Define Strength - Health Check Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Website URL: $WebsiteUrl" -ForegroundColor White
Write-Host "API URL: $ApiUrl" -ForegroundColor White
Write-Host ""

# Function to check HTTP status
function Test-HttpStatus {
    param(
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Checking $Description... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ OK ($($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ FAILED ($($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Function to check if content contains expected text
function Test-Content {
    param(
        [string]$Url,
        [string]$ExpectedText,
        [string]$Description
    )
    
    Write-Host "Checking $Description... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 10 -ErrorAction Stop
        if ($response.Content -like "*$ExpectedText*") {
            Write-Host "✅ OK" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ FAILED - expected text not found" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

# Function to test port connectivity
function Test-Port {
    param(
        [string]$ComputerName,
        [int]$Port
    )
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect($ComputerName, $Port)
        $tcpClient.Close()
        return $true
    } catch {
        return $false
    }
}

# Health Checks
Write-Host "Running Health Checks..." -ForegroundColor Yellow
Write-Host ""

# Website checks
Test-HttpStatus -Url $WebsiteUrl -Description "Website Home Page"
Test-HttpStatus -Url "$WebsiteUrl/shop" -Description "Shop Page"
Test-Content -Url $WebsiteUrl -ExpectedText "Define Strength" -Description "Website Title"

Write-Host ""

# API checks
$apiAccessible = $false
if ($ApiUrl -ne "http://localhost:3001" -or (Test-Port -ComputerName "localhost" -Port 3001)) {
    $apiAccessible = $true
    Write-Host "API Health Checks..." -ForegroundColor Yellow
    Test-HttpStatus -Url "$ApiUrl/health" -Description "API Health Endpoint"
    Test-HttpStatus -Url "$ApiUrl/api/products" -Description "Products API"
    Test-HttpStatus -Url "$ApiUrl/api/products/categories/all" -Description "Categories API"
} else {
    Write-Host "API server not accessible - skipping API checks" -ForegroundColor Yellow
}

Write-Host ""

# Performance checks
Write-Host "Performance Checks..." -ForegroundColor Yellow
Write-Host "Checking response time... " -NoNewline

try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri $WebsiteUrl -TimeoutSec 10 -ErrorAction Stop
    $stopwatch.Stop()
    $responseTime = $stopwatch.Elapsed.TotalSeconds
    
    if ($responseTime -lt 3) {
        Write-Host "✅ OK ($([math]::Round($responseTime, 2))s)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  SLOW ($([math]::Round($responseTime, 2))s)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
}

Write-Host ""

# Security checks
Write-Host "Security Checks..." -ForegroundColor Yellow
Write-Host "Checking security headers... " -NoNewline

try {
    $response = Invoke-WebRequest -Uri $WebsiteUrl -Method Head -TimeoutSec 10 -ErrorAction Stop
    $hasSecurityHeaders = $false
    
    foreach ($header in $response.Headers.Keys) {
        if ($header -match "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection") {
            $hasSecurityHeaders = $true
            break
        }
    }
    
    if ($hasSecurityHeaders) {
        Write-Host "✅ OK" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some security headers missing" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAILED (Error: $($_.Exception.Message))" -ForegroundColor Red
}

Write-Host ""
Write-Host "Health check completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Manual Checks Required:" -ForegroundColor Cyan
Write-Host "- Verify user registration works" -ForegroundColor White
Write-Host "- Verify user login works" -ForegroundColor White
Write-Host "- Verify shopping cart functionality" -ForegroundColor White
Write-Host "- Verify product search and filtering" -ForegroundColor White
Write-Host "- Test on mobile devices" -ForegroundColor White
Write-Host "- Verify payment processing (sandbox mode)" -ForegroundColor White
Write-Host ""
