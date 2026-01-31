# ==========================================
# SYNTHESIS PLATFORM - DATABASE SETUP SCRIPT
# ==========================================
# This script sets up the authentication database for the platform
# ==========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SYNTHESIS Platform - Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MySQL credentials
$mysqlUser = "root"
$mysqlPassword = "root"
$mysqlHost = "localhost"
$mysqlPort = "3306"

Write-Host "Setting up authentication database..." -ForegroundColor Yellow
Write-Host ""

# SQL commands
$sqlCommands = @"
-- Drop and create database
DROP DATABASE IF EXISTS auth_platform;
CREATE DATABASE auth_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_platform;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(50) DEFAULT 'LOCAL',
    provider_id VARCHAR(255) DEFAULT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Roles Table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user_roles FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Username: admin, Password: admin123 (BCrypt encoded)
INSERT INTO users (username, email, password, full_name, auth_provider, enabled)
VALUES (
    'admin',
    'admin@synthesis.ai',
    '\$2a\$10\$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System Administrator',
    'LOCAL',
    TRUE
);

-- Insert admin roles
SET @admin_id = LAST_INSERT_ID();
INSERT INTO user_roles (user_id, role) VALUES (@admin_id, 'ROLE_ADMIN');
INSERT INTO user_roles (user_id, role) VALUES (@admin_id, 'ROLE_USER');

-- Verify setup
SELECT 'Database setup complete!' AS Status;
SELECT * FROM users;
SELECT * FROM user_roles;
"@

# Save SQL to temp file
$tempSqlFile = "$env:TEMP\synthesis_auth_setup.sql"
$sqlCommands | Out-File -FilePath $tempSqlFile -Encoding UTF8

try {
    # Try to find MySQL executable
    $mysqlPaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\xampp\mysql\bin\mysql.exe",
        "C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe"
    )

    $mysqlExe = $null
    foreach ($path in $mysqlPaths) {
        if (Test-Path $path) {
            $mysqlExe = $path
            break
        }
    }

    if (-not $mysqlExe) {
        Write-Host "MySQL executable not found in common locations." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run the following SQL commands manually in MySQL Workbench:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host $sqlCommands -ForegroundColor White
        Write-Host ""
        Write-Host "SQL file saved to: $tempSqlFile" -ForegroundColor Cyan
        exit 1
    }

    Write-Host "Found MySQL at: $mysqlExe" -ForegroundColor Green
    Write-Host "Executing SQL script..." -ForegroundColor Yellow
    Write-Host ""

    # Execute SQL
    & $mysqlExe -u $mysqlUser -p$mysqlPassword -h $mysqlHost -P $mysqlPort < $tempSqlFile

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Database setup completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Default admin credentials:" -ForegroundColor Cyan
        Write-Host "  Username: admin" -ForegroundColor White
        Write-Host "  Password: admin123" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host ""
        Write-Host "Error executing SQL script!" -ForegroundColor Red
        Write-Host "Please check MySQL credentials and try again." -ForegroundColor Red
        Write-Host ""
        Write-Host "SQL file saved to: $tempSqlFile" -ForegroundColor Cyan
        Write-Host "You can run it manually in MySQL Workbench." -ForegroundColor Yellow
    }
}
catch {
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "SQL file saved to: $tempSqlFile" -ForegroundColor Cyan
    Write-Host "Please run it manually in MySQL Workbench." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
