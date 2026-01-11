-- ========================================
-- Quick MySQL Setup for SynthoGen
-- Creates database, schema, and admin user
-- ========================================

-- Create database
CREATE DATABASE IF NOT EXISTS synthetic_platform
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE synthetic_platform;

-- Create users table
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

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert admin user (password: admin123)
-- BCrypt hash for "admin123"
INSERT INTO users (username, email, password, full_name, enabled, created_at) 
VALUES ('admin', 'admin@synthogen.com', '$2a$10$XgrzDxF7mEBHJKJZGLuEuOCBbPJ.TYbOx7nxM6JWgZq6vF5pHGn8O', 'System Administrator', true, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Assign admin role
INSERT INTO user_roles (user_id, role) 
SELECT id, 'ROLE_ADMIN' FROM users WHERE username='admin' 
ON DUPLICATE KEY UPDATE role=role;

INSERT INTO user_roles (user_id, role) 
SELECT id, 'ROLE_USER' FROM users WHERE username='admin' 
ON DUPLICATE KEY UPDATE role=role;

-- Verify
SELECT 'Admin user created successfully!' as Status;
SELECT username, email, full_name, enabled FROM users WHERE username='admin';
