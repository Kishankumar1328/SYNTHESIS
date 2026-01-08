# Database Configuration Guide

## Current Setup: H2 In-Memory Database

Your application is now configured to use **H2 Database** - an in-memory database that requires no installation!

### ✅ Advantages
- **No Installation Required** - Works out of the box
- **Fast Development** - Perfect for testing and development
- **Built-in Web Console** - Easy database inspection
- **Auto-creates tables** - No manual SQL scripts needed

### 🌐 Access Points

#### Backend API
- **URL**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health

#### H2 Database Console
- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:synthetic_platform`
- **Username**: `sa`
- **Password**: *(leave blank)*

#### Frontend
- **URL**: http://localhost:5173

### 📝 Default User Credentials

The application will auto-create a default admin user:
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@synthogen.com`

### ⚠️ Important Notes

1. **Data is temporary** - All data is lost when you stop the backend (in-memory database)
2. **Perfect for development** - Great for testing without MySQL setup
3. **Tables auto-created** - Hibernate will create all tables automatically

### 🔄 Switching to MySQL (Optional - For Production)

If you later want to use MySQL for persistent data:

1. **Install MySQL Server**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Set a root password during installation

2. **Create Database**
   ```sql
   CREATE DATABASE synthetic_platform;
   ```

3. **Update `application.properties`**
   ```properties
   # Database Configuration - MySQL
   spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   
   # JPA/Hibernate Configuration
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
   ```

4. **Run SQL Schema** (if needed)
   ```bash
   mysql -u root -p synthetic_platform < sql/auth_schema.sql
   ```

### 🚀 Quick Start Commands

**Start Backend:**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Start Frontend:**
```powershell
cd frontend
npm run dev
```

**Or use the automated script:**
```powershell
.\start-all.ps1
```

### 🐛 Troubleshooting

**If backend fails to start:**
1. Check if port 8080 is available: `netstat -ano | findstr :8080`
2. Ensure JAVA_HOME is set correctly
3. Check the terminal window for error messages

**If frontend fails to start:**
1. Ensure Node.js is installed: `node --version`
2. Install dependencies: `npm install`
3. Check if port 5173 is available

### 📊 Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `user_roles` - User role assignments
- `projects` - AI/ML projects
- `datasets` - Dataset information
- `ai_models` - AI model metadata

All tables are automatically created by Hibernate on startup!
