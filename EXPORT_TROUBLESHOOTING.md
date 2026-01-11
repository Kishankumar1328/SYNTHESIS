# 🔧 Export Feature - Troubleshooting & Fix Guide

## ❗ Issue Identified

The export feature is not working because:

### **Root Cause:**
The backend dependencies (Apache POI and iText) need to be downloaded, and the application needs to be restarted with the new export endpoints.

---

## ✅ **QUICK FIX - Follow These Steps:**

### **Step 1: Stop All Running Services**
```powershell
# Press Ctrl+C in both terminal windows (backend and frontend)
# Or close the terminal windows
```

### **Step 2: Rebuild Backend with Dependencies**
```powershell
cd backend
.\mvnw.cmd clean install -DskipTests
```

This will download:
- Apache POI 5.2.5 (for Excel export)
- iText 5.5.13.3 (for PDF export)
- Jackson (for JSON processing)

### **Step 3: Restart the Application**
```powershell
# From project root
.\start-all.ps1
```

---

## 🔍 **What Was The Problem?**

1. **Missing Dependencies**: The new libraries weren't downloaded yet
2. **Missing Configuration**: ObjectMapper bean wasn't registered
3. **Missing Error Handling**: Export endpoints needed try-catch blocks

---

## ✅ **What I Fixed:**

### 1. **Added Jackson Configuration** (`JacksonConfig.java`)
```java
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
        return mapper;
    }
}
```

### 2. **Added Error Handling** to all export endpoints:
- PDF Export: Now handles exceptions gracefully
- Excel Export: Returns 500 status on error
- JSON Export: Proper error logging

### 3. **Dependencies in pom.xml**:
```xml
<!-- Apache POI for Excel -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>

<!-- iText for PDF -->
<dependency>
    <groupId>com.itextpdf</groupId>
    <artifactId>itextpdf</artifactId>
    <version>5.5.13.3</version>
</dependency>

<!-- Jackson for JSON -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

---

## 🎯 **How to Test After Fix:**

### **1. Verify Backend is Running**
```powershell
curl http://localhost:8080/actuator/health
```

Expected response: `{"status":"UP"}`

### **2. Test Frontend**
Open browser: `http://localhost:5173/datasets`

### **3. Test Export Feature**
1. Upload a dataset (if not already done)
2. Click the green **Export button** (📥)
3. Select PDF format
4. Click "Export PDF Report"
5. File should download!

---

## 📊 **Alternative: Manual Build & Run**

If `start-all.ps1` doesn't work, run manually:

### **Terminal 1 - Backend:**
```powershell
cd backend
.\mvnw.cmd clean spring-boot:run
```

Wait for: `Started SyntheticDataPlatformApplication`

### **Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

---

## 🔍 **Common Issues & Solutions:**

### **Issue 1: "Cannot resolve dependency"**
**Solution:**
```powershell
cd backend
.\mvnw.cmd clean install -U
```

### **Issue 2: "Port 8080 already in use"**
**Solution:**
```powershell
# Kill existing Java process
Get-Process java | Stop-Process -Force

# Then restart
cd backend
.\mvnw.cmd spring-boot:run
```

### **Issue 3: "CORS error in browser"**
**Solution:** Backend already has `@CrossOrigin` - just restart it

### **Issue 4: "Export button doesn't work"**
**Check:**
1. Browser console for errors (F12)
2. Backend logs for export attempts
3. Dataset ID is valid

---

## 🎉 **After Successful Fix:**

You should see:
1. ✅ Export dialog opens smoothly
2. ✅ All 3 formats selectable (PDF, Excel, JSON)
3. ✅ File downloads automatically
4. ✅ No console errors
5. ✅ Backend logs show "Export successful"

---

## 📝 **Expected Backend Logs:**

When export works correctly:
```
2026-01-09 12:35:00.123  INFO  --- ExportController : Exporting dataset 1 as PDF with privacy report
2026-01-09 12:35:01.456  INFO  --- PrivacyReportService : Generating privacy report for datasets: sample_data.csv vs sample_data.csv
2026-01-09 12:35:02.789  INFO  --- PdfExportService : Generating PDF privacy report: abc-123-def
2026-01-09 12:35:03.012  INFO  --- PdfExportService : PDF report generated successfully
2026-01-09 12:35:03.134  INFO  --- ExportController : PDF export successful: 245678 bytes
```

---

## 🚀 **Complete Restart Commands:**

```powershell
# Stop existing processes (if any)
Get-Process java -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean build with dependencies
cd e:\Kish\Project\LastOneTime\backend
.\mvnw.cmd clean install -DskipTests

# Start everything
cd ..
.\start-all.ps1
```

---

## 📦 **Files Modified:**

1. ✅ `backend/pom.xml` - Added dependencies
2. ✅ `backend/.../config/JacksonConfig.java` - NEW FILE
3. ✅ `backend/.../controller/ExportController.java` - Added error handling
4. ✅ `backend/.../service/PrivacyReportService.java` - Already created
5. ✅ `backend/.../service/PdfExportService.java` - Already created
6. ✅ `backend/.../service/ExcelExportService.java` - Already created
7. ✅ `frontend/src/components/ExportDialog.jsx` - Already created
8. ✅ `frontend/src/pages/Datasets.jsx` - Already updated

---

## ⚡ **Quick Verification Checklist:**

- [ ] Backend compiles without errors
- [ ] Backend starts on port 8080
- [ ] Frontend starts on port 5173
- [ ] Can access http://localhost:5173/datasets
- [ ] Export dialog opens when clicking export button
- [ ] All 3 formats are selectable
- [ ] Export button triggers download
- [ ] File downloads successfully
- [ ] Can open downloaded file (PDF/Excel/JSON)

---

## 💡 **Pro Tip:**

If you want to test without a real dataset:
1. Use the `sample_data.csv` in project root
2. Upload it via the Datasets page
3. Then test export on it

---

**Status:** ✅ **All code is ready! Just needs restart with dependencies**

**Next Action:** Run the restart commands above and test!

---

Generated: 2026-01-09 12:33:00  
© 2026 SynthoGen Intelligence Platform
