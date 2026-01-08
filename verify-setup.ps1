# SynthoGen Enterprise Platform - Connection Verification Script
# This script verifies all components are properly configured and connected

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 SynthoGen Connection Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

$allChecks = $true

# Function to test connection
function Test-Connection-Status {
    param($name, $test)
    Write-Host "Testing $name..." -NoNewline
    if ($test) {
        Write-Host " ✅ PASS" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host " ❌ FAIL" -ForegroundColor Red
        $script:allChecks = $false
        return $false
    }
}

Write-Host "1️⃣  SYSTEM REQUIREMENTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Check Python
Write-Host "Python 3.9+..." -NoNewline
try {
    $pythonVersion = python --version 2>&1
    if ($pythonVersion -match "Python (\d+)\.(\d+)") {
        $major = [int]$Matches[1]
        $minor = [int]$Matches[2]
        if ($major -ge 3 -and $minor -ge 9) {
            Write-Host " ✅ $pythonVersion" -ForegroundColor Green
        }
        else {
            Write-Host " ⚠️  $pythonVersion (requires 3.9+)" -ForegroundColor Yellow
            $allChecks = $false
        }
    }
}
catch {
    Write-Host " ❌ Not found" -ForegroundColor Red
    $allChecks = $false
}

# Check Java
Write-Host "Java JDK 17+..." -NoNewline
try {
    $javaVersion = java -version 2>&1 | Out-String
    if ($javaVersion -match "version `"(\d+)") {
        $version = [int]$Matches[1]
        if ($version -ge 17) {
            Write-Host " ✅ Java $version" -ForegroundColor Green
        }
        else {
            Write-Host " ⚠️  Java $version (requires 17+)" -ForegroundColor Yellow
            $allChecks = $false
        }
    }
}
catch {
    Write-Host " ❌ Not found" -ForegroundColor Red
    $allChecks = $false
}

# Check Node.js
Write-Host "Node.js 18+..." -NoNewline
try {
    $nodeVersion = node --version
    if ($nodeVersion -match "v(\d+)") {
        $version = [int]$Matches[1]
        if ($version -ge 18) {
            Write-Host " ✅ $nodeVersion" -ForegroundColor Green
        }
        else {
            Write-Host " ⚠️  $nodeVersion (requires 18+)" -ForegroundColor Yellow
            $allChecks = $false
        }
    }
}
catch {
    Write-Host " ❌ Not found" -ForegroundColor Red
    $allChecks = $false
}

# Check MySQL
Write-Host "MySQL Server..." -NoNewline
try {
    $mysqlVersion = mysql --version 2>&1
    Write-Host " ✅ Found" -ForegroundColor Green
}
catch {
    Write-Host " ⚠️  Not in PATH (may still be installed)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "2️⃣  PYTHON DEPENDENCIES (AI Engine)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$requiredPackages = @("sdv", "pandas", "numpy", "scikit-learn", "sdmetrics")
foreach ($package in $requiredPackages) {
    Write-Host "$package..." -NoNewline
    $installed = pip list 2>&1 | Select-String $package
    if ($installed) {
        Write-Host " ✅ Installed" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        $allChecks = $false
    }
}

Write-Host ""
Write-Host "3️⃣  PROJECT STRUCTURE" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Check directories
$directories = @(
    @{Path = "backend"; Name = "Backend directory" },
    @{Path = "frontend"; Name = "Frontend directory" },
    @{Path = "ai-engine"; Name = "AI Engine directory" },
    @{Path = "sql"; Name = "SQL scripts directory" },
    @{Path = "uploads"; Name = "Storage directory" }
)

foreach ($dir in $directories) {
    Write-Host "$($dir.Name)..." -NoNewline
    if (Test-Path (Join-Path $scriptPath $dir.Path)) {
        Write-Host " ✅ Exists" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        if ($dir.Path -eq "uploads") {
            Write-Host "   Creating uploads directory..." -ForegroundColor Yellow
            New-Item -ItemType Directory -Path (Join-Path $scriptPath "uploads") -Force | Out-Null
            New-Item -ItemType Directory -Path (Join-Path $scriptPath "uploads\models") -Force | Out-Null
        }
        else {
            $allChecks = $false
        }
    }
}

Write-Host ""
Write-Host "4️⃣  AI ENGINE SCRIPTS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$scripts = @("train.py", "generate.py", "stats.py", "evaluate.py", "requirements.txt")
foreach ($script in $scripts) {
    Write-Host "$script..." -NoNewline
    if (Test-Path (Join-Path $scriptPath "ai-engine\$script")) {
        Write-Host " ✅ Exists" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        $allChecks = $false
    }
}

Write-Host ""
Write-Host "5️⃣  BACKEND CONFIGURATION" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$propsFile = Join-Path $scriptPath "backend\src\main\resources\application.properties"
Write-Host "application.properties..." -NoNewline
if (Test-Path $propsFile) {
    Write-Host " ✅ Exists" -ForegroundColor Green
    
    $content = Get-Content $propsFile -Raw
    
    # Check critical settings
    Write-Host "  Database URL..." -NoNewline
    if ($content -match "spring.datasource.url=") {
        Write-Host " ✅ Configured" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        $allChecks = $false
    }
    
    Write-Host "  Python path..." -NoNewline
    if ($content -match "app.python.path=") {
        Write-Host " ✅ Configured" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        $allChecks = $false
    }
    
    Write-Host "  Storage location..." -NoNewline
    if ($content -match "app.storage.location=") {
        Write-Host " ✅ Configured" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        $allChecks = $false
    }
    
    Write-Host "  AI engine path..." -NoNewline
    if ($content -match "app.ai.engine.path=") {
        Write-Host " ✅ Configured" -ForegroundColor Green
    }
    else {
        Write-Host " ❌ Missing" -ForegroundColor Red
        $allChecks = $false
    }
}
else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""
Write-Host "6️⃣  FRONTEND CONFIGURATION" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$viteConfig = Join-Path $scriptPath "frontend\vite.config.js"
Write-Host "vite.config.js..." -NoNewline
if (Test-Path $viteConfig) {
    Write-Host " ✅ Exists" -ForegroundColor Green
    
    $content = Get-Content $viteConfig -Raw
    Write-Host "  API proxy..." -NoNewline
    if ($content -match "proxy.*'/api'") {
        Write-Host " ✅ Configured" -ForegroundColor Green
    }
    else {
        Write-Host " ⚠️  Not found" -ForegroundColor Yellow
    }
}
else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    $allChecks = $false
}

$packageJson = Join-Path $scriptPath "frontend\package.json"
Write-Host "package.json..." -NoNewline
if (Test-Path $packageJson) {
    Write-Host " ✅ Exists" -ForegroundColor Green
}
else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""
Write-Host "7️⃣  DATABASE SCHEMA" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$schemaFile = Join-Path $scriptPath "sql\schema.sql"
Write-Host "schema.sql..." -NoNewline
if (Test-Path $schemaFile) {
    Write-Host " ✅ Exists" -ForegroundColor Green
}
else {
    Write-Host " ❌ Missing" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allChecks) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 Ready to start the application!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Ensure MySQL is running and database is created" -ForegroundColor Gray
    Write-Host "2. Update backend/src/main/resources/application.properties with MySQL password" -ForegroundColor Gray
    Write-Host "3. Run: .\start-all.ps1" -ForegroundColor Cyan
}
else {
    Write-Host "⚠️  SOME CHECKS FAILED" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please fix the issues above before starting the application." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Yellow
    Write-Host "- Install missing Python packages: cd ai-engine; pip install -r requirements.txt" -ForegroundColor Gray
    Write-Host "- Configure application.properties with correct MySQL password" -ForegroundColor Gray
    Write-Host "- Ensure all required software is installed and in PATH" -ForegroundColor Gray
}
Write-Host ""
Write-Host "Verification complete." -ForegroundColor Gray

