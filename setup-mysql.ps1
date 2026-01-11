# MySQL Database Setup for SynthoGen Platform
# This script helps you set up the MySQL database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MySQL Database Setup" -ForegroundColor Cyan
Write-Host "  SynthoGen Enterprise Platform" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MySQL is installed
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERROR: MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host "Please install MySQL 8.0 or update the path in this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "MySQL found!" -ForegroundColor Green
Write-Host ""

# Get MySQL root password
Write-Host "Please enter your MySQL root password:" -ForegroundColor Yellow
Write-Host "(Press Enter if you don't have a password)" -ForegroundColor Gray
$password = Read-Host -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow
Write-Host ""

# SQL file path
$sqlFile = "E:\Kish\Project\LastOneTime\sql\COMPLETE_SETUP.sql"

# Run MySQL command
if ($plainPassword -eq "") {
    # No password
    & $mysqlPath -u root -e "SOURCE $sqlFile;"
}
else {
    # With password
    & $mysqlPath -u root -p"$plainPassword" -e "SOURCE $sqlFile;"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  DATABASE SETUP COMPLETE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login Credentials:" -ForegroundColor Cyan
    Write-Host "  Username: admin" -ForegroundColor White
    Write-Host "  Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Update backend config if you have MySQL password" -ForegroundColor Gray
    Write-Host "  2. Run: .\start-all.ps1" -ForegroundColor Gray
    Write-Host "  3. Open: http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
    
    # Ask if they need to update password in config
    if ($plainPassword -ne "") {
        Write-Host "NOTE: You have a MySQL password set." -ForegroundColor Yellow
        Write-Host "Do you want to update the backend configuration? (Y/N)" -ForegroundColor Yellow
        $updateConfig = Read-Host
        
        if ($updateConfig -eq "Y" -or $updateConfig -eq "y") {
            $configFile = "E:\Kish\Project\LastOneTime\backend\src\main\resources\application.properties"
            (Get-Content $configFile) -replace 'spring.datasource.password=', "spring.datasource.password=$plainPassword" | Set-Content $configFile
            Write-Host "Configuration updated!" -ForegroundColor Green
        }
    }
}
else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  SETUP FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Wrong MySQL password" -ForegroundColor Gray
    Write-Host "  2. MySQL service not running" -ForegroundColor Gray
    Write-Host "  3. Insufficient permissions" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Try running MySQL manually:" -ForegroundColor Yellow
    Write-Host "  1. Open 'MySQL 8.0 Command Line Client'" -ForegroundColor Gray
    Write-Host "  2. Enter password" -ForegroundColor Gray
    Write-Host "  3. Run: SOURCE $sqlFile;" -ForegroundColor Gray
}
