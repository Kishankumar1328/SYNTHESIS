# 🗄️ MYSQL DATABASE - COMPLETE PACKAGE

## ✅ **STATUS: READY TO USE**

Complete MySQL database setup for **SynthoGen AI Synthetic Data Platform** with 14 tables, 3 views, 2 stored procedures, and comprehensive seed data.

---

## 📦 **What's Included**

### **1. SQL Files**
- ✅ **`sql/schema.sql`** - Complete database schema (14 tables)
- ✅ **`sql/seed_data.sql`** - Sample data with admin user + test data
- ✅ **`setup-mysql.bat`** - Automated setup script (Windows)

### **2. Configuration Files**
- ✅ **`application-mysql.properties`** - Production-ready MySQL config
- ✅ **`MYSQL_SETUP_GUIDE.md`** - Complete setup documentation

### **3. Database Components**

#### **14 Tables:**
1. `users` - User accounts
2. `roles` - User roles (ADMIN, USER, etc.)
3. `user_roles` - User-to-role mapping
4. `projects` - Workspaces/Projects
5. `datasets` - Uploaded datasets
6. `ai_models` - Trained AI models
7. `synthetic_datasets` - Generated synthetic data
8. `privacy_audits` - Privacy compliance audits
9. `export_logs` - Export history
10. `anomaly_detections` - Anomaly results
11. `activity_logs` - User activity tracking
12. `api_keys` - API access keys
13. `notifications` - User notifications
14. `system_settings` - App configuration

#### **3 Views:**
- `user_statistics` - User activity summary
- `dataset_summary` - Dataset overview
- `privacy_audit_summary` - Privacy reports

#### **2 Stored Procedures:**
- `get_user_dashboard_stats(user_id)` - User stats
- `clean_old_activity_logs()` - Cleanup

#### **1 Trigger:**
- `update_last_login` - Auto-update last login time

---

## 🚀 **3-STEP QUICK SETUP**

### **Option 1: Automated Setup (Easiest)**
```bash
# Just run this:
setup-mysql.bat

# Follow the prompts:
# 1. Enter MySQL root password
# 2. Choose to load sample data (Y/N)
# 3. Done!
```

### **Option 2: Manual Setup**
```bash
# Step 1: Create database
mysql -u root -p -e "CREATE DATABASE synthetic_platform"

# Step 2: Import schema
mysql -u root -p synthetic_platform < sql/schema.sql

# Step 3: Import seed data (optional)
mysql -u root -p synthetic_platform < sql/seed_data.sql
```

### **Option 3: MySQL Workbench (GUI)**
1. Open MySQL Workbench
2. File → Run SQL Script → Select `sql/schema.sql`
3. File → Run SQL Script → Select `sql/seed_data.sql`

---

## 🔐 **Default Users (After Seed Data)**

| Username | Password | Email | Role |
|----------|----------|-------|------|
| **admin** | **admin123** | admin@synthogen.com | ADMIN, USER |
| john.doe | password123 | john.doe@example.com | USER |
| jane.smith | password123 | jane.smith@example.com | USER |
| data.scientist | password123 | scientist@example.com | DATA_SCIENTIST |

---

## ⚙️ **Configure Your Application**

### **Method 1: Use Pre-configured File**
```bash
# Copy the MySQL config file
copy backend\src\main\resources\application-mysql.properties backend\src\main\resources\application.properties

# Edit the file and replace:
YOUR_MYSQL_ROOT_PASSWORD_HERE
# with your actual MySQL password
```

### **Method 2: Manual Configuration**
Edit `backend/src/main/resources/application.properties`:

```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

**Important:** Replace `YOUR_PASSWORD` with your MySQL root password!

---

## 📊 **Database Schema Overview**

### **Core Authentication & Users**
```
users (id, username, email, password, full_name, enabled, created_at)
  ├── user_roles (user_id, role)
  └── roles (id, name, description)
```

### **Data Management**
```
projects (id, name, description, user_id, status)
  └── datasets (id, name, file_path, file_type, row_count, project_id)
      └── ai_models (id, name, algorithm, dataset_id, status, accuracy)
          └── synthetic_datasets (id, name, model_id, record_count, privacy_score)
              └── privacy_audits (id, synthetic_dataset_id, anonymization_score, gdpr_compliant)
```

### **Operations & Logging**
```
export_logs (id, dataset_id, export_format, file_path, exported_at)
anomaly_detections (id, dataset_id, anomaly_count, anomaly_percentage)
activity_logs (id, user_id, action, entity_type, created_at)
notifications (id, user_id, title, message, is_read)
```

### **System**
```
api_keys (id, user_id, api_key, rate_limit, enabled)
system_settings (id, setting_key, setting_value)
```

---

## 🎯 **Sample Data Included**

When you run `seed_data.sql`, you get:

### **Users & Security**
- ✅ 4 Users (1 admin + 3 regular)
- ✅ 4 Roles with assignments
- ✅ BCrypt encrypted passwords

### **Sample Projects & Data**
- ✅ 4 Projects (Customer Analytics, Healthcare, Finance, Testing)
- ✅ 4 Datasets (CSV/JSON, various sizes)
- ✅ 3 AI Models (CTGAN, TVAE - some completed, some training)
- ✅ 2 Synthetic Datasets with metrics
- ✅ 2 Privacy Audits (all compliant)

### **Activity & Logs**
- ✅ 3 Export logs (PDF, Excel, JSON)
- ✅ 2 Anomaly detections
- ✅ 6 Activity logs
- ✅ 4 Notifications
- ✅ 7 System settings

**Perfect for testing and demonstration!**

---

## 🧪 **Verify Installation**

### **Check Tables**
```sql
mysql -u root -p

USE synthetic_platform;
SHOW TABLES;
-- Should show 14 tables

SELECT COUNT(*) FROM users;
-- Should show 4 users (if seed data loaded)
```

### **Test Admin Login**
```sql
SELECT username, email, full_name 
FROM users 
WHERE username = 'admin';

-- Should return:
-- admin | admin@synthogen.com | System Administrator
```

### **Check User Roles**
```sql
SELECT u.username, GROUP_CONCAT(ur.role) as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
GROUP BY u.username;
```

### **Get Dashboard Stats**
```sql
CALL get_user_dashboard_stats(1);
-- Shows stats for user ID 1 (admin)
```

---

## 📈 **Database Features**

### **Performance Optimizations**
✅ Indexed columns for fast queries  
✅ Composite indexes for common joins  
✅ HikariCP connection pooling  
✅ Query batching enabled  
✅ Prepared statement caching  

### **Data Integrity**
✅ Foreign key constraints  
✅ Cascading deletes  
✅ NOT NULL constraints  
✅ UNIQUE constraints  
✅ Default values  

### **Advanced Features**
✅ JSON columns for metadata  
✅ Triggers for auto-updates  
✅ Stored procedures for common operations  
✅ Views for analytics  
✅ UTF8MB4 for emoji support  

---

## 🔒 **Security Best Practices**

### **1. Create Dedicated User (Recommended)**
```sql
-- Don't use root in production!
CREATE USER 'synthogen'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON synthetic_platform.* TO 'synthogen'@'localhost';
FLUSH PRIVILEGES;
```

Then update `application.properties`:
```properties
spring.datasource.username=synthogen
spring.datasource.password=StrongPassword123!
```

### **2. Change Default Passwords**
```sql
-- Generate new BCrypt hash for a new password
-- Then update admin user:
UPDATE users 
SET password = '$2a$10$YOUR_NEW_BCRYPT_HASH_HERE' 
WHERE username = 'admin';
```

### **3. Enable SSL (Production)**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform?useSSL=true&requireSSL=true
```

---

## 🛠️ **Maintenance Commands**

### **Backup Database**
```bash
# Full backup
mysqldump -u root -p synthetic_platform > backup_$(date +%Y%m%d).sql

# Structure only
mysqldump -u root -p --no-data synthetic_platform > structure.sql

# Data only
mysqldump -u root -p --no-create-info synthetic_platform > data.sql
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
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'synthetic_platform'
ORDER BY (data_length + index_length) DESC;
```

---

## 🐛 **Troubleshooting**

### **MySQL Not Found**
```bash
# Windows - Add MySQL to PATH
# Or use full path:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### **Access Denied**
```bash
# Reset root password
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
```

### **Tables Not Created**
```bash
# Check for errors in schema.sql execution
mysql -u root -p synthetic_platform < sql/schema.sql 2> errors.log
# Check errors.log file
```

### **Backend Can't Connect**
1. Check MySQL is running: `mysql -u root -p`
2. Check database exists: `SHOW DATABASES;`
3. Verify username/password in `application.properties`
4. Check port 3306 is open: `netstat -an | findstr 3306`

---

## 📝 **Quick Reference**

### **Database Info**
```
Name: synthetic_platform
Charset: utf8mb4
Collation: utf8mb4_unicode_ci
Port: 3306
```

### **Connection String**
```
jdbc:mysql://localhost:3306/synthetic_platform
```

### **Files**
```
sql/schema.sql              - Database structure
sql/seed_data.sql           - Sample data
setup-mysql.bat             - Automated setup
application-mysql.properties - Config template
MYSQL_SETUP_GUIDE.md        - Full documentation
```

---

## 🚀 **Next Steps**

1. **Setup Database:**
   ```bash
   setup-mysql.bat
   ```

2. **Configure Application:**
   ```bash
   # Update MySQL password in:
   backend/src/main/resources/application.properties
   ```

3. **Start Backend:**
   ```bash
   cd backend
   mvnw.cmd spring-boot:run
   ```

4. **Login:**
   - URL: `http://localhost:5173`
   - Username: `admin`
   - Password: `admin123`

---

## 📚 **Documentation**

- **`MYSQL_SETUP_GUIDE.md`** - Complete setup guide with examples
- **`sql/schema.sql`** - Database schema with comments
- **`sql/seed_data.sql`** - Sample data with explanations
- **`application-mysql.properties`** - Configuration reference

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] MySQL 8.0+ installed
- [ ] Database `synthetic_platform` created
- [ ] All 14 tables exist
- [ ] All 3 views exist
- [ ] Admin user exists (username: admin)
- [ ] Sample data loaded (optional)
- [ ] Application.properties updated
- [ ] Backend connects successfully
- [ ] Can login to frontend with admin/admin123

---

## 🎊 **YOU'RE READY!**

Your MySQL database is now:
- ✅ **Fully Configured** - All tables, views, procedures
- ✅ **Seeded with Data** - Ready for testing
- ✅ **Production-Ready** - Optimized & secure
- ✅ **Well-Documented** - Complete guides included

**Start your application and connect to MySQL!**

```bash
cd backend && mvnw.cmd spring-boot:run
```

---

**Created:** 2026-01-09  
**Version:** 1.0.0  
**Database:** MySQL 8.0+  
**Tables:** 14  
**Views:** 3  
**Procedures:** 2  

© 2026 SynthoGen Intelligence Platform
