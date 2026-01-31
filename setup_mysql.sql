-- SYNTHESIS PLATFORM - MYSQL SETUP SCRIPT
-- RUN THIS SCRIPT IN YOUR MYSQL WORKBENCH OR TERMINAL

-- ==========================================
-- 1. AUTHENTICATION DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS auth_platform;
USE auth_platform;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(255),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Default Admin Credentials
-- Username: admin
-- Password: admin123 (BCrypt Encoded)
INSERT IGNORE INTO users (id, username, email, password, full_name, enabled, created_at)
VALUES (1, 'admin', 'admin@synthetic.ai', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.TVuHOn2', 'System Administrator', 1, NOW());

INSERT IGNORE INTO user_roles (user_id, role) 
VALUES (1, 'ROLE_ADMIN'), (1, 'ROLE_USER');


-- ==========================================
-- 2. CORE PLATFORM DATABASE
-- ==========================================
CREATE DATABASE IF NOT EXISTS synthetic_platform;
USE synthetic_platform;

-- Note: Hibernate will automatically generate project, dataset, 
-- and model tables in this database upon first application start.

-- OPTIONAL: Verify Setup
SHOW DATABASES;
SELECT * FROM auth_platform.users;
