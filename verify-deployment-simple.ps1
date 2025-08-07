# Pre-Deployment Verification Script (PowerShell)
# Run this script before deploying to production

Write-Host "Pre-Deployment Verification - Define Strength" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if all required files exist
Write-Host "Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "vite.config.ts", 
    ".env.production",
    "Dockerfile",
    "nginx.conf",
    "README.md",
    "DEPLOYMENT.md"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (missing)" -ForegroundColor Red
        $missingFiles += $file
    }
}

Write-Host ""

# Check environment configuration
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.production") {
    Write-Host "✅ Production environment file exists" -ForegroundColor Green
    $envContent = Get-Content ".env.production" -Raw
    if ($envContent -match "VITE_API_BASE_URL=(.+)") {
        $apiUrl = $matches[1]
        Write-Host "✅ API URL configured: $apiUrl" -ForegroundColor Green
        
        if ($apiUrl -like "*localhost*") {
            Write-Host "⚠️  WARNING: API URL still points to localhost - update for production!" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ VITE_API_BASE_URL not found in .env.production" -ForegroundColor Red
    }
} else {
    Write-Host "❌ .env.production file missing" -ForegroundColor Red
}

Write-Host ""

# Summary
Write-Host "Pre-Deployment Summary" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ All required files present" -ForegroundColor Green
} else {
    Write-Host "❌ Missing files: $($missingFiles -join ', ')" -ForegroundColor Red
}

if (Test-Path ".env.production") {
    Write-Host "✅ Environment configuration ready" -ForegroundColor Green
} else {
    Write-Host "❌ Environment configuration missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure API backend is deployed and accessible" -ForegroundColor White
Write-Host "2. Update VITE_API_BASE_URL in .env.production" -ForegroundColor White
Write-Host "3. Choose deployment method" -ForegroundColor White
Write-Host "4. Deploy and run health checks" -ForegroundColor White
Write-Host ""

if (($missingFiles.Count -eq 0) -and (Test-Path ".env.production")) {
    Write-Host "Ready for deployment!" -ForegroundColor Green
} else {
    Write-Host "Issues detected - resolve before deployment" -ForegroundColor Yellow
}
