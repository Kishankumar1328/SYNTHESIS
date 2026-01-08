-- Synthetic Data Platform Database Schema
-- Database: synthetic_platform

CREATE DATABASE IF NOT EXISTS synthetic_platform;
USE synthetic_platform;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datasets Table
CREATE TABLE IF NOT EXISTS datasets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    name VARCHAR(255),
    file_path VARCHAR(255) NOT NULL,
    metadata JSON,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- AI Models Table
CREATE TABLE IF NOT EXISTS models (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dataset_id BIGINT NOT NULL,
    algorithm VARCHAR(50) NOT NULL, -- e.g., 'CTGAN', 'TVAE'
    status VARCHAR(20) NOT NULL,    -- PENDING, TRAINING, COMPLETED, FAILED
    model_file_path VARCHAR(255),
    training_metrics JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dataset FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE
);

-- Note: Synthetic batches are currently streamed directly to user, 
-- but a table can be added here for history tracking if needed.
