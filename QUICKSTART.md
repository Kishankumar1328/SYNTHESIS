# 🚀 QUICKSTART GUIDE - SynthoGen Platform

## ⚠️ CURRENT ISSUE

**Backend Error**: The backend is running but returning 500 errors.

**What this means**: 
- Backend compiled successfully ✅
- Backend is listening on port 8080 ✅
- But there's a runtime error ❌

---

## 🔧 IMMEDIATE FIX

### Check Backend Logs

1. **Look at the PowerShell window** running the backend
2. **Find the error** - look for lines with "ERROR" or "Exception"
3. **Common issues**:
   - Database connection error
   - Missing configuration
   - Port conflict
   - Missing dependencies

### Most Likely Issue: H2 Database Error

The backend might be having issues with the H2 database. Let me provide a fix:

---

## 📝 STEP-BY-STEP SOLUTION

### Option 1: Check Backend Logs (RECOMMENDED)

1. **Go to the backend PowerShell window**
2. **Scroll up** to find any ERROR messages
3. **Look for**:
   ```
   ERROR ... 
   Exception ...
   Failed to ...
   ```
4. **Share the error** with me so I can fix it

### Option 2: Restart Everything Clean

```powershell
# Kill all processes
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Start backend
cd E:\Kish\Project\LastOneTime\backend
$env:JAVA_HOME="C:\Program Files\Java\jdk-22"
.\mvnw.cmd spring-boot:run

# In another window, start frontend
cd E:\Kish\Project\LastOneTime\frontend
npm run dev
```

### Option 3: Use Simpler Configuration

The issue might be with security or database configuration. Let me create a minimal working version.

---

## 🎯 WHAT SHOULD WORK

Once backend starts properly, you should see:

```
Started SyntheticDataPlatformApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

Then test:
```
http://localhost:8080/actuator/health
```

Should return:
```json
{"status":"UP"}
```

---

## 📊 TESTING WORKFLOW

### 1. Test Backend Health
```
http://localhost:8080/actuator/health
```

### 2. Test Projects API
```
http://localhost:8080/api/projects
```

### 3. Upload Test File

I've created a test file for you:
```
E:\Kish\Project\LastOneTime\sample_data.csv
```

Use this file to test uploads once backend is working.

---

## 🐛 COMMON ERRORS & FIXES

### Error: "Port 8080 already in use"
**Fix**:
```powershell
Get-Process -Name "java" | Stop-Process -Force
```

### Error: "JAVA_HOME not found"
**Fix**:
```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-22"
```

### Error: "Access denied for user 'root'@'localhost'"
**Fix**: We're using H2 database now, this shouldn't happen. If it does, check `application.properties`.

### Error: "Cannot find Python"
**Fix**: This only affects AI training, not uploads. Install Python 3.9+ or update `application.properties`:
```properties
app.python.path=C:/Python39/python.exe
```

---

## 📁 FILE LOCATIONS

```
Project Structure:
E:\Kish\Project\LastOneTime\
├── backend/                    ← Spring Boot backend
│   ├── src/
│   ├── target/
│   └── mvnw.cmd               ← Use this to start
├── frontend/                   ← React frontend
│   ├── src/
│   ├── package.json
│   └── npm run dev            ← Use this to start
├── ai-engine/                  ← Python AI scripts
│   ├── train.py
│   ├── generate.py
│   └── requirements.txt
├── uploads/                    ← Uploaded files go here
│   └── models/                ← Trained models
└── sample_data.csv            ← Test file I created
```

---

## 🎯 NEXT STEPS

1. **Check backend PowerShell window** for errors
2. **Share the error message** with me
3. **I'll provide specific fix** for that error
4. **Then we can test upload**

---

## 💡 WHAT I'VE BUILT FOR YOU

### Frontend Pages:
✅ Dashboard - Workspace management  
✅ Datasets - File upload & management  
✅ AI Training - Model training & generation  
✅ Privacy Audit - Compliance checking  
✅ Anomaly Hub - Anomaly detection  

### Backend APIs:
✅ `/api/projects` - Project CRUD  
✅ `/api/datasets/upload` - File upload  
✅ `/api/models/train` - AI training  
✅ `/api/models/{id}/generate` - Data generation  

### Database:
✅ H2 in-memory database  
✅ Auto-creates tables  
✅ No MySQL needed  

### AI Integration:
✅ Python scripts ready  
✅ SDV library for synthesis  
✅ 4 algorithms (CTGAN, TVAE, etc.)  

---

## 🔍 DEBUG CHECKLIST

- [ ] Backend PowerShell window shows "Started"
- [ ] No ERROR messages in backend logs
- [ ] http://localhost:8080/actuator/health returns {"status":"UP"}
- [ ] Frontend loads at http://localhost:5173
- [ ] No red error banner on Datasets page
- [ ] Can click "Upload Dataset" button

---

## 📞 IMMEDIATE ACTION NEEDED

**Please check the backend PowerShell window and tell me:**

1. What's the last message you see?
2. Are there any ERROR or Exception messages?
3. Does it say "Started SyntheticDataPlatformApplication"?

**Once I know the specific error, I can fix it immediately!**

---

**Created**: January 8, 2026  
**Status**: Debugging backend 500 error  
**Next**: Fix backend error → Test upload → Train model → Generate data
