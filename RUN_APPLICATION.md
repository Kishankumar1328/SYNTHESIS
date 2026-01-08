# 🚀 Quick Start - Running the Complete Application

## ✅ Current Status

Your project has the following components:
- ✅ **Frontend**: React + Vite (Port 5173)
- ✅ **Backend**: Spring Boot (Port 8080)
- ✅ **AI Engine**: Python scripts with SDV 1.32.0
- ✅ **Database**: MySQL schema ready

## 📋 Before You Start

### 1. Verify Python Dependencies (Already Installed ✅)
```bash
cd ai-engine
pip list | findstr sdv
```
**Expected**: `sdv 1.32.0`

### 2. Configure Database Password
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

### 3. Ensure MySQL is Running
- Start MySQL service
- Create database:
```sql
CREATE DATABASE IF NOT EXISTS synthetic_platform;
USE synthetic_platform;
SOURCE E:/Kish/Project/LastOneTime/sql/schema.sql;
```

## 🚀 Starting the Application

### Option 1: Automated Startup (Recommended)
Double-click `start-all.bat` or run:
```bash
.\start-all.bat
```

This will:
1. Check prerequisites
2. Create storage directories
3. Start backend in a new window
4. Wait 45 seconds
5. Start frontend in a new window

### Option 2: Manual Startup

#### Terminal 1: Backend
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
Wait for: `Started SyntheticDataPlatformApplication`

#### Terminal 2: Frontend
```bash
cd frontend
npm install  # First time only
npm run dev
```
Wait for: `Local: http://localhost:5173/`

## 🔗 Connection Architecture

```
Frontend (React)          Backend (Spring Boot)       AI Engine (Python)
Port: 5173         →      Port: 8080           →      Scripts: train.py, generate.py
                                                       
vite.config.js            application.properties       requirements.txt
proxy: /api → 8080        python.path=python          sdv==1.32.0
                          ai.engine.path=../ai-engine
                                 ↓
                          MySQL Database
                          Port: 3306
                          DB: synthetic_platform
```

## 🧪 Testing the Connection

### 1. Backend Health Check
Open: http://localhost:8080/actuator/health
**Expected**: `{"status":"UP"}`

### 2. Frontend Access
Open: http://localhost:5173
**Expected**: Application loads

### 3. Full Integration Test
1. Create a new project
2. Upload a CSV dataset
3. Click "View Stats" → This calls `ai-engine/stats.py`
4. Train a model → This calls `ai-engine/train.py`
5. Generate data → This calls `ai-engine/generate.py`

## 🔍 Verifying Each Connection

### Frontend → Backend
- **Config**: `frontend/vite.config.js` (lines 14-19)
- **Test**: Open browser console (F12), check Network tab for `/api/*` calls
- **Expected**: Status 200 OK

### Backend → Database
- **Config**: `backend/src/main/resources/application.properties` (lines 4-6)
- **Test**: Backend logs should show "HikariPool-1 - Start completed"
- **Expected**: No connection errors

### Backend → AI Engine
- **Config**: `application.properties` (lines 32-33)
  - `app.python.path=python`
  - `app.ai.engine.path=../ai-engine`
- **Test**: Upload dataset and click "View Stats"
- **Expected**: Statistics display (proves `stats.py` executed)

## 📁 Key Files for Connection

| Component | File | Purpose |
|-----------|------|---------|
| Frontend Proxy | `frontend/vite.config.js` | Routes `/api` to backend |
| Backend Config | `backend/src/main/resources/application.properties` | All backend settings |
| AI Scripts | `ai-engine/*.py` | ML operations |
| Database Schema | `sql/schema.sql` | Table structure |

## 🐛 Troubleshooting

### Issue: Backend won't start - "Port 8080 in use"
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Issue: Backend can't connect to MySQL
**Check:**
1. MySQL service is running: `services.msc` → MySQL80
2. Database exists: `SHOW DATABASES;`
3. Password is correct in `application.properties`

### Issue: Backend can't find Python
**Solution**: Use full path in `application.properties`:
```properties
app.python.path=C:\\Users\\ADMIN\\AppData\\Local\\Programs\\Python\\Python313\\python.exe
```
Find path: `where python`

### Issue: AI scripts fail - "Module not found"
```bash
cd ai-engine
pip install -r requirements.txt
```

### Issue: Frontend can't reach backend
**Check:**
1. Backend is running on port 8080
2. `vite.config.js` has proxy configuration
3. No CORS errors in browser console

## 📊 Monitoring

### Backend Logs
Check the terminal where backend is running for:
- SQL queries
- AI script outputs (prefixed with `[AI-TRAIN-*]`, `[AI-GEN-*]`)
- API requests

### Frontend Logs
- Terminal: Vite dev server logs
- Browser Console (F12): React errors, API calls

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can create projects
- [ ] Can upload datasets
- [ ] Stats calculation works (AI engine connected)
- [ ] Model training completes
- [ ] Data generation downloads CSV

## 🎯 Next Steps

Once everything is running:
1. Read `OPTIMIZATION_GUIDE.md` for model tuning
2. Read `SECURITY.md` for production deployment
3. Explore all 4 AI algorithms (CTGAN, TVAE, GaussianCopula, CopulaGAN)

## 📞 Quick Reference

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/actuator/health
- **Storage**: `uploads/` (datasets and models)
- **Logs**: Check terminal windows

---

**🎉 Your full-stack AI platform is ready to run!**
