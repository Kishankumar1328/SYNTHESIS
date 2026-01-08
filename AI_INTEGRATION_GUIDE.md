# 🤖 AI Model Integration Guide

## ✅ Complete Integration Status

Your frontend, backend, and AI engine are now **fully connected**! Here's what you can do:

---

## 🎯 Complete Workflow

```
1. Upload Dataset → 2. Train AI Model → 3. Generate Synthetic Data → 4. Download Results
```

---

## 📊 Available Features

### 1. **Dataset Upload** ✅
**Page**: http://localhost:5173/datasets

**What it does**:
- Upload CSV, JSON, or Excel files
- Store datasets for AI training
- Manage and delete datasets

**API Endpoint**: `POST /api/datasets/upload`

---

### 2. **AI Model Training** ✅
**Page**: http://localhost:5173/ai-training

**What it does**:
- Train AI models on your datasets
- Choose from 4 algorithms (CTGAN, TVAE, GaussianCopula, CopulaGAN)
- Configure hyperparameters (epochs, batch size, learning rate)
- Monitor training status in real-time
- View all trained models

**How to use**:
1. Select a dataset from the dropdown
2. Choose an algorithm (CTGAN recommended)
3. Adjust hyperparameters (optional)
4. Click "Start Training"
5. Wait for training to complete (status updates every 5 seconds)

**API Endpoints**:
- `POST /api/ai/train` - Start training
- `GET /api/ai/model/{modelId}/status` - Check status
- `GET /api/ai/dataset/{datasetId}/models` - List models

**Algorithms**:
- **CTGAN** (Recommended): Best for tabular data, handles mixed types well
- **TVAE**: Faster training, good for continuous data
- **GaussianCopula**: Fast, good for simple datasets
- **CopulaGAN**: Hybrid approach, good balance

**Hyperparameters**:
- **Epochs** (default: 300): Higher = better quality, longer training
- **Batch Size** (default: 500): Lower = more stable, slower
- **Learning Rate** (default: 0.0002): Controls training speed

---

### 3. **Synthetic Data Generation** ✅
**Page**: http://localhost:5173/ai-training (after training)

**What it does**:
- Generate synthetic data from trained models
- Specify number of records to generate
- Download as CSV file

**How to use**:
1. Wait for model training to complete
2. Click "Generate Data" button on a completed model
3. Enter number of records (e.g., 1000)
4. Download the generated CSV file

**API Endpoint**: `POST /api/ai/generate`

---

### 4. **Privacy Audit (CPS)** ✅
**Page**: http://localhost:5173/security

**What it does**:
- Analyze datasets for privacy compliance
- Detect PII (Personally Identifiable Information)
- GDPR compliance checking
- Data anonymization verification

**API Endpoint**: `POST /api/ai/privacy-audit`

---

### 5. **Anomaly Detection** ✅
**Page**: http://localhost:5173/anomalies

**What it does**:
- Detect statistical outliers
- Find unusual patterns
- Identify data quality issues
- Spot potential fraud

**API Endpoint**: `POST /api/ai/anomaly-detection`

---

### 6. **Dataset Statistics** ✅
**What it does**:
- Get detailed statistics about your dataset
- Column analysis
- Data type detection
- Missing value detection

**API Endpoint**: `GET /api/ai/dataset/{datasetId}/stats`

---

### 7. **Model Evaluation** ✅
**What it does**:
- Evaluate model quality
- Compare synthetic vs real data
- Get quality metrics

**API Endpoint**: `POST /api/ai/model/{modelId}/evaluate`

---

## 🔌 API Integration Map

### Frontend → Backend → AI Engine

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  Frontend   │─────▶│   Backend   │─────▶│  AI Engine  │
│  (React)    │      │   (Java)    │      │  (Python)   │
└─────────────┘      └─────────────┘      └─────────────┘
     ▲                     │                     │
     │                     │                     │
     └─────────────────────┴─────────────────────┘
              Data Flow & Results
```

### API Endpoints Created:

#### **AI Controller** (`/api/ai/*`)
```
POST   /api/ai/train                      - Train new model
GET    /api/ai/model/{id}/status          - Get training status
POST   /api/ai/generate                   - Generate synthetic data
GET    /api/ai/dataset/{id}/stats         - Get dataset statistics
POST   /api/ai/model/{id}/evaluate        - Evaluate model quality
GET    /api/ai/dataset/{id}/models        - List models for dataset
POST   /api/ai/privacy-audit              - Run privacy audit
POST   /api/ai/anomaly-detection          - Detect anomalies
```

#### **Dataset Controller** (`/api/datasets/*`)
```
POST   /api/datasets/upload               - Upload dataset
GET    /api/datasets/project/{id}         - Get datasets by project
GET    /api/datasets/{id}/stats           - Get dataset stats
DELETE /api/datasets/{id}                 - Delete dataset
```

---

## 🐍 Python AI Scripts

Located in: `ai-engine/`

### 1. **train.py**
Trains AI models using SDV library

**Usage**:
```bash
python train.py --data dataset.csv --output model.pkl --algorithm CTGAN --epochs 300
```

**Algorithms Supported**:
- CTGAN
- TVAE
- GaussianCopula
- CopulaGAN

### 2. **generate.py**
Generates synthetic data from trained models

**Usage**:
```bash
python generate.py --model model.pkl --count 1000 --output synthetic.csv
```

### 3. **stats.py**
Calculates dataset statistics

**Usage**:
```bash
python stats.py --data dataset.csv
```

**Returns**: JSON with column stats, data types, missing values

### 4. **evaluate.py**
Evaluates model quality

**Usage**:
```bash
python evaluate.py --model model.pkl --original dataset.csv --samples 1000
```

**Returns**: Quality metrics comparing synthetic vs real data

---

## 🚀 Quick Start Guide

### Step 1: Upload a Dataset
1. Go to http://localhost:5173/datasets
2. Click upload area
3. Select a CSV file
4. Wait for upload to complete

### Step 2: Train AI Model
1. Go to http://localhost:5173/ai-training
2. Select your uploaded dataset
3. Choose algorithm (CTGAN recommended)
4. Click "Start Training"
5. Wait for training to complete (status updates automatically)

### Step 3: Generate Synthetic Data
1. Once training is complete, click "Generate Data"
2. Enter number of records (e.g., 1000)
3. Click OK
4. Download the generated CSV file

### Step 4: Analyze Results
1. Upload the generated file back to Datasets
2. Run Privacy Audit to verify privacy compliance
3. Run Anomaly Detection to check data quality

---

## 📦 Dependencies

### Backend (Java)
- Spring Boot 3.2.0
- H2 Database (in-memory)
- Lombok
- JPA/Hibernate

### AI Engine (Python)
```
sdv==1.32.0
pandas==2.0.3
numpy==1.24.3
scikit-learn==1.3.0
sdmetrics==0.12.1
```

### Frontend (React)
- React 18.2.0
- React Router 6.20.0
- Axios 1.6.0
- Lucide React (icons)
- TailwindCSS

---

## 🔧 Configuration

### Backend Configuration
**File**: `backend/src/main/resources/application.properties`

```properties
# Python Path
app.python.path=python

# AI Engine Path
app.ai.engine.path=../ai-engine

# Storage Location
app.storage.location=uploads
```

### Frontend Configuration
**File**: `frontend/src/api/index.js`

```javascript
const api = axios.create({
    baseURL: '/api',  // Backend API base URL
    headers: {
        'Content-Type': 'application/json'
    }
});
```

---

## 🎯 Training Status Flow

```
PENDING → TRAINING → COMPLETED
                  ↘ FAILED
```

**Status Descriptions**:
- **PENDING**: Model created, waiting to start
- **TRAINING**: Currently training (can take 5-30 minutes)
- **COMPLETED**: Training finished, ready to generate data
- **FAILED**: Training failed, check backend logs

---

## 📊 Data Flow Example

### Complete Example: Fraud Detection Dataset

1. **Upload Dataset**
   ```
   POST /api/datasets/upload
   File: fraud_transactions.csv (10,000 rows)
   ```

2. **Train Model**
   ```
   POST /api/ai/train
   {
     "datasetId": 1,
     "algorithm": "CTGAN",
     "hyperparameters": {
       "epochs": 300,
       "batch_size": 500,
       "learning_rate": 0.0002
     }
   }
   ```

3. **Check Status** (every 5 seconds)
   ```
   GET /api/ai/model/1/status
   Response: { "status": "TRAINING" }
   ```

4. **Generate Data** (after completion)
   ```
   POST /api/ai/generate
   {
     "modelId": 1,
     "count": 5000
   }
   Downloads: synthetic_fraud_data.csv
   ```

5. **Evaluate Quality**
   ```
   POST /api/ai/model/1/evaluate?sampleCount=1000
   Returns: Quality metrics JSON
   ```

---

## 🐛 Troubleshooting

### Training Fails
**Problem**: Model status shows "FAILED"

**Solutions**:
1. Check backend logs for Python errors
2. Ensure Python dependencies are installed:
   ```bash
   cd ai-engine
   pip install -r requirements.txt
   ```
3. Verify Python path in `application.properties`
4. Check dataset format (must be CSV with headers)

### Generation Fails
**Problem**: "Model not yet trained" error

**Solutions**:
1. Wait for training to complete
2. Check model status is "COMPLETED"
3. Verify model file exists in `uploads/models/`

### Slow Training
**Problem**: Training takes too long

**Solutions**:
1. Reduce epochs (try 100 instead of 300)
2. Increase batch size (try 1000)
3. Use TVAE or GaussianCopula (faster algorithms)
4. Reduce dataset size

### Python Not Found
**Problem**: "python: command not found"

**Solutions**:
1. Install Python 3.9+
2. Add Python to PATH
3. Update `app.python.path` in `application.properties`:
   ```properties
   app.python.path=C:/Python39/python.exe
   ```

---

## 📈 Performance Tips

### For Better Quality:
- ✅ Use CTGAN algorithm
- ✅ Increase epochs (500-1000)
- ✅ Use smaller batch size (250-500)
- ✅ Clean your data before upload

### For Faster Training:
- ✅ Use TVAE or GaussianCopula
- ✅ Reduce epochs (100-200)
- ✅ Increase batch size (1000+)
- ✅ Use smaller datasets

### For Privacy:
- ✅ Run Privacy Audit before sharing
- ✅ Use data anonymization
- ✅ Remove PII before upload
- ✅ Evaluate synthetic data quality

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Datasets upload successfully
2. ✅ Training status changes from PENDING → TRAINING → COMPLETED
3. ✅ "Generate Data" button appears on completed models
4. ✅ Synthetic CSV file downloads successfully
5. ✅ Generated data has similar structure to original

---

## 📞 Support

### Check Logs:
- **Backend**: Terminal window running Spring Boot
- **Frontend**: Browser console (F12)
- **AI Engine**: Backend logs show Python output

### Common Issues:
1. Port conflicts (8080, 5173)
2. Python dependencies missing
3. Database connection issues
4. File permissions

---

**Version**: 1.0.0  
**Last Updated**: January 8, 2026  
**Status**: ✅ Fully Integrated and Operational
