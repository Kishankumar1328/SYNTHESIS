# 🚀 Complete Application Startup Guide

## Overview
This guide will help you connect and run the **Frontend + Backend + AI Model** components of the SynthoGen Enterprise Platform.

---

## 📋 Architecture Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│   Backend       │─────▶│   AI Engine     │
│   (React/Vite)  │      │   (Spring Boot) │      │   (Python/SDV)  │
│   Port: 5173    │      │   Port: 8080    │      │   (Scripts)     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   MySQL DB      │
                         │   Port: 3306    │
                         └─────────────────┘
```

### Connection Flow:
1. **Frontend** → **Backend**: HTTP requests via `/api` proxy (configured in `vite.config.js`)
2. **Backend** → **Database**: JDBC connection (configured in `application.properties`)
3. **Backend** → **AI Engine**: Python subprocess calls to `train.py`, `generate.py`, `stats.py`, `evaluate.py`

---

## ✅ Pre-Flight Checklist

### 1. Verify Python Installation & Dependencies
```bash
# Check Python version (requires 3.9+)
python --version

# Install AI engine dependencies
cd ai-engine
pip install -r requirements.txt

# Verify SDV installation
pip list | findstr sdv
```

**Expected Output**: `sdv 1.32.0` (or similar)

### 2. Verify MySQL Database
```bash
# Check if MySQL is running
mysql --version

# Login to MySQL
mysql -u root -p
```

**In MySQL console, run:**
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS synthetic_platform;
USE synthetic_platform;

-- Run schema
SOURCE E:/Kish/Project/LastOneTime/sql/schema.sql;

-- Verify tables
SHOW TABLES;
```

**Expected Output**: `projects`, `datasets`, `models`

### 3. Verify Java & Maven
```bash
# Check Java version (requires JDK 17+)
java -version

# Check Maven (optional, can use wrapper)
mvn -version
```

### 4. Verify Node.js
```bash
# Check Node version (requires 18+)
node --version

# Check npm
npm --version
```

---

## 🔧 Configuration Steps

### Step 1: Configure Backend
Edit `backend/src/main/resources/application.properties`:

```properties
# Database Configuration - UPDATE THESE!
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE

# Python Path - UPDATE THIS!
# Option 1: If python is in PATH
app.python.path=python

# Option 2: Full path to python executable
# app.python.path=C:\\Python313\\python.exe

# Storage Location - UPDATE THIS!
app.storage.location=E:/Kish/Project/LastOneTime/uploads

# AI Engine Path (relative to backend)
app.ai.engine.path=../ai-engine
```

### Step 2: Create Storage Directory
```bash
# Create uploads directory
mkdir E:\Kish\Project\LastOneTime\uploads
mkdir E:\Kish\Project\LastOneTime\uploads\models
```

---

## 🚀 Starting the Application

### Option A: Automated Startup (Recommended)

**Use the PowerShell script below** (save as `start-all.ps1`):

```powershell
# Start all services
Write-Host "🚀 Starting SynthoGen Enterprise Platform..." -ForegroundColor Cyan

# 1. Start Backend
Write-Host "`n📦 Starting Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw.cmd spring-boot:run"

# Wait for backend to start
Write-Host "⏳ Waiting 30 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 2. Start Frontend
Write-Host "`n🎨 Starting Frontend (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
```

**Run it:**
```bash
.\start-all.ps1
```

---

### Option B: Manual Startup (Step-by-Step)

#### Terminal 1: Start Backend
```bash
cd backend

# Option 1: Using Maven Wrapper (No Maven installation needed)
.\mvnw.cmd clean spring-boot:run

# Option 2: Using Maven (if installed)
# mvn clean spring-boot:run
```

**Wait for this message:**
```
Started SyntheticDataPlatformApplication in X.XXX seconds
```

#### Terminal 2: Start Frontend
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Wait for this message:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
```

---

## 🔍 Verification & Testing

### 1. Backend Health Check
Open browser: http://localhost:8080/actuator/health

**Expected Response:**
```json
{
  "status": "UP"
}
```

### 2. Frontend Access
Open browser: http://localhost:5173

**Expected**: Login page should load

### 3. API Connection Test
Open browser console (F12) and check Network tab when navigating the app.

**Expected**: API calls to `/api/*` should return 200 OK

### 4. AI Engine Test
After logging in, try:
1. Create a new project
2. Upload a CSV dataset
3. Click "View Stats" - This calls `stats.py`

**Expected**: Statistics dashboard should display

### 5. Full Integration Test
1. **Train a model**: Select dataset → Train Model → Choose CTGAN
   - Backend calls `ai-engine/train.py`
   - Model saved to `uploads/models/model_X.pkl`
   
2. **Generate data**: Select trained model → Generate Data
   - Backend calls `ai-engine/generate.py`
   - CSV file downloads

---

## 🐛 Troubleshooting

### Issue 1: Backend won't start - "Port 8080 already in use"
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

### Issue 2: Backend can't connect to MySQL
**Check:**
- MySQL service is running: `services.msc` → MySQL80
- Database exists: `SHOW DATABASES;` in MySQL
- Username/password correct in `application.properties`

### Issue 3: Backend can't find Python
**Solution:**
```properties
# In application.properties, use full path:
app.python.path=C:\\Users\\ADMIN\\AppData\\Local\\Programs\\Python\\Python313\\python.exe
```

**Find Python path:**
```bash
where python
```

### Issue 4: AI scripts fail - "Module not found"
```bash
cd ai-engine
pip install --upgrade sdv pandas numpy scikit-learn sdmetrics
```

### Issue 5: Frontend can't reach backend
**Check:**
1. Backend is running on port 8080
2. `vite.config.js` has correct proxy:
```javascript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
        }
    }
}
```

### Issue 6: CORS errors
**Check:** Backend controllers have `@CrossOrigin` annotation
- `AIModelController.java` - Line 22
- `DatasetController.java` - Line 15

---

## 📊 Monitoring Logs

### Backend Logs
```bash
# In backend terminal, you'll see:
# - SQL queries (if spring.jpa.show-sql=true)
# - AI script outputs
# - API request logs
```

### Frontend Logs
```bash
# In frontend terminal, you'll see:
# - Vite dev server logs
# - Hot reload notifications
```

### Browser Console
```bash
# Press F12 → Console tab
# - API errors
# - React warnings
```

---

## 🎯 Quick Test Workflow

1. **Start Backend** → Wait for "Started" message
2. **Start Frontend** → Wait for Vite ready
3. **Open** http://localhost:5173
4. **Login** (if auth is enabled)
5. **Create Project** → "Test Project"
6. **Upload Dataset** → Use sample CSV from `datasets/` folder
7. **View Stats** → Verify AI engine connection
8. **Train Model** → CTGAN, 100 epochs (for quick test)
9. **Generate Data** → 100 rows
10. **Download** → Verify CSV file

---

## 🔐 Default Credentials (if auth enabled)

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change in production!**

---

## 📁 Important File Paths

| Component | Path | Purpose |
|-----------|------|---------|
| Backend Config | `backend/src/main/resources/application.properties` | Database, Python, Storage |
| Frontend Config | `frontend/vite.config.js` | API proxy |
| AI Scripts | `ai-engine/*.py` | ML operations |
| Database Schema | `sql/schema.sql` | Table definitions |
| Storage | `uploads/` | Datasets & models |

---

## 🎓 Next Steps After Successful Connection

1. **Read Documentation**:
   - `OPTIMIZATION_GUIDE.md` - Tune model hyperparameters
   - `SECURITY.md` - Production security
   - `DEPLOYMENT.md` - Deploy to production

2. **Explore Features**:
   - Multi-algorithm support (CTGAN, TVAE, GaussianCopula, CopulaGAN)
   - Anomaly injection
   - Model evaluation metrics

3. **Customize**:
   - Add authentication
   - Adjust UI theme
   - Configure caching (Redis)

---

## ✅ Success Indicators

You've successfully connected everything when:

- ✅ Backend starts without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ Can create projects and upload datasets
- ✅ Stats calculation works (AI engine connected)
- ✅ Model training completes (check `uploads/models/`)
- ✅ Data generation downloads CSV file

---

**🎉 Congratulations! Your full-stack AI platform is now running!**

For issues, check logs in:
- Backend terminal
- Frontend terminal  
- Browser console (F12)
- MySQL logs
