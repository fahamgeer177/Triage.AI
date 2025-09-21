# Deployment Health Check Fix Guide

## Issue Diagnosed
Your triage-agent deployment is failing health checks with "service unavailable" errors. This is a common issue in containerized deployments.

## Root Causes & Solutions Applied

### 1. ✅ **Port Binding Issue** (FIXED)
**Problem**: App was binding to `localhost` instead of `0.0.0.0`
**Solution**: Updated `src/index.js` to bind to `0.0.0.0:PORT`

```javascript
// Before: app.listen(PORT, ...)
// After: app.listen(PORT, '0.0.0.0', ...)
```

### 2. ✅ **Enhanced Health Endpoint** (FIXED)
**Problem**: Basic health check with minimal info
**Solution**: Added comprehensive health diagnostics

```javascript
// New health endpoint provides:
// - Environment details
// - Memory usage
// - Configuration status
// - Error handling
```

### 3. ✅ **Docker Configuration** (FIXED)
**Problem**: Missing dependencies and poor health check timing
**Solution**: Updated Dockerfile with:
- Added `curl` for health checks
- Better health check timing (15s interval, 10s start period)
- Proper permissions and user setup

### 4. ✅ **Root Endpoint Added** (FIXED)
**Problem**: Some platforms check root endpoint
**Solution**: Added `GET /` endpoint for basic connectivity

### 5. ✅ **Enhanced Logging** (FIXED)
**Problem**: No deployment diagnostics
**Solution**: Added startup script with environment validation

## Quick Deployment Test

### Test Health Endpoint Locally
```bash
# Navigate to triage-agent directory
cd triage-agent

# Start with simple command
node src/index.js

# Test health endpoint
curl http://localhost:3001/health
```

### Expected Health Response
```json
{
  "status": "healthy",
  "agent": "triage-agent", 
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "environment": {
    "nodeVersion": "v18.17.0",
    "platform": "linux",
    "uptime": 45.2,
    "port": 3001,
    "host": "0.0.0.0"
  },
  "config": {
    "hasOpenAI": true,
    "nodeEnv": "production"
  }
}
```

## Platform-Specific Fixes

### Railway Deployment
1. Ensure `PORT` environment variable is used
2. Set `HOST=0.0.0.0` in environment
3. Health check path: `/health`

### Render Deployment
1. Update `render.yaml` if needed:
```yaml
services:
  - type: web
    name: triage-agent
    env: node
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: HOST
        value: 0.0.0.0
```

### Docker Deployment
1. Build with updated Dockerfile:
```bash
docker build -t triage-agent .
docker run -p 3001:3001 -e OPENAI_API_KEY=your-key triage-agent
```

2. Test health endpoint:
```bash
curl http://localhost:3001/health
```

## Environment Variables Required

### Critical Variables
```bash
# Required for AI functionality
OPENAI_API_KEY=sk-your-key-here

# Deployment configuration
NODE_ENV=production
HOST=0.0.0.0
PORT=3001  # Or platform-assigned port
```

### Optional Variables
```bash
# Logging and debugging
DEBUG=true
LOG_LEVEL=info
```

## Debugging Steps

### 1. Check Application Logs
Look for these startup messages:
```
🚀 Starting Triage Agent...
🤖 Triage Agent running on 0.0.0.0:3001
📊 Health check: http://0.0.0.0:3001/health
```

### 2. Test Endpoints
```bash
# Basic connectivity
curl http://your-domain/

# Health check
curl http://your-domain/health

# Metadata
curl http://your-domain/metadata
```

### 3. Common Error Solutions

**"EADDRINUSE" Error**
```bash
# Port already in use
lsof -ti:3001 | xargs kill -9
```

**"Module not found" Error**
```bash
# Install dependencies
npm install --production
```

**"OpenAI API Error"**
```bash
# Verify API key
echo $OPENAI_API_KEY
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
```

## Redeploy Commands

### After applying fixes:
```bash
# Commit changes
git add .
git commit -m "Apply health check fixes"
git push origin master

# Trigger redeployment on your platform
# Railway: Push will auto-deploy
# Render: Push will auto-deploy  
# Docker: Rebuild image
```

## Success Indicators

✅ **Health check passes**
✅ **App binds to 0.0.0.0**
✅ **Logs show startup messages**
✅ **All endpoints respond**
✅ **Environment variables loaded**

## Next Steps

1. **Redeploy** with the updated code
2. **Monitor** the health check logs
3. **Test** all endpoints once deployed
4. **Verify** the agent is accessible at your deployment URL

The fixes have been applied and pushed to your repository. Try redeploying now!