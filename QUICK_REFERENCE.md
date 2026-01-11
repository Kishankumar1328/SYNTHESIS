# 🚀 QUICK START CARD

## Start Application
```bash
.\start-all.bat
```

## Access URLs
- **App:** http://localhost:5173
- **API:** http://localhost:8080

## Login
- **User:** `admin`
- **Pass:** `admin123`

## Main Features
1. **Register** → Create account
2. **Login** → Access dashboard
3. **Upload** → Add dataset
4. **Train** → Build AI model
5. **Generate** → Create synthetic data
6. **Export** → Download reports

## File Formats Supported
- CSV ✅
- JSON ✅
- Excel ✅

## Export Formats
- PDF (Privacy Report)
- Excel (Multi-sheet)
- JSON (Structured)

## Privacy Guarantees
- ✅ Zero data leakage
- ✅ GDPR compliant
- ✅ HIPAA compliant
- ✅ CCPA compliant
- ✅ 100% synthetic

## Troubleshooting
**Backend won't start?**
```bash
taskkill /F /IM java.exe
cd backend && mvnw.cmd clean spring-boot:run
```

**Frontend won't start?**
```bash
cd frontend && npm install && npm run dev
```

**Can't login?**
- Check backend is running at :8080
- Clear browser cache
- Try default credentials

**Token expired?**
- Just logout and login again

## Key Pages
- `/` - Dashboard (Workspaces)
- `/datasets` - Dataset Management
- `/ai-training` - AI Model Training
- `/security` - Privacy Audit
- `/anomalies` - Anomaly Detection
- `/auth` - Login/Register

## Documentation
- `COMPLETE_SETUP_GUIDE.md` - Full setup
- `AUTHENTICATION_GUIDE.md` - Auth details
- `PROJECT_COMPLETION_SUMMARY.md` - Overview
- `README.md` - Project info

## Support
- Check logs in terminal windows
- Review documentation files
- Verify ports 5173 & 8080 are free

---

**© 2026 SynthoGen** | Privacy-Safe AI Platform
