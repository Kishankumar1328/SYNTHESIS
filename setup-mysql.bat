@echo off
REM ========================================
REM MySQL Database Setup Script
REM SynthoGen Platform
REM ========================================

echo.
echo ========================================
echo SynthoGen - MySQL Database Setup
echo ========================================
echo.

REM Check if MySQL is installed
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] MySQL not found!
    echo.
    echo Please install MySQL 8.0+ from:
    echo https://dev.mysql.com/downloads/mysql/
    echo.
    pause
    exit /b 1
)

echo [OK] MySQL found
echo.

REM Get MySQL root password
set /p MYSQL_PASSWORD="Enter MySQL root password: "
echo.

echo ========================================
echo Step 1: Creating Database...
echo ========================================
mysql -u root -p%MYSQL_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS synthetic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create database!
    pause
    exit /b 1
)
echo [OK] Database created
echo.

echo ========================================
echo Step 2: Creating Tables...
echo ========================================
mysql -u root -p%MYSQL_PASSWORD% synthetic_platform < sql/schema.sql
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create tables!
    pause
    exit /b 1
)
echo [OK] Tables created
echo.

echo ========================================
echo Step 3: Insert Sample Data? (Y/N)
echo ========================================
set /p LOAD_SAMPLE="Load sample data (admin user + test data)? [Y/N]: "

if /i "%LOAD_SAMPLE%"=="Y" (
    echo Loading sample data...
    mysql -u root -p%MYSQL_PASSWORD% synthetic_platform < sql/seed_data.sql
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to load sample data!
        pause
        exit /b 1
    )
    echo [OK] Sample data loaded
    echo.
) else (
    echo Skipping sample data...
    echo.
    echo Creating admin user manually...
    mysql -u root -p%MYSQL_PASSWORD% synthetic_platform -e "INSERT INTO users (username, email, password, full_name, enabled) VALUES ('admin', 'admin@synthogen.com', '$2a$10$XgrzDxF7mEBHJKJZGLuEuOCBbPJ.TYbOx7nxM6JWgZq6vF5pHGn8O', 'System Administrator', true) ON DUPLICATE KEY UPDATE email=email;"
    mysql -u root -p%MYSQL_PASSWORD% synthetic_platform -e "INSERT INTO user_roles (user_id, role) SELECT id, 'ROLE_ADMIN' FROM users WHERE username='admin' ON DUPLICATE KEY UPDATE role=role;"
    mysql -u root -p%MYSQL_PASSWORD% synthetic_platform -e "INSERT INTO user_roles (user_id, role) SELECT id, 'ROLE_USER' FROM users WHERE username='admin' ON DUPLICATE KEY UPDATE role=role;"
    echo [OK] Admin user created
    echo.
)

echo ========================================
echo Step 4: Updating Configuration...
echo ========================================
echo.
echo Please update backend/src/main/resources/application.properties
echo.
echo Replace H2 configuration with MySQL:
echo.
echo   spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform
echo   spring.datasource.username=root
echo   spring.datasource.password=%MYSQL_PASSWORD%
echo   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
echo   spring.jpa.hibernate.ddl-auto=update
echo   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
echo.
echo OR copy the pre-configured file:
echo   copy backend\src\main\resources\application-mysql.properties backend\src\main\resources\application.properties
echo   (Don't forget to update YOUR_MYSQL_ROOT_PASSWORD in the file!)
echo.

echo ========================================
echo Step 5: Verifying Installation...
echo ========================================
mysql -u root -p%MYSQL_PASSWORD% synthetic_platform -e "SELECT COUNT(*) as TableCount FROM information_schema.tables WHERE table_schema = 'synthetic_platform';"
mysql -u root -p%MYSQL_PASSWORD% synthetic_platform -e "SELECT username, email, full_name FROM users WHERE username='admin';"
echo.

echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Database: synthetic_platform
echo Tables: 14 created
echo Views: 3 created
echo Procedures: 2 created
echo.
echo Default Login:
echo   Username: admin
echo   Password: admin123
echo.
echo Next Steps:
echo 1. Update application.properties with MySQL configuration
echo 2. Start backend: cd backend ^&^& mvnw.cmd spring-boot:run
echo 3. Access: http://localhost:8080
echo.
echo Documentation: MYSQL_SETUP_GUIDE.md
echo.
pause
