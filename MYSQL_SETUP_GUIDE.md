# 🗄️ MYSQL DATABASE SETUP GUIDE

## 📋 **Database: synthetic_platform**

Complete MySQL database setup for the SynthoGen AI Synthetic Data Platform.

---

## 🚀 **Quick Setup (3 Steps)**

### **Step 1: Install MySQL**
- Download MySQL 8.0+ from https://dev.mysql.com/downloads/mysql/
- Install with default settings
- Remember your root password!

### **Step 2: Create Database & Tables**
```bash
mysql -u root -p < sql/schema.sql
```

### **Step 3: Load Sample Data (Optional)**
```bash
mysql -u root -p < sql/seed_data.sql
```

**Done!** Your database is ready.

---

## 📊 **Database Structure**

### **14 Tables Created:**

1. **`users`** - User accounts and authentication
2. **`roles`** - User roles (ADMIN, USER, DATA_SCIENTIST, VIEWER)
3. **`user_roles`** - User-to-role mapping
4. **`projects`** - Workspaces/Projects
5. **`datasets`** - Uploaded datasets
6. **`ai_models`** - Trained AI models
7. **`synthetic_datasets`** - Generated synthetic data
8. **`privacy_audits`** - Privacy compliance audits
9. **`export_logs`** - Export history
10. **`anomaly_detections`** - Anomaly detection results
11. **`activity_logs`** - User activity tracking
12. **`api_keys`** - API access keys (future)
13. **`notifications`** - User notifications
14. **`system_settings`** - Application configuration

### **3 Views Created:**
- `user_statistics` - User activity summary
- `dataset_summary` - Dataset overview
- `privacy_audit_summary` - Privacy audit reports

### **2 Stored Procedures:**
- `get_user_dashboard_stats(user_id)` - Get user statistics
- `clean_old_activity_logs()` - Cleanup old logs

### **1 Trigger:**
- `update_last_login` - Update user's last login time

---

## 🔐 **Default Users**

After running seed_data.sql, you'll have these users:

| Username | Password | Email | Role |
|----------|----------|-------|------|
| **admin** | **admin123** | admin@synthogen.com | ADMIN, USER |
| john.doe | password123 | john.doe@example.com | USER |
| jane.smith | password123 | jane.smith@example.com | USER |
| data.scientist | password123 | scientist@example.com | DATA_SCIENTIST, USER |

---

## 🛠️ **Detailed Setup Instructions**

### **Method 1: Command Line (Recommended)**

#### **1. Login to MySQL**
```bash
mysql -u root -p
```
Enter your MySQL root password.

#### **2. Create Database**
```sql
CREATE DATABASE IF NOT EXISTS synthetic_platform
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### **3. Import Schema**
```bash
mysql -u root -p synthetic_platform < sql/schema.sql
```

#### **4. Import Seed Data (Optional)**
```bash
mysql -u root -p synthetic_platform < sql/seed_data.sql
```

#### **5. Verify Installation**
```bash
mysql -u root -p synthetic_platform
```

```sql
SHOW TABLES;
SELECT COUNT(*) as UserCount FROM users;
EXIT;
```

---

### **Method 2: MySQL Workbench (GUI)**

#### **1. Open MySQL Workbench**
- Connect to your MySQL server

#### **2. Run Schema Script**
- File → Open SQL Script
- Select `sql/schema.sql`
- Click ⚡ Execute button

#### **3. Run Seed Data Script (Optional)**
- File → Open SQL Script
- Select `sql/seed_data.sql`
- Click ⚡ Execute button

#### **4. Verify**
- Refresh schema
- Should see all 14 tables

---

### **Method 3: Using Docker (Advanced)**

#### **1. Create docker-compose.yml**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: synthogen_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: synthetic_platform
    ports:
      - "3306:3306"
    volumes:
      - ./sql/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./sql/seed_data.sql:/docker-entrypoint-initdb.d/02-seed.sql
      - mysql_data:/var/lib/mysql
volumes:
  mysql_data:
```

#### **2. Start MySQL Container**
```bash
docker-compose up -d
```

#### **3. Verify**
```bash
docker exec -it synthogen_mysql mysql -uroot -proot123 synthetic_platform -e "SHOW TABLES;"
```

---

## ⚙️ **Configure Application**

### **Update application.properties**

Edit `backend/src/main/resources/application.properties`:

```properties
# ========================================
# MySQL Database Configuration
# ========================================
spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ========================================
# JPA/Hibernate Configuration
# ========================================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# ========================================
# Connection Pool (HikariCP)
# ========================================
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# ========================================
# JWT Configuration
# ========================================
jwt.secret=SynthoGenSecureSecretKey2026ChangeThisInProduction
jwt.expiration=86400000

# ========================================
# File Upload
# ========================================
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# ========================================
# Python Path
# ========================================
app.python.path=python
app.storage.location=./uploads
```

**Important:** Replace `YOUR_MYSQL_ROOT_PASSWORD` with your actual MySQL root password.

---

## 🧪 **Testing the Database**

### **Test Connection**
```sql
mysql -u root -p

USE synthetic_platform;

-- Check tables
SHOW TABLES;

-- Check user count
SELECT COUNT(*) FROM users;

-- Check admin user
SELECT username, email, full_name 
FROM users 
WHERE username = 'admin';

-- Check user roles
SELECT u.username, GROUP_CONCAT(ur.role) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.username;

-- Get dashboard stats for admin
CALL get_user_dashboard_stats(1);

-- View user statistics
SELECT * FROM user_statistics;

-- View dataset summary
SELECT * FROM dataset_summary;

-- View privacy audit summary  
SELECT * FROM privacy_audit_summary;
```

---

## 📈 **Sample Queries**

### **Get All Users with Their Projects**
```sql
SELECT 
    u.username,
    u.email,
    COUNT(p.id) as project_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;
```

### **Get Dataset Statistics**
```sql
SELECT 
    d.name,
    d.file_type,
    d.row_count,
    d.status,
    u.username as owner,
    COUNT(m.id) as models_trained
FROM datasets d
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN ai_models m ON d.id = m.dataset_id
GROUP BY d.id;
```

### **Get Privacy Compliance Summary**
```sql
SELECT 
    privacy_level,
    COUNT(*) as count,
    AVG(anonymization_score) as avg_score
FROM privacy_audits
GROUP BY privacy_level;
```

### **Get User Activity**
```sql
SELECT 
    action,
    COUNT(*) as count
FROM activity_logs
WHERE user_id = 1
GROUP BY action
ORDER BY count DESC;
```

---

## 🔧 **Maintenance**

### **Backup Database**
```bash
mysqldump -u root -p synthetic_platform > backup_$(date +%Y%m%d).sql
```

### **Restore Database**
```bash
mysql -u root -p synthetic_platform < backup_20260109.sql
```

### **Clean Old Logs**
```sql
CALL clean_old_activity_logs();
```

### **Optimize Tables**
```sql
OPTIMIZE TABLE users, datasets, ai_models, synthetic_datasets;
```

### **Check Database Size**
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'synthetic_platform'
ORDER BY (data_length + index_length) DESC;
```

---

## 🐛 **Troubleshooting**

### **Problem: Can't connect to MySQL**
**Solution:**
```bash
# Check if MySQL is running
mysql -V

# Start MySQL service
# Windows:
net start MySQL80

# Linux:
sudo systemctl start mysql
```

### **Problem: Access denied for user 'root'**
**Solution:**
```bash
# Reset root password
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

### **Problem: Database not found**
**Solution:**
```sql
CREATE DATABASE synthetic_platform;
```

### **Problem: Tables not created**
**Solution:**
```bash
# Run schema again
mysql -u root -p synthetic_platform < sql/schema.sql
```

### **Problem: Duplicate entry errors**
**Solution:**
```sql
# Clear all data and re-seed
DELETE FROM export_logs;
DELETE FROM privacy_audits;
DELETE FROM synthetic_datasets;
DELETE FROM ai_models;
DELETE FROM datasets;
DELETE FROM projects;
DELETE FROM user_roles;
DELETE FROM users;

# Then run seed_data.sql again
```

---

## 🔐 **Security Best Practices**

### **1. Create Application User (Don't use root!)**
```sql
CREATE USER 'synthogen'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON synthetic_platform.* TO 'synthogen'@'localhost';
FLUSH PRIVILEGES;
```

Update `application.properties`:
```properties
spring.datasource.username=synthogen
spring.datasource.password=StrongPassword123!
```

### **2. Change Default Passwords**
```sql
-- Change admin password
UPDATE users 
SET password = '$2a$10$NEW_BCRYPT_HASH_HERE' 
WHERE username = 'admin';
```

### **3. Enable SSL**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform?useSSL=true&requireSSL=true
```

### **4. Regular Backups**
```bash
# Add to crontab for daily backups
0 2 * * * mysqldump -u synthogen -p synthetic_platform > /backups/synthogen_$(date +\%Y\%m\%d).sql
```

---

## 📊 **Database Schema Diagram**

```
users ━━━┳━━━ user_roles ━━━ roles
         ┃
         ┣━━━ projects
         ┃        ┃
         ┣━━━ datasets ━━━━┳━━━ ai_models ━━━ synthetic_datasets
         ┃                 ┃                          ┃
         ┃                 ┃                          ┃
         ┣━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━ privacy_audits
         ┃                                             ┃
         ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╋━━━ export_logs
         ┃
         ┣━━━ anomaly_detections
         ┣━━━ activity_logs
         ┣━━━ notifications
         ┗━━━ api_keys
```

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] All 14 tables created
- [ ] All 3 views created
- [ ] All 2 stored procedures created
- [ ] Admin user exists (username: admin)
- [ ] Can login to application with admin/admin123
- [ ] Sample data loaded (if seed_data.sql was run)
- [ ] Backend connects to MySQL successfully
- [ ] No errors in backend logs

---

## 🎯 **What's Included in Seed Data**

If you ran `seed_data.sql`, you get:

- ✅ 4 Users (1 admin, 3 regular)
- ✅ 4 Roles (ADMIN, USER, DATA_SCIENTIST, VIEWER)
- ✅ 4 Sample Projects
- ✅ 4 Sample Datasets
- ✅ 3 AI Models (2 completed, 1 training)
- ✅ 2 Synthetic Datasets
- ✅ 2 Privacy Audits
- ✅ 3 Export Logs
- ✅ 2 Anomaly Detections
- ✅ 6 Activity Logs
- ✅ 4 Notifications
- ✅ 7 System Settings

**Perfect for testing and demonstration!**

---

## 📝 **Quick Reference**

### **Database Info**
- **Name:** `synthetic_platform`
- **Charset:** `utf8mb4`
- **Collation:** `utf8mb4_unicode_ci`
- **Default Port:** `3306`

### **Connection String**
```
jdbc:mysql://localhost:3306/synthetic_platform
```

### **Default Credentials**
```
Username: admin
Password: admin123
```

### **Configuration File**
```
backend/src/main/resources/application.properties
```

---

## 🚀 **Ready to Go!**

Your MySQL database is now set up and ready for the SynthoGen platform!

**Next steps:**
1. Update `application.properties` with your MySQL password
2. Start the backend: `cd backend && mvnw.cmd spring-boot:run`
3. Login with `admin` / `admin123`

---

**Created:** 2026-01-09  
**Version:** 1.0.0  
**Database:** MySQL 8.0+

© 2026 SynthoGen Intelligence Platform
