# 🚀 SynthoGen Enterprise - Production Deployment Guide

## ✅ Pre-Deployment Checklist

### System Requirements
- **Java**: JDK 17 or higher
- **MySQL**: 8.0 or higher
- **Python**: 3.9+ with pip
- **Node.js**: 18+ with npm
- **RAM**: Minimum 8GB (16GB recommended for training)
- **Storage**: 20GB+ for models and datasets

## 📦 Installation Steps

### 1. Database Setup
```sql
CREATE DATABASE synthetic_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SOURCE sql/schema.sql;
```

### 2. Python Environment
```bash
cd ai-engine
pip install -r requirements.txt
```

**Verify Installation:**
```bash
python -c "import sdv; print(sdv.__version__)"
```

### 3. Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/synthetic_platform
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
app.python.path=python  # or full path: C:\Python39\python.exe
app.storage.location=C:\SynthoGen\storage  # Absolute path recommended
```

### 4. Build & Deploy

**Backend:**
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run build  # Production build
npm run preview  # Test production build locally
```

## ⚡ Performance Optimizations

### Database Tuning
- **HikariCP Connection Pool**: Configured for 10 max connections
- **Batch Processing**: Hibernate batch size set to 20
- **Query Optimization**: Lazy loading enabled

### Application Tuning
- **Thread Pool**: 4-8 threads for AI training
- **Compression**: Gzip enabled for responses > 1KB
- **Caching**: Static resources cached

### AI Engine Optimization
- **Default Epochs**: 300 (balance of speed/quality)
- **Batch Size**: 500 (optimized for 8GB RAM)
- **Parallel Processing**: Async training prevents UI blocking

## 🔒 Security Hardening

### Production Checklist
- [ ] Change default database password
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Set up authentication (currently disabled for dev)
- [ ] Enable SQL injection protection (already configured)
- [ ] Implement rate limiting
- [ ] Set up file upload virus scanning

### File Security
- ✅ Filename sanitization (removes special characters)
- ✅ UUID prefixing (prevents collisions)
- ✅ Path traversal protection
- ✅ File type validation (.csv only)

## 📊 Monitoring & Logging

### Log Files
- **Application Logs**: `logs/synthetic-platform.log`
- **Rotation**: Daily, max 10MB per file, 30-day retention
- **Log Levels**: INFO (production), DEBUG (development)

### Health Checks
```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics
```

## 🎯 Performance Benchmarks

### Expected Training Times (CTGAN, 300 epochs)
| Dataset Size | Columns | Time (8GB RAM) |
|--------------|---------|----------------|
| 1K rows      | 10      | 2-5 minutes    |
| 10K rows     | 10      | 10-20 minutes  |
| 100K rows    | 10      | 1-2 hours      |

### Generation Speed
- **1K samples**: < 10 seconds
- **10K samples**: 30-60 seconds
- **100K samples**: 2-5 minutes

## 🐛 Troubleshooting

### Common Issues

**Issue**: Port 8080 already in use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Issue**: Python module not found
```bash
pip install --upgrade sdv pandas numpy scikit-learn
```

**Issue**: MySQL connection refused
- Verify MySQL service is running
- Check firewall settings
- Confirm credentials in application.properties

**Issue**: Out of memory during training
- Reduce batch size to 250
- Reduce epochs to 100
- Use TVAE instead of CTGAN (lighter)

## 🔄 Backup & Recovery

### Database Backup
```bash
mysqldump -u root -p synthetic_platform > backup_$(date +%Y%m%d).sql
```

### Model Backup
```bash
# Backup trained models
tar -czf models_backup_$(date +%Y%m%d).tar.gz uploads/models/
```

## 📈 Scaling Recommendations

### Horizontal Scaling
- Deploy multiple backend instances behind load balancer
- Use shared MySQL instance or cluster
- Centralized file storage (NFS/S3)

### Vertical Scaling
- **16GB RAM**: Handle 100K+ row datasets
- **32GB RAM**: Multiple concurrent trainings
- **GPU**: 10x faster training with CUDA-enabled SDV

## 🎓 Best Practices

1. **Start Small**: Test with 1K rows before scaling
2. **Monitor Resources**: Watch CPU/RAM during training
3. **Regular Backups**: Daily database + weekly model backups
4. **Version Control**: Track hyperparameters in training_metrics
5. **Quality Checks**: Always evaluate models before production use

---
**Support**: For issues, check logs in `logs/` directory
**Updates**: Run `git pull && mvn clean install && npm install` to update
