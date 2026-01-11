# 🔧 MYSQL CONNECTION FIX - COMPLETE GUIDE

## ⚠️ **Current Issue**
Your backend is configured for H2 (in-memory database) but needs MySQL for persistent data.

## ✅ **What I've Done**
1. ✅ Updated `application.properties` to use MySQL
2. ✅ Created quick setup SQL script (`sql/quick_setup.sql`)
3. ✅ Created easy setup batch file (`fix-mysql.bat`)

---

## 🚀 **SOLUTION: 2 Options**

---

## **Option 1: Use MySQL (Recommended for Production)**

### **Step 1: Install MySQL (if not installed)**

**Choose ONE:**

#### **A. MySQL Server (Official)**
1. Download: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Remember the root password you set!

#### **B. XAMPP (Easiest - includes MySQL)**
1. Download: https://www.apachefriends.org/
2. Install XAMPP
3. Start MySQL from XAMPP Control Panel
4. Default: No password (just press Enter)

### **Step 2: Setup Database**

**Easy Way:**
```bash
# Just run this:
fix-mysql.bat

# Enter your MySQL root password when prompted
# (Press Enter if no password)
```

**Manual Way:**
```bash
# Login to MySQL
mysql -u root -p

# Run setup
source sql/quick_setup.sql;

# Or if that doesn't work:
mysql -u root -p < sql/quick_setup.sql
```

### **Step 3: Update Password (if needed)**

If your MySQL root password is NOT empty, edit:
`backend/src/main/resources/application.properties`

Change this line:
```properties
spring.datasource.password=
```

To:
```properties
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
```

### **Step 4: Restart Backend**

```bash
# Stop current backend (close the window or Ctrl+C)

# Then restart:
cd backend
mvnw.cmd spring-boot:run
```

### **Step 5: Login!**
- URL: http://localhost:5173
- **Username:** admin
- **Password:** admin123

---

## **Option 2: Continue with H2 (Quick but temporary)**

If you don't want to install MySQL right now, you can revert to H2:

### **Revert to H2:**

Edit `backend/src/main/resources/application.properties`

Replace MySQL config with:
```properties
# Database Configuration - H2 In-Memory Database
spring.datasource.url=jdbc:h2:mem:synthetic_platform;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
```

### **Create Admin User in H2:**

The H2 database will be empty, so you need to REGISTER a new user:

1. Go to http://localhost:5173
2. Click **Register** tab
3. Create account:
   - Full Name: Admin User
   - Username: admin  
   - Email: admin@example.com
   - Password: admin123
   - Confirm: admin123
4. Click **Create Account**
5. Login with your new credentials

**Note:** With H2, data is lost when you restart the backend!

---

## 🐛 **Troubleshooting**

### **"bad credentials" error**
✅ **Cause:** Database is empty (no admin user)  
✅ **Fix:** Run `fix-mysql.bat` to create admin user OR register new account

### **MySQL command not found**
✅ **Cause:** MySQL not installed or not in PATH  
✅ **Fix:** Install MySQL or XAMPP (see Step 1 above)

### **Access denied for user root**
✅ **Cause:** Wrong password  
✅ **Fix:** Use correct password or reset MySQL root password

### **Cannot connect to MySQL Server**
✅ **Cause:** MySQL service not running  
✅ **Fix:**
```bash
# Windows
net start MySQL80

# Or start from XAMPP Control Panel
```

### **Backend won't start**
✅ **Cause:** MySQL not running or wrong config  
✅ **Fix:** 
1. Verify MySQL is running
2. Check password in application.properties
3. Try reverting to H2 (Option 2)

---

## 📝 **Quick Reference**

### **What Changed:**
- ✅ `application.properties` - Now uses MySQL instead of H2
- ✅ Added `sql/quick_setup.sql` - Quick database setup
- ✅ Added `fix-mysql.bat` - Automated setup script

### **Files to Check:**
```
backend/src/main/resources/application.properties  ← MySQL config
sql/quick_setup.sql                                 ← Database setup
fix-mysql.bat                                       ← Easy setup script
```

### **Default Credentials:**
```
Username: admin
Password: admin123
```

### **MySQL Database:**
```
Database: synthetic_platform
Host: localhost
Port: 3306
User: root
```

---

## ✅ **Verification**

### **Test MySQL Connection:**
```bash
mysql -u root -p

USE synthetic_platform;
SELECT * FROM users WHERE username='admin';
```

Should show the admin user.

### **Test Backend:**
After restarting backend, check logs for:
```
Successfully connected to database
```

### **Test Login:**
1. Go to http://localhost:5173
2. Enter: admin / admin123
3. Should login successfully!

---

## 🎯 **Recommended Steps**

1. **Install MySQL/XAMPP** (if not installed)
2. **Run `fix-mysql.bat`** to setup database
3. **Restart backend** (close window and restart)
4. **Login** with admin/admin123

This will give you:
- ✅ Persistent data (survives restarts)
- ✅ Better performance
- ✅ Production-ready setup
- ✅ Full MySQL features

---

## 💡 **Pro Tip**

For development, you can use **XAMPP** which is easier:
1. Install XAMPP
2. Start MySQL from Control Panel
3. No password setup needed
4. Just run `fix-mysql.bat`
5. Done!

---

**Need Help?** Check these files:
- `MYSQL_SETUP_GUIDE.md` - Full MySQL guide
- `MYSQL_DATABASE_PACKAGE.md` - Complete database info
- `sql/schema.sql` - Full database schema (14 tables)
- `sql/seed_data.sql` - Sample data

---

**Created:** 2026-01-09  
**Status:** ✅ Backend configured for MySQL  
**Action Needed:** Install MySQL and run fix-mysql.bat

© 2026 SynthoGen Intelligence Platform
