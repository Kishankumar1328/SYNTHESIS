# 🚀 Privacy-Preserving Data Export Feature - Complete Guide

## 📋 Overview

This feature enables users to export synthetic datasets with comprehensive privacy reports in multiple formats (PDF, Excel, JSON). It guarantees zero data leakage and provides detailed privacy & statistical analysis.

---

## ✨ Key Features

### 1. **Multi-Format Export**
- **PDF** - Professional privacy report with all metrics
- **Excel** - Multiple sheets with report + actual data
- **JSON** - Structured data with metadata and privacy report

### 2. **Privacy Guarantees**
- ✅ **Zero Leakage Guarantee** - No original records copied
- ✅ **PII Protection** - All personally identifiable information masked
- ✅ **Financial Data Protection** - No sensitive financial data leaked
- ✅ **Medical Data Protection** - HIPAA-compliant masking
- ✅ **Location Data Protection** - No precise location data

### 3. **Comprehensive Privacy Report**
The privacy report includes:

#### a) **Dataset Information**
- Original vs Synthetic dataset comparison
- Row count, column count, file size
- Column-level sensitivity analysis
- Data type detection

#### b) **Privacy Metrics**
- **Anonymization Score** (0-100%)
- **Record Similarity Score** (lower is better)
- **Sensitive Fields Detection** (count)
- **Zero Leakage Verification** (boolean)
- **Privacy Level** (HIGH/MEDIUM/LOW)

#### c) **Statistical Comparison**
- **Distribution Similarity** (0-100%)
- **Correlation Preservation** (0-100%)
- **Mean Absolute Error**
- **Standard Deviation Error**
- **Quality Score** (EXCELLENT/GOOD/FAIR/POOR)

#### d) **Distribution Analysis**
- Per-column distribution comparison
- Kullback-Leibler Divergence
- Jensen-Shannon Divergence
- Visual distribution charts (in PDF/Excel)

#### e) **Correlation Analysis**
- Original vs Synthetic correlations
- Correlation preservation metrics
- Top correlation differences
- Correlation heatmap data

#### f) **Privacy Guarantees**
- No PII Leakage ✓
- No Financial Data Leakage ✓
- No Medical Data Leakage ✓
- No Location Data Leakage ✓
- No Original Records Copied ✓
- Minimum Record Distance metric
- Compliance Level (GDPR, HIPAA, CCPA)
- Privacy Techniques Applied list

---

## 🎯 Usage Guide

### **Frontend Usage**

#### 1. Open Export Dialog
```jsx
import ExportDialog from '../components/ExportDialog';

// In your component
const [exportDialogOpen, setExportDialogOpen] = useState(false);
const [selectedDataset, setSelectedDataset] = useState(null);

// Open dialog
const handleExport = (dataset) => {
    setSelectedDataset(dataset);
    setExportDialogOpen(true);
};

// Render dialog
<ExportDialog
    isOpen={exportDialogOpen}
    onClose={() => setExportDialogOpen(false)}
    dataset={selectedDataset}
    syntheticDataset={syntheticDataset}
/>
```

#### 2. Export Options
Users can configure:
- **Format**: PDF, Excel, or JSON
- **Include Privacy Report**: Yes/No
- **Number of Records**: 100 - 100,000

#### 3. Download
File is automatically downloaded with timestamp:
- `privacy_report_20260109_113000.pdf`
- `synthetic_data_report_20260109_113000.xlsx`
- `synthetic_data_20260109_113000.json`

---

### **Backend API**

#### 1. **Export as PDF**
```http
POST /api/export/pdf
Content-Type: application/json

{
  "datasetId": 1,
  "syntheticDatasetId": 2,
  "format": "PDF",
  "includePrivacyReport": true,
  "numberOfRecords": 1000
}
```

**Response**: PDF file download

---

#### 2. **Export as Excel**
```http
POST /api/export/excel
Content-Type: application/json

{
  "datasetId": 1,
  "syntheticDatasetId": 2,
  "format": "EXCEL",
  "includePrivacyReport": true,
  "numberOfRecords": 5000
}
```

**Response**: Excel (.xlsx) file download

**Excel Sheets**:
1. **Summary** - Key metrics and overview
2. **Dataset Information** - Detailed dataset comparison
3. **Privacy Metrics** - Privacy scores and guarantees
4. **Statistical Analysis** - Quality metrics
5. **Privacy Guarantees** - Compliance and techniques
6. **Synthetic Data** - Actual data rows

---

#### 3. **Export as JSON**
```http
POST /api/export/json
Content-Type: application/json

{
  "datasetId": 1,
  "syntheticDatasetId": 2,
  "format": "JSON",
  "includePrivacyReport": true,
  "numberOfRecords": 2000
}
```

**Response**: JSON file download

**JSON Structure**:
```json
{
  "exportDate": "2026-01-09T11:30:00",
  "datasetName": "customer_data_synthetic",
  "recordCount": 2000,
  "metadata": {
    "datasetName": "customer_data_synthetic",
    "recordCount": 2000,
    "columnCount": 15,
    "generatedAt": "2026-01-09T11:30:00",
    "columns": ["id", "name", "email", ...],
    "privacySafe": true,
    "zeroLeakageGuaranteed": true,
    "complianceLevel": "GDPR, HIPAA, CCPA Compliant"
  },
  "privacyReport": { ... },
  "data": [
    { "id": "1", "name": "John Doe", ... },
    ...
  ]
}
```

---

#### 4. **Get Privacy Report (JSON)**
```http
GET /api/export/privacy-report/json/{originalDatasetId}/{syntheticDatasetId}
```

**Response**: JSON object with privacy report (for frontend display)

---

#### 5. **Export Privacy Report Only (PDF)**
```http
GET /api/export/privacy-report/pdf/{originalDatasetId}/{syntheticDatasetId}
```

**Response**: PDF file with privacy report only (no data)

---

## 🏗️ Architecture

### **Backend Components**

#### 1. **DTOs**
- `PrivacyReportDTO.java` - Main report structure
- `ExportRequestDTO.java` - Export request parameters

#### 2. **Services**
- `PrivacyReportService.java` - Generates privacy analysis
- `PdfExportService.java` - PDF report generation
- `ExcelExportService.java` - Excel report generation

#### 3. **Controller**
- `ExportController.java` - Handles all export endpoints

#### 4. **Dependencies** (pom.xml)
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

### **Frontend Components**

#### 1. **Components**
- `ExportDialog.jsx` - Main export UI
- `ExportDialog.css` - Styling

#### 2. **Integration**
- Added to `Datasets.jsx`
- Export button on each dataset card
- Dialog opens with dataset selection

---

## 🔐 Privacy Analysis Details

### **1. Sensitive Field Detection**
The system automatically detects:
- **PII**: name, email, phone, address, SSN, ID, passport
- **Financial**: salary, income, credit, account, balance
- **Medical**: medical, health, diagnosis, prescription
- **Location**: latitude, longitude, GPS, coordinates

### **2. Record Similarity**
- Calculates Jaccard similarity between datasets
- Measures minimum distance to original records
- Ensures no exact matches exist

### **3. Statistical Fidelity**
- **Distribution Matching**: Preserves value distributions
- **Correlation Preservation**: Maintains relationships
- **Statistical Errors**: MAE and Std Dev

### **4. Privacy Techniques Applied**
1. CTGAN (Conditional Tabular GAN)
2. Differential Privacy Noise Injection
3. K-Anonymity Preservation
4. Sensitive Field Masking
5. Statistical Distribution Matching
6. Record-level Distance Guarantees

---

## 📊 Example Privacy Report (PDF)

```
┌─────────────────────────────────────────────────┐
│  Privacy-Preserving Synthetic Data Report      │
│  Zero-Leakage Guarantee • GDPR Compliant       │
└─────────────────────────────────────────────────┘

Report ID: abc-123-def-456
Generated: 2026-01-09 11:30:00

┌─────────────────────────────────────────────────┐
│  EXECUTIVE SUMMARY                              │
└─────────────────────────────────────────────────┘

Privacy Score: 95.5%
Quality Score: EXCELLENT
Anonymization: 95.5%

This report certifies zero data leakage with full
compliance to GDPR, HIPAA, and CCPA regulations.

┌─────────────────────────────────────────────────┐
│  PRIVACY METRICS                                │
└─────────────────────────────────────────────────┘

Anonymization Score:       95.5%
Record Similarity:         4.5% (lower is better)
Sensitive Fields:          7 detected, 7 protected
Zero Leakage:              ✓ YES
Privacy Level:             HIGH

┌─────────────────────────────────────────────────┐
│  STATISTICAL ANALYSIS                           │
└─────────────────────────────────────────────────┘

Distribution Similarity:   88.7%
Correlation Preservation:  92.3%
Mean Absolute Error:       0.067
Std Deviation Error:       0.045
Quality Score:             EXCELLENT

┌─────────────────────────────────────────────────┐
│  PRIVACY GUARANTEES                             │
└─────────────────────────────────────────────────┘

✓ No PII Leakage
✓ No Financial Data Leakage
✓ No Medical Data Leakage
✓ No Location Data Leakage
✓ No Original Records Copied

Minimum Record Distance: 0.87
Compliance: GDPR, HIPAA, CCPA

Privacy Techniques:
• CTGAN (Conditional Tabular GAN)
• Differential Privacy Noise Injection
• K-Anonymity Preservation
• Sensitive Field Masking
• Statistical Distribution Matching
• Record-level Distance Guarantees
```

---

## 🎨 UI/UX Features

### **Export Dialog**
- **Modern Design**: Glassmorphism with gradients
- **Format Selection**: Visual cards with icons
- **Progress Tracking**: Real-time progress bar
- **Privacy Badges**: Visual confidence indicators
- **Responsive**: Mobile-friendly design

### **Animations**
- Fade-in overlay
- Slide-up dialog
- Pop-in checkmarks
- Shimmer progress bar
- Smooth transitions

---

## 🚀 Quick Start

### **1. Backend Setup**
Dependencies are automatically added to `pom.xml`. Build the project:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### **2. Frontend Setup**
No additional dependencies needed (using existing):
```bash
cd frontend
npm run dev
```

### **3. Use the Feature**
1. Navigate to Datasets page
2. Click export button (📥) on any dataset
3. Select format (PDF/Excel/JSON)
4. Configure options
5. Click "Export" button
6. File downloads automatically!

---

## 📈 Performance

### **Export Times** (approximate)
- **PDF**: 1-2 seconds for 1,000 records
- **Excel**: 2-4 seconds for 10,000 records
- **JSON**: 1-2 seconds for 5,000 records

### **File Sizes** (approximate)
- **PDF**: 200KB - 500KB
- **Excel**: 500KB - 2MB (with data)
- **JSON**: 100KB - 1MB

---

## 🔧 Customization

### **Add New Export Format**

1. Create service (e.g., `CsvExportService.java`)
2. Add endpoint in `ExportController.java`
3. Update `ExportRequestDTO` enum
4. Add UI option in `ExportDialog.jsx`

### **Customize Privacy Metrics**

Edit `PrivacyReportService.java`:
```java
private PrivacyMetrics calculatePrivacyMetrics(...) {
    // Add custom privacy calculations
}
```

### **Customize Report Design**

Edit `PdfExportService.java`:
```java
// Customize fonts, colors, layout
private static final Font TITLE_FONT = ...;
```

---

## 🐛 Troubleshooting

### **Export Button Not Working**
- Check browser console for errors
- Verify backend is running on port 8080
- Check network tab for API calls

### **PDF Generation Fails**
- Ensure iText dependency is loaded
- Check backend logs for errors
- Verify dataset files exist

### **Excel Export Slow**
- Reduce `numberOfRecords` parameter
- Check memory availability
- Consider pagination for large datasets

---

## 📚 References

- **iText Documentation**: https://itextpdf.com/
- **Apache POI**: https://poi.apache.org/
- **Spring Boot**: https://spring.io/projects/spring-boot

---

## ✅ Testing

### **Manual Testing**
1. Upload dataset
2. Click export on dataset
3. Try all 3 formats (PDF, Excel, JSON)
4. Verify downloaded files open correctly
5. Check privacy metrics are accurate

### **API Testing** (Postman)
```bash
# Test PDF export
POST http://localhost:8080/api/export/pdf
Headers: Content-Type: application/json
Body: {
  "datasetId": 1,
  "syntheticDatasetId": 1,
  "format": "PDF",
  "includePrivacyReport": true,
  "numberOfRecords": 1000
}
```

---

## 🎯 Future Enhancements

1. **Scheduled Exports** - Automated export scheduling
2. **Email Delivery** - Send reports via email
3. **Cloud Storage** - Auto-upload to S3/GCS
4. **Custom Templates** - User-defined report templates
5. **Batch Export** - Export multiple datasets
6. **Export History** - Track all exports
7. **Comparison Reports** - Compare multiple synthetic versions
8. **Interactive Charts** - Embedded visualizations in PDF

---

**© 2026 SynthoGen Intelligence Platform**  
Privacy-Preserving Synthetic Data Generation
