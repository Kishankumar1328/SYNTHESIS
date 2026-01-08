@echo off
echo ========================================
echo SynthoGen Enterprise Platform
echo Automated Startup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.9+
    pause
    exit /b 1
)
echo [OK] Python found

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found! Please install JDK 17+
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.
echo Creating storage directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\models" mkdir uploads\models
echo [OK] Storage directories ready

echo.
echo ========================================
echo Starting Backend (Spring Boot)...
echo ========================================
start "SynthoGen Backend" cmd /k "cd backend && mvnw.cmd spring-boot:run"

echo.
echo Waiting 45 seconds for backend to initialize...
timeout /t 45 /nobreak

echo.
echo ========================================
echo Starting Frontend (Vite)...
echo ========================================
start "SynthoGen Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8080
echo Health:   http://localhost:8080/actuator/health
echo.
echo Check the new terminal windows for logs.
echo Close those windows to stop the services.
echo.
pause
