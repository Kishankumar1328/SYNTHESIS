-- ========================================
-- SYNTHOGEN PLATFORM - COMPLETE DATABASE SETUP
-- ALL-IN-ONE SQL SCRIPT
-- Just copy-paste this entire file into MySQL!
-- ========================================

-- Drop existing database if you want a fresh start (OPTIONAL - UNCOMMENT IF NEEDED)
-- DROP DATABASE IF EXISTS synthetic_platform;

-- Create database
CREATE DATABASE IF NOT EXISTS synthetic_platform
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE synthetic_platform;

-- ========================================
-- TABLE 1: USERS
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    enabled BOOLEAN DEFAULT true,
    account_non_expired BOOLEAN DEFAULT true,
    account_non_locked BOOLEAN DEFAULT true,
    credentials_non_expired BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 2: USER_ROLES
-- ========================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 3: PROJECTS
-- ========================================
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 4: DATASETS
-- ========================================
CREATE TABLE IF NOT EXISTS datasets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL,
    file_size BIGINT,
    row_count INT,
    column_count INT,
    project_id BIGINT,
    user_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'UPLOADED',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    metadata JSON,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 5: AI_MODELS
-- ========================================
CREATE TABLE IF NOT EXISTS ai_models (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    algorithm VARCHAR(50) NOT NULL,
    dataset_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    model_path VARCHAR(500),
    status VARCHAR(50) DEFAULT 'PENDING',
    training_started_at TIMESTAMP NULL,
    training_completed_at TIMESTAMP NULL,
    training_duration BIGINT,
    epochs INT DEFAULT 300,
    batch_size INT DEFAULT 500,
    embedding_dim INT DEFAULT 128,
    accuracy DECIMAL(5,2),
    loss DECIMAL(10,4),
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 6: SYNTHETIC_DATASETS
-- ========================================
CREATE TABLE IF NOT EXISTS synthetic_datasets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    model_id BIGINT NOT NULL,
    original_dataset_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    file_path VARCHAR(500),
    record_count INT,
    privacy_score DECIMAL(5,2),
    quality_score DECIMAL(5,2),
    similarity_score DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'PENDING',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (model_id) REFERENCES ai_models(id) ON DELETE CASCADE,
    FOREIGN KEY (original_dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_model_id (model_id),
    INDEX idx_original_dataset_id (original_dataset_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 7: PRIVACY_AUDITS
-- ========================================
CREATE TABLE IF NOT EXISTS privacy_audits (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dataset_id BIGINT,
    synthetic_dataset_id BIGINT,
    user_id BIGINT NOT NULL,
    privacy_level VARCHAR(20),
    anonymization_score DECIMAL(5,2),
    leakage_detected BOOLEAN DEFAULT false,
    gdpr_compliant BOOLEAN DEFAULT true,
    hipaa_compliant BOOLEAN DEFAULT true,
    ccpa_compliant BOOLEAN DEFAULT true,
    sensitive_fields_count INT DEFAULT 0,
    pii_detected BOOLEAN DEFAULT false,
    phi_detected BOOLEAN DEFAULT false,
    financial_data_detected BOOLEAN DEFAULT false,
    audit_result JSON,
    audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (synthetic_dataset_id) REFERENCES synthetic_datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_synthetic_dataset_id (synthetic_dataset_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 8: EXPORT_LOGS
-- ========================================
CREATE TABLE IF NOT EXISTS export_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dataset_id BIGINT,
    synthetic_dataset_id BIGINT,
    user_id BIGINT NOT NULL,
    export_format VARCHAR(20) NOT NULL,
    file_path VARCHAR(500),
    file_size BIGINT,
    include_privacy_report BOOLEAN DEFAULT true,
    record_count INT,
    status VARCHAR(50) DEFAULT 'PENDING',
    exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE SET NULL,
    FOREIGN KEY (synthetic_dataset_id) REFERENCES synthetic_datasets(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_export_format (export_format)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 9: ANOMALY_DETECTIONS
-- ========================================
CREATE TABLE IF NOT EXISTS anomaly_detections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    dataset_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    anomaly_count INT DEFAULT 0,
    anomaly_percentage DECIMAL(5,2),
    detection_method VARCHAR(50),
    anomalies JSON,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 10: ACTIVITY_LOGS
-- ========================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 11: API_KEYS
-- ========================================
CREATE TABLE IF NOT EXISTS api_keys (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    secret_hash VARCHAR(255),
    enabled BOOLEAN DEFAULT true,
    rate_limit INT DEFAULT 1000,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_api_key (api_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 12: NOTIFICATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'NORMAL',
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLE 13: SYSTEM_SETTINGS
-- ========================================
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description VARCHAR(255),
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- INSERT ADMIN USER
-- Username: admin
-- Password: admin123 (BCrypt hashed)
-- ========================================
INSERT INTO users (username, email, password, full_name, enabled, created_at) 
VALUES ('admin', 'admin@synthogen.com', '$2a$10$XgrzDxF7mEBHJKJZGLuEuOCBbPJ.TYbOx7nxM6JWgZq6vF5pHGn8O', 'System Administrator', true, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Assign admin roles
INSERT INTO user_roles (user_id, role) 
SELECT id, 'ROLE_ADMIN' FROM users WHERE username='admin' 
ON DUPLICATE KEY UPDATE role=role;

INSERT INTO user_roles (user_id, role) 
SELECT id, 'ROLE_USER' FROM users WHERE username='admin' 
ON DUPLICATE KEY UPDATE role=role;

-- ========================================
-- VERIFICATION
-- ========================================
SELECT '========================================' as '';
SELECT 'DATABASE SETUP COMPLETE!' as 'STATUS';
SELECT '========================================' as '';
SELECT '' as '';

-- Show created tables
SELECT 'Tables Created:' as '';
SELECT TABLE_NAME as 'Table', TABLE_ROWS as 'Rows'
FROM information_schema.TABLES 
WHERE table_schema = 'synthetic_platform'
ORDER BY TABLE_NAME;

SELECT '' as '';
SELECT '========================================' as '';
SELECT 'ADMIN USER CREATED:' as '';
SELECT '========================================' as '';

-- Show admin user
SELECT 
    username as 'Username',
    email as 'Email',
    full_name as 'Full Name',
    enabled as 'Enabled'
FROM users 
WHERE username='admin';

SELECT '' as '';
SELECT 'Login Credentials:' as '';
SELECT 'Username: admin' as '';
SELECT 'Password: admin123' as '';
SELECT '' as '';
SELECT '========================================' as '';
SELECT 'READY TO USE!' as 'STATUS';
SELECT '========================================' as '';
SELECT '' as '';
SELECT 'Next Steps:' as '';
SELECT '1. Close backend terminal' as '';
SELECT '2. Run: cd backend && mvnw.cmd spring-boot:run' as '';
SELECT '3. Login at: http://localhost:5173' as '';
SELECT '4. Use credentials: admin / admin123' as '';
SELECT '========================================' as '';
