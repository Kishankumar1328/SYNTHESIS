# 🔧 MANUAL MYSQL SETUP - FOLLOW THESE STEPS

## ✅ Good News: MySQL is installed and running!

Location: `C:\Program Files\MySQL\MySQL Server 8.0\`

---

## 🚀 **SETUP STEPS** (2 minutes)

### **Step 1: Open MySQL Command Line**

**Option A: Using MySQL Command Line Client**
1. Press Windows key
2. Search for "MySQL 8.0 Command Line Client"
3. Click to open
4. Enter your MySQL root password when prompted

**Option B: Using Command Prompt**
1. Open Command Prompt (Win+R, type `cmd`)
2. Run:
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```
3. Enter your MySQL root password

---

### **Step 2: Run This SQL Command**

Once you're in MySQL, copy and paste this:

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS synthetic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    last_login TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, enabled) 
VALUES ('admin', 'admin@synthogen.com', '$2a$10$XgrzDxF7mEBHJKJZGLuEuOCBbPJ.TYbOx7nxM6JWgZq6vF5pHGn8O', 'System Administrator', true)
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Assign admin roles
INSERT INTO user_roles (user_id, role) SELECT id, 'ROLE_ADMIN' FROM users WHERE username='admin' ON DUPLICATE KEY UPDATE role=role;
INSERT INTO user_roles (user_id, role) SELECT id, 'ROLE_USER' FROM users WHERE username='admin' ON DUPLICATE KEY UPDATE role=role;

-- Verify
SELECT 'Setup Complete!' as Status;
SELECT username, email, full_name FROM users WHERE username='admin';
```

You should see:
```
Status: Setup Complete!
Username: admin
Email: admin@synthogen.com
Full Name: System Administrator
```

---

### **Step 3: Update Password in Config (if needed)**

If your MySQL root password is NOT empty, edit this file:
`backend/src/main/resources/application.properties`

Find this line:
```properties
spring.datasource.password=
```

Change to:
```properties
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
```

---

### **Step 4: Restart Backend**

1. **Stop Current Backend:**
   - Find the terminal window running the backend
   - Press `Ctrl+C` to stop it
   - Close the window

2. **Start New Backend:**
```bash
cd backend
mvnw.cmd spring-boot:run
```

Wait for message: "Started SyntheticDataPlatformApplication"

---

### **Step 5: Login! ✅**

1. Go to: http://localhost:5173
2. **Username:** admin
3. **Password:** admin123
4. Click **Sign In**

**Success!** You should now be logged in! 🎉

---

## ⚡ **QUICK COPY-PASTE VERSION**

### **In MySQL:**
```sql
SOURCE E:/Kish/Project/LastOneTime/sql/quick_setup.sql;
```

### **OR if SOURCE doesn't work:**
```sql
-- Just copy the SQL from Step 2 above
```

---

## 🐛 **Troubleshooting**

### **"Access denied"**
- Check your MySQL root password
- Try resetting: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html

### **"Database exists" error**
- That's OK! Just continue with the INSERT commands

### **Backend still shows "bad credentials"**
1. Make sure backend restarted successfully
2. Check backend logs for "Connected to MySQL"
3. Verify password in application.properties

---

## 📝 **Alternative: Use MySQL Workbench (GUI)**

If you have MySQL Workbench:

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click "File" → "Run SQL Script"
4. Select: `E:\Kish\Project\LastOneTime\sql\quick_setup.sql`
5. Click "Run"

Done!

---

## ✅ **Verification**

After setup, verify in MySQL:
```sql
USE synthetic_platform;
SHOW TABLES;
SELECT * FROM users;
```

Should show the admin user!

---

**Need help?** The complete SQL is in: `sql/quick_setup.sql`

**Once done, restart backend and login with admin/admin123**

© 2026 SynthoGen Platform
