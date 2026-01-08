# 🔐 Authentication & Security Guide

## Overview
SynthoGen Enterprise now includes production-grade security features:
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per minute per IP
- **Redis Caching**: Optional high-performance caching for stats
- **Role-Based Access Control**: User and Admin roles

## 🚀 Quick Start

### 1. Database Setup
```sql
-- Run the authentication schema
SOURCE sql/auth_schema.sql;
```

This creates:
- `users` table
- `user_roles` table
- Default admin user (username: `admin`, password: `admin123`)

### 2. Configuration

#### JWT Settings (`application.properties`)
```properties
app.jwt.secret=YOUR_SECRET_KEY_HERE_MUST_BE_256_BITS
app.jwt.expiration=86400000  # 24 hours
```

**IMPORTANT**: Change the JWT secret in production!

#### Redis (Optional)
To enable Redis caching, uncomment in `application.properties`:
```properties
spring.cache.type=redis
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

## 📡 API Endpoints

### Authentication

#### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer"
}
```

### Protected Endpoints

All `/api/*` endpoints (except `/api/auth/*`) require authentication.

**Include JWT token in requests:**
```bash
GET /api/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Security Features

### 1. JWT Authentication
- **Token Expiration**: 24 hours (configurable)
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secure**: Passwords hashed with BCrypt

### 2. Rate Limiting
- **Limit**: 100 requests per minute per IP address
- **Response**: HTTP 429 (Too Many Requests) when exceeded
- **Automatic Reset**: Every 60 seconds

### 3. CORS Configuration
- **Allowed Origins**: `localhost:5173`, `localhost:3000`
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Credentials**: Enabled

### 4. Redis Caching (Optional)
- **Cache Duration**: 10 minutes
- **Cached Data**: Dataset statistics
- **Benefits**: 10x faster stats retrieval for repeated requests

## 🎯 Frontend Integration

### Login Flow
```javascript
// 1. Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const { accessToken } = await response.json();

// 2. Store token
localStorage.setItem('token', accessToken);

// 3. Use token in requests
const projects = await fetch('/api/projects', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

### Axios Interceptor (Recommended)
```javascript
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🛡️ Best Practices

### Production Deployment
1. **Change Default Credentials**: Update admin password immediately
2. **Secure JWT Secret**: Use a strong, random 256-bit key
3. **Enable HTTPS**: Always use SSL/TLS in production
4. **Configure CORS**: Restrict to your production domain
5. **Monitor Rate Limits**: Adjust based on your traffic patterns

### Password Requirements
Enforce strong passwords in your frontend:
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Special characters recommended

### Token Management
- **Storage**: Use `localStorage` or `sessionStorage`
- **Expiration**: Implement token refresh mechanism
- **Logout**: Clear token from storage

## 📊 Performance with Redis

### Without Redis
- Stats calculation: ~2-5 seconds per request
- Database load: High for repeated requests

### With Redis
- First request: ~2-5 seconds (cached)
- Subsequent requests: ~50ms (from cache)
- Cache duration: 10 minutes
- **Result**: 40-100x faster for cached data

## 🔧 Troubleshooting

### "Invalid JWT token"
- Token expired (24 hours)
- Token malformed
- **Solution**: Re-login to get new token

### "Too Many Requests"
- Exceeded 100 requests/minute
- **Solution**: Wait 60 seconds or adjust rate limit

### Redis Connection Failed
- Redis not running
- **Solution**: Start Redis or disable caching in config

## 🎓 Example: Complete Auth Flow

```javascript
// Login Component
async function login(username, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) throw new Error('Login failed');
    
    const { accessToken } = await res.json();
    localStorage.setItem('token', accessToken);
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    alert('Invalid credentials');
  }
}

// Protected API Call
async function fetchProjects() {
  const token = localStorage.getItem('token');
  
  const res = await fetch('/api/projects', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (res.status === 401) {
    // Token expired
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }
  
  return await res.json();
}
```

---
**Security Note**: Always use HTTPS in production. Never commit JWT secrets to version control.
