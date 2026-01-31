-- ==========================================
-- COPY AND PASTE THIS ENTIRE SCRIPT INTO MYSQL WORKBENCH
-- Then click the lightning bolt icon to execute
-- ==========================================

-- Drop and create database
DROP DATABASE IF EXISTS auth_platform;
CREATE DATABASE auth_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE auth_platform;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(50) DEFAULT 'LOCAL',
    provider_id VARCHAR(255) DEFAULT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Roles Table
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    CONSTRAINT fk_user_roles FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
-- Username: admin
-- Password: admin123 (BCrypt encoded)
INSERT INTO users (username, email, password, full_name, auth_provider, enabled)
VALUES (
    'admin',
    'admin@synthesis.ai',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System Administrator',
    'LOCAL',
    TRUE
);

-- Insert admin roles
SET @admin_id = LAST_INSERT_ID();
INSERT INTO user_roles (user_id, role) VALUES (@admin_id, 'ROLE_ADMIN');
INSERT INTO user_roles (user_id, role) VALUES (@admin_id, 'ROLE_USER');

-- Verify setup
SELECT 'Database setup complete!' AS Status;
SELECT * FROM users;
SELECT * FROM user_roles;
