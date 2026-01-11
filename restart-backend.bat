@echo off
echo ========================================
echo Restarting Backend with New Changes
echo ========================================
echo.

echo Stopping existing Java processes...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 3 /nobreak >nul

echo.
echo Starting Backend...
cd backend
start "Synthesis Backend" cmd /k "mvnw.cmd spring-boot:run"

echo.
echo Backend restarting in new window...
echo Wait ~30-45 seconds for it to fully initialize.
echo.
pause
