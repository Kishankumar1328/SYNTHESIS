@echo off
echo ========================================
echo SynthoGen - MySQL Connection Fix
echo ========================================
echo.

echo This script will help you connect to MySQL
echo.

REM Check if MySQL is installed
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] MySQL is not installed or not in PATH
    echo.
    echo OPTIONS:
    echo.
    echo 1. Install MySQL 8.0 from: https://dev.mysql.com/downloads/mysql/
    echo    OR
    echo 2. Install XAMPP (includes MySQL): https://www.apachefriends.org/
    echo    OR  
    echo 3. Use the existing H2 database (temporary, data lost on restart)
    echo.
    echo After installing MySQL, run this script again.
    echo.
    pause
    exit /b 1
)

echo [OK] MySQL found!
echo.

echo ========================================
echo Setting up MySQL Database
echo ========================================
echo.

set /p MYSQL_PASSWORD="Enter your MySQL root password (press Enter if no password): "
echo.

echo Creating database and admin user...
echo.

REM Try to run quick setup
mysql -u root -p%MYSQL_PASSWORD% < sql\quick_setup.sql 2>mysql_error.log

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! MySQL is now configured
    echo ========================================
    echo.
    echo Database: synthetic_platform
    echo Admin User: admin
    echo Admin Password: admin123
    echo.
    echo The backend is now configured to use MySQL.
    echo.
    echo Next: Restart your backend
    echo   1. Close the backend window
    echo   2. Run: cd backend
    echo   3. Run: mvnw.cmd spring-boot:run
    echo.
    echo Then login with: admin / admin123
    echo.
) else (
    echo.
    echo [ERROR] Failed to setup MySQL
    echo.
    echo Check mysql_error.log for details
    echo.
    echo Common issues:
    echo - Wrong password
    echo - MySQL service not running
    echo - Permission denied
    echo.
    echo To start MySQL service:
    echo   net start MySQL80
    echo.
)

pause
