-- ========================================
-- SynthoGen Platform - Seed Data
-- Version: 1.0.0
-- Database: synthetic_platform
-- ========================================

USE synthetic_platform;

-- ========================================
-- 1. INSERT DEFAULT ROLES
-- ========================================
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Administrator with full system access'),
('ROLE_USER', 'Regular user with standard access'),
('ROLE_DATA_SCIENTIST', 'User with advanced AI/ML features'),
('ROLE_VIEWER', 'Read-only access to datasets and reports')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ========================================
-- 2. INSERT DEFAULT ADMIN USER
-- Password: admin123 (BCrypt hashed)
-- ========================================
INSERT INTO users (username, email, password, full_name, enabled, created_at) VALUES
('admin', 'admin@synthogen.com', '$2a$10$XgrzDxF7mEBHJKJZGLuEuOCBbPJ.TYbOx7nxM6JWgZq6vF5pHGn8O', 'System Administrator', true, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Get admin user ID
SET @admin_id = (SELECT id FROM users WHERE username = 'admin');

-- Assign ADMIN and USER roles to admin
INSERT INTO user_roles (user_id, role) VALUES
(@admin_id, 'ROLE_ADMIN'),
(@admin_id, 'ROLE_USER')
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- ========================================
-- 3. INSERT SAMPLE USERS
-- All using password: password123 (BCrypt hashed)
-- ========================================
INSERT INTO users (username, email, password, full_name, enabled, created_at) VALUES
('john.doe', 'john.doe@example.com', '$2a$10$5K8BJn5GjH7Ot9L3hQbG8.1WYHkJNPbC3qP8vGxXdH5mXJY9zY3Xu', 'John Doe', true, CURRENT_TIMESTAMP),
('jane.smith', 'jane.smith@example.com', '$2a$10$5K8BJn5GjH7Ot9L3hQbG8.1WYHkJNPbC3qP8vGxXdH5mXJY9zY3Xu', 'Jane Smith', true, CURRENT_TIMESTAMP),
('data.scientist', 'scientist@example.com', '$2a$10$5K8BJn5GjH7Ot9L3hQbG8.1WYHkJNPbC3qP8vGxXdH5mXJY9zY3Xu', 'Data Scientist', true, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Get sample user IDs
SET @john_id = (SELECT id FROM users WHERE username = 'john.doe');
SET @jane_id = (SELECT id FROM users WHERE username = 'jane.smith');
SET @scientist_id = (SELECT id FROM users WHERE username = 'data.scientist');

-- Assign roles to sample users
INSERT INTO user_roles (user_id, role) VALUES
(@john_id, 'ROLE_USER'),
(@jane_id, 'ROLE_USER'),
(@scientist_id, 'ROLE_DATA_SCIENTIST'),
(@scientist_id, 'ROLE_USER')
ON DUPLICATE KEY UPDATE role = VALUES(role);

-- ========================================
-- 4. INSERT SAMPLE PROJECTS/WORKSPACES
-- ========================================
INSERT INTO projects (name, description, user_id, status, created_at) VALUES
('Customer Analytics', 'Synthetic customer data for marketing analysis', @admin_id, 'ACTIVE', CURRENT_TIMESTAMP),
('Healthcare Research', 'Privacy-safe patient data for medical research', @scientist_id, 'ACTIVE', CURRENT_TIMESTAMP),
('Financial Modeling', 'Transaction data for fraud detection', @john_id, 'ACTIVE', CURRENT_TIMESTAMP),
('Testing Sandbox', 'Experimental workspace for testing new features', @admin_id, 'ACTIVE', CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ========================================
-- 5. INSERT SAMPLE DATASETS
-- ========================================
SET @project1_id = (SELECT id FROM projects WHERE name = 'Customer Analytics' LIMIT 1);
SET @project2_id = (SELECT id FROM projects WHERE name = 'Healthcare Research' LIMIT 1);
SET @project3_id = (SELECT id FROM projects WHERE name = 'Financial Modeling' LIMIT 1);

INSERT INTO datasets (name, description, file_path, file_type, file_size, row_count, column_count, project_id, user_id, status, uploaded_at, metadata) VALUES
('Customer Demographics', 'Customer age, location, and preferences data', '/uploads/customer_demographics.csv', 'CSV', 524288, 10000, 15, @project1_id, @admin_id, 'PROCESSED', CURRENT_TIMESTAMP, '{"has_pii": true, "sensitive_columns": ["email", "phone"]}'),
('Patient Records', 'Anonymized patient health records', '/uploads/patient_records.csv', 'CSV', 1048576, 5000, 25, @project2_id, @scientist_id, 'PROCESSED', CURRENT_TIMESTAMP, '{"has_phi": true, "sensitive_columns": ["patient_id", "diagnosis"]}'),
('Transaction History', 'Credit card transaction data', '/uploads/transactions.csv', 'CSV', 2097152, 50000, 12, @project3_id, @john_id, 'PROCESSED', CURRENT_TIMESTAMP, '{"has_financial": true, "sensitive_columns": ["card_number", "amount"]}'),
('Product Catalog', 'E-commerce product information', '/uploads/products.json', 'JSON', 262144, 2000, 8, @project1_id, @admin_id, 'UPLOADED', CURRENT_TIMESTAMP, '{"has_pii": false}')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ========================================
-- 6. INSERT SAMPLE AI MODELS
-- ========================================
SET @dataset1_id = (SELECT id FROM datasets WHERE name = 'Customer Demographics' LIMIT 1);
SET @dataset2_id = (SELECT id FROM datasets WHERE name = 'Patient Records' LIMIT 1);
SET @dataset3_id = (SELECT id FROM datasets WHERE name = 'Transaction History' LIMIT 1);

INSERT INTO ai_models (name, description, algorithm, dataset_id, user_id, model_path, status, epochs, batch_size, embedding_dim, accuracy, loss, training_started_at, training_completed_at, config) VALUES
('Customer CTGAN v1', 'CTGAN model for customer demographics', 'CTGAN', @dataset1_id, @admin_id, '/uploads/models/customer_ctgan_v1.pkl', 'COMPLETED', 300, 500, 128, 94.5, 0.0234, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY), '{"generator_lr": 0.0002, "discriminator_lr": 0.0002}'),
('Patient TVAE v1', 'TVAE model for patient records', 'TVAE', @dataset2_id, @scientist_id, '/uploads/models/patient_tvae_v1.pkl', 'COMPLETED', 500, 1000, 256, 96.2, 0.0189, DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY), DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY), '{"encoder_dim": 128, "decoder_dim": 128}'),
('Transaction CTGAN v1', 'CTGAN model for transactions', 'CTGAN', @dataset3_id, @john_id, '/uploads/models/transaction_ctgan_v1.pkl', 'TRAINING', 300, 500, 128, NULL, NULL, CURRENT_TIMESTAMP, NULL, '{"generator_lr": 0.0002}')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ========================================
-- 7. INSERT SAMPLE SYNTHETIC DATASETS
-- ========================================
SET @model1_id = (SELECT id FROM ai_models WHERE name = 'Customer CTGAN v1' LIMIT 1);
SET @model2_id = (SELECT id FROM ai_models WHERE name = 'Patient TVAE v1' LIMIT 1);

INSERT INTO synthetic_datasets (name, model_id, original_dataset_id, user_id, file_path, record_count, privacy_score, quality_score, similarity_score, status, metadata) VALUES
('Synthetic Customers 10k', @model1_id, @dataset1_id, @admin_id, '/uploads/synthetic/synthetic_customers_10k.csv', 10000, 98.5, 94.2, 5.3, 'COMPLETED', '{"zero_leakage": true, "privacy_techniques": ["k-anonymity", "differential_privacy"]}'),
('Synthetic Patients 5k', @model2_id, @dataset2_id, @scientist_id, '/uploads/synthetic/synthetic_patients_5k.csv', 5000, 99.1, 96.8, 3.2, 'COMPLETED', '{"zero_leakage": true, "privacy_techniques": ["l-diversity", "t-closeness"]}')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ========================================
-- 8. INSERT SAMPLE PRIVACY AUDITS
-- ========================================
SET @synthetic1_id = (SELECT id FROM synthetic_datasets WHERE name = 'Synthetic Customers 10k' LIMIT 1);
SET @synthetic2_id = (SELECT id FROM synthetic_datasets WHERE name = 'Synthetic Patients 5k' LIMIT 1);

INSERT INTO privacy_audits (dataset_id, synthetic_dataset_id, user_id, privacy_level, anonymization_score, leakage_detected, gdpr_compliant, hipaa_compliant, ccpa_compliant, sensitive_fields_count, pii_detected, phi_detected, financial_data_detected, audit_result) VALUES
(@dataset1_id, @synthetic1_id, @admin_id, 'HIGH', 98.5, false, true, true, true, 2, false, false, false, '{"total_checks": 50, "passed": 50, "failed": 0, "warnings": 0}'),
(@dataset2_id, @synthetic2_id, @scientist_id, 'VERY_HIGH', 99.1, false, true, true, true, 4, false, false, false, '{"total_checks": 75, "passed": 75, "failed": 0, "warnings": 0}')
ON DUPLICATE KEY UPDATE privacy_level = VALUES(privacy_level);

-- ========================================
-- 9. INSERT SAMPLE EXPORT LOGS
-- ========================================
INSERT INTO export_logs (dataset_id, synthetic_dataset_id, user_id, export_format, file_path, file_size, include_privacy_report, record_count, status) VALUES
(@dataset1_id, @synthetic1_id, @admin_id, 'PDF', '/exports/synthetic_customers_report.pdf', 1524000, true, 10000, 'COMPLETED'),
(@dataset1_id, @synthetic1_id, @admin_id, 'EXCEL', '/exports/synthetic_customers_data.xlsx', 2048000, true, 10000, 'COMPLETED'),
(@dataset2_id, @synthetic2_id, @scientist_id, 'JSON', '/exports/synthetic_patients_data.json', 3072000, true, 5000, 'COMPLETED')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- ========================================
-- 10. INSERT SAMPLE ANOMALY DETECTIONS
-- ========================================
INSERT INTO anomaly_detections (dataset_id, user_id, anomaly_count, anomaly_percentage, detection_method, anomalies) VALUES
(@dataset1_id, @admin_id, 23, 0.23, 'Isolation Forest', '[{"row": 156, "reason": "Outlier in age column"}, {"row": 892, "reason": "Outlier in income column"}]'),
(@dataset3_id, @john_id, 145, 0.29, 'Local Outlier Factor', '[{"row": 1234, "reason": "Unusual transaction amount"}, {"row": 5678, "reason": "Suspicious transaction pattern"}]')
ON DUPLICATE KEY UPDATE anomaly_count = VALUES(anomaly_count);

-- ========================================
-- 11. INSERT SAMPLE ACTIVITY LOGS
-- ========================================
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address, status) VALUES
(@admin_id, 'USER_LOGIN', 'USER', @admin_id, 'Admin user logged in', '192.168.1.100', 'SUCCESS'),
(@admin_id, 'DATASET_UPLOAD', 'DATASET', @dataset1_id, 'Uploaded customer demographics dataset', '192.168.1.100', 'SUCCESS'),
(@admin_id, 'MODEL_TRAIN', 'AI_MODEL', @model1_id, 'Started training CTGAN model', '192.168.1.100', 'SUCCESS'),
(@scientist_id, 'USER_LOGIN', 'USER', @scientist_id, 'Data scientist logged in', '192.168.1.101', 'SUCCESS'),
(@scientist_id, 'SYNTHETIC_GENERATE', 'SYNTHETIC_DATASET', @synthetic2_id, 'Generated 5k synthetic patient records', '192.168.1.101', 'SUCCESS'),
(@admin_id, 'EXPORT_DATA', 'EXPORT', 1, 'Exported synthetic data as PDF', '192.168.1.100', 'SUCCESS')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- ========================================
-- 12. INSERT SAMPLE NOTIFICATIONS
-- ========================================
INSERT INTO notifications (user_id, title, message, type, priority, is_read) VALUES
(@admin_id, 'Model Training Complete', 'Your CTGAN model "Customer CTGAN v1" has finished training successfully.', 'SUCCESS', 'HIGH', false),
(@admin_id, 'Privacy Audit Passed', 'All privacy checks passed for synthetic customer dataset.', 'INFO', 'NORMAL', true),
(@scientist_id, 'New Dataset Available', 'A new healthcare dataset has been shared with you.', 'INFO', 'NORMAL', false),
(@john_id, 'Training Started', 'Your model training has begun. Estimated time: 2 hours.', 'INFO', 'NORMAL', true)
ON DUPLICATE KEY UPDATE is_read = VALUES(is_read);

-- ========================================
-- 13. INSERT SYSTEM SETTINGS
-- ========================================
INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES
('max_upload_size', '104857600', 'Maximum file upload size in bytes (100MB)', @admin_id),
('default_epochs', '300', 'Default number of epochs for model training', @admin_id),
('default_batch_size', '500', 'Default batch size for model training', @admin_id),
('privacy_threshold', '95.0', 'Minimum privacy score threshold for export', @admin_id),
('enable_notifications', 'true', 'Enable email notifications', @admin_id),
('retention_days', '90', 'Number of days to retain activity logs', @admin_id),
('api_rate_limit', '1000', 'API requests per hour per user', @admin_id)
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Display seeded data counts
SELECT 'Data Seeding Complete!' as Status;

SELECT 
    'Users' as Entity,
    COUNT(*) as Count
FROM users
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Datasets', COUNT(*) FROM datasets
UNION ALL
SELECT 'AI Models', COUNT(*) FROM ai_models
UNION ALL
SELECT 'Synthetic Datasets', COUNT(*) FROM synthetic_datasets
UNION ALL
SELECT 'Privacy Audits', COUNT(*) FROM privacy_audits
UNION ALL
SELECT 'Export Logs', COUNT(*) FROM export_logs
UNION ALL
SELECT 'Anomaly Detections', COUNT(*) FROM anomaly_detections
UNION ALL
SELECT 'Activity Logs', COUNT(*) FROM activity_logs
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'System Settings', COUNT(*) FROM system_settings;

-- Display user credentials
SELECT 
    username,
    email,
    full_name,
    'password123' as default_password,
    GROUP_CONCAT(role) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.id, u.username, u.email, u.full_name
ORDER BY u.id;

SELECT '----' as Separator, 'Admin Password: admin123' as Note
UNION ALL
SELECT '----', 'Sample User Password: password123';
