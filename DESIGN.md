# Synthetic Data Generation Platform - Design Specification

## 1. System Architecture

**Overview**
The platform follows a layered micro-service style architecture (logically separated) to ensure scalability and separation of concerns.

```mermaid
graph TD
    Client[React Frontend] <-->|REST API| API[Spring Boot Backend]
    API <-->|JDBC| DB[(MySQL Database)]
    API <-->|Shell/Process| AI[AI Engine (Python)]
    AI <-->|Read/Write| FS[File System / Storage]
    API <-->|Read/Write| FS
```

**Technology Stack**
- **Frontend**: React 18, TailwindCSS, Vite, Recharts/Chart.js for visualization.
- **Backend**: Java 17+, Spring Boot 3.x, Spring Security, Spring Data JPA.
- **Database**: MySQL 8.0.
- **AI Engine**: Python 3.9+, SDV (Synthetic Data Vault), CTGAN, Pandas, Numpy.

---

## 2. Database Schema (MySQL)

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE datasets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    name VARCHAR(100),
    file_path VARCHAR(255) NOT NULL, -- Path to uploaded CSV/Parquet
    metadata JSON, -- Column types, statistical summary
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE models (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dataset_id BIGINT NOT NULL,
    algorithm VARCHAR(50) NOT NULL, -- 'CTGAN', 'TVAE', 'GaussianCopula'
    status VARCHAR(20) NOT NULL, -- 'PENDING', 'TRAINING', 'COMPLETED', 'FAILED'
    model_file_path VARCHAR(255),
    training_metrics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id)
);

CREATE TABLE synthetic_batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_id BIGINT NOT NULL,
    file_path VARCHAR(255),
    row_count INT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES models(id)
);
```

---

## 3. REST API Specification

**Authentication**
- `POST /api/auth/login` - JWT Token exchange.
- `POST /api/auth/register` - User onboarding.

**Data Management**
- `POST /api/projects` - Create new workspace.
- `POST /api/datasets/upload` - Multipart file upload. Parse header/types.
- `GET /api/datasets/{id}/stats` - Returns distributions for visualization.

**AI Operations**
- `POST /api/models/train`
    - Body: `{ "datasetId": 1, "algorithm": "CTGAN", "epochs": 300 }`
    - Returns: Job ID.
- `GET /api/models/{id}/status` - Polling for training completion.
- `POST /api/generate`
    - Body: `{ "modelId": 5, "count": 1000, "anomalies": { "inject": true, "ratio": 0.01 } }`
- `GET /api/synthetic/{batchId}/download` - Stream generated file.

**Evaluation**
- `GET /api/models/{id}/evaluation` - Returns quality report (KS-Test, Correlation comparison).

---

## 4. AI Engine Pipeline (Python)

The AI Engine operates as a CLI toolwrapper invoked by Spring Boot.

**Modules:**
1.  **`train.py`**:
    -   Inputs: `--data <path> --config <json>`
    -   Action: Loads data, trains CTGAN/TVAE model, saves `.pkl`.
    -   Output: Model file, training logs.

2.  **`generate.py`**:
    -   Inputs: `--model <path> --count <n> --output <path>`
    -   Action: Loads model, samples data.
    -   Constraint: Applies post-processing for logic (min/max bounds).

3.  **`evaluate.py`**:
    -   Inputs: `--real <path> --synthetic <path>`
    -   Action: Runs `sdmetrics` reports.
    -   Output: JSON report (Quality Score, Privacy Score).

---

## 5. Frontend Dashboard Components

1.  **ProjectWorkspace**: Sidebar navigation for Projects.
2.  **DataUpload**: Drag-and-drop zone with immediate column type inference preview.
3.  **TrainingConfig**: Form to select Hyperparameters (Epochs, Batch Size).
4.  **MetricVisualizer**:
    -   Overlay histograms (Real vs Synthetic).
    -   Correlation Heatmap comparison.
5.  **DownloadCenter**: formatting options (CSV, JSON, SQL).
