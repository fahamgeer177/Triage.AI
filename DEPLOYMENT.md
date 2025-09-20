# 🚀 Deployment Guide for Triage.AI

This guide covers different deployment options for making your Triage.AI agent publicly accessible.

## 🌐 Deployment Options

### Option 1: Railway.app (Recommended)

Railway offers free hosting perfect for hackathon demos.

#### Steps:
1. **Sign up** at [railway.app](https://railway.app)
2. **Connect GitHub** repository
3. **Select triage-agent** folder for deployment
4. **Set environment variables**:
   ```
   OPENAI_API_KEY=your-openai-key
   NODE_ENV=production
   ```
5. **Deploy** - Railway auto-detects Node.js and deploys

#### Result:
- Public URL: `https://triage-agent-production.up.railway.app`
- Automatic HTTPS and scaling
- Zero configuration needed

### Option 2: Render.com (Free Tier)

Free hosting with automatic deployments from GitHub.

#### Steps:
1. **Sign up** at [render.com](https://render.com)
2. **Connect repository**
3. **Create Web Service**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `triage-agent`
4. **Environment Variables**:
   ```
   OPENAI_API_KEY=your-openai-key
   NODE_ENV=production
   ```

#### Result:
- Public URL: `https://triage-agent.onrender.com`
- Automatic deployments on git push
- Free tier with sleep after inactivity

### Option 3: Vercel (Serverless)

Perfect for frontend and lightweight APIs.

#### Steps:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from triage-agent directory
cd triage-agent
vercel --prod

# Follow prompts to configure
```

#### Result:
- Public URL: `https://triage-agent.vercel.app`
- Global CDN and instant deployments
- Serverless architecture

### Option 4: Heroku (Classic)

Traditional platform with good documentation.

#### Steps:
1. **Install Heroku CLI**
2. **Create app**:
   ```bash
   cd triage-agent
   heroku create triage-agent-your-name
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set OPENAI_API_KEY=your-key
   heroku config:set NODE_ENV=production
   ```
4. **Deploy**:
   ```bash
   git subtree push --prefix triage-agent heroku main
   ```

### Option 5: Docker Deployment

For custom servers or cloud instances.

#### Steps:
```bash
# Build Docker image
cd triage-agent
docker build -t triage-agent .

# Run container
docker run -p 3001:3001 \
  -e OPENAI_API_KEY=your-key \
  -e NODE_ENV=production \
  triage-agent

# Or use docker-compose
docker-compose up -d
```

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Core Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=production

# Optional Configuration
PORT=3001                    # Auto-set by most platforms
AGENT_PORT=3001             # Fallback port
LOG_LEVEL=info              # Logging level
CORS_ORIGIN=*               # CORS configuration
```

### Platform-Specific Settings

#### Railway
- Uses `railway.toml` configuration
- Automatic port detection
- Environment variables via dashboard

#### Render
- Uses `render.yaml` configuration
- Automatic scaling
- Environment variables via dashboard

#### Vercel
- Uses `vercel.json` configuration
- Serverless functions
- Environment variables via CLI or dashboard

## 📊 Post-Deployment Setup

### 1. Update Coral Registration

After deployment, update your agent registration:

```bash
# From triage-agent directory
npm run public:setup

# Enter your public URL when prompted
# Example: https://triage-agent-production.up.railway.app
```

This updates:
- `coral-registration.json` with public URLs
- Creates `PUBLIC_ACCESS.md` with usage instructions

### 2. Test Deployment

Verify your deployed agent:

```bash
# Health check
curl https://your-public-url.com/health

# Metadata
curl https://your-public-url.com/metadata

# Test analysis
curl -X POST https://your-public-url.com/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test issue",
    "body": "Test description",
    "repository": "test/repo"
  }'
```

### 3. Deploy Frontend (Optional)

Deploy the React frontend to complement your agent:

#### Vercel (Recommended for Frontend)
```bash
cd frontend
vercel --prod
```

#### Netlify
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

#### Frontend Environment Variables
```bash
VITE_BACKEND_URL=https://your-agent-url.com
```

## 🔍 Monitoring and Maintenance

### Health Monitoring

Set up monitoring for your deployed agent:

1. **Uptime Monitoring**:
   - Use services like UptimeRobot
   - Monitor `/health` endpoint
   - Set up alerts for downtime

2. **Performance Monitoring**:
   - Track response times
   - Monitor API usage
   - Check error rates

3. **Log Monitoring**:
   - Most platforms provide built-in logging
   - Monitor for errors and performance issues

### Common Issues and Solutions

#### 1. Cold Starts (Serverless)
```javascript
// Add keepalive endpoint
app.get('/keepalive', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});
```

#### 2. CORS Issues
```javascript
// Update CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

#### 3. Memory Limits
```javascript
// Optimize memory usage
process.on('warning', (warning) => {
  console.warn('Warning:', warning.stack);
});
```

## 🔐 Security Considerations

### Production Security

1. **Environment Variables**:
   - Never commit API keys
   - Use platform-specific secret management
   - Rotate keys regularly

2. **Rate Limiting**:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   app.use(rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }));
   ```

3. **Input Validation**:
   ```javascript
   const { body, validationResult } = require('express-validator');
   
   app.post('/analyze', [
     body('title').isLength({ min: 1, max: 500 }),
     body('body').isLength({ max: 10000 })
   ], (req, res) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     // Process request
   });
   ```

## 📈 Scaling Considerations

### Horizontal Scaling

For high traffic, consider:

1. **Load Balancing**:
   - Deploy multiple instances
   - Use a load balancer (nginx, CloudFlare)
   - Implement health checks

2. **Caching**:
   ```javascript
   const NodeCache = require('node-cache');
   const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes
   
   // Cache triage results
   const cacheKey = `triage:${hash}`;
   const cached = cache.get(cacheKey);
   if (cached) return res.json(cached);
   ```

3. **Database Integration**:
   - Store analysis results
   - Track usage analytics
   - Implement user management

## 🎯 Performance Optimization

### Code Optimization

1. **Response Compression**:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Request Timeout**:
   ```javascript
   const timeout = require('connect-timeout');
   app.use(timeout('30s'));
   ```

3. **Memory Management**:
   ```javascript
   // Limit request size
   app.use(express.json({ limit: '1mb' }));
   ```

### OpenAI Optimization

1. **Token Management**:
   ```javascript
   // Limit input length
   const maxTokens = 4000;
   const truncatedInput = input.substring(0, maxTokens);
   ```

2. **Parallel Processing**:
   ```javascript
   // Process multiple requests concurrently
   const analyses = await Promise.all(
     issues.map(issue => analyzeIssue(issue))
   );
   ```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Code tested locally
- [ ] Documentation updated
- [ ] Security review completed

### During Deployment
- [ ] Platform configured correctly
- [ ] Build succeeds
- [ ] Health check passes
- [ ] Environment variables set

### Post-Deployment
- [ ] Public URLs updated in registration
- [ ] Endpoints tested
- [ ] Monitoring configured
- [ ] Documentation shared

## 🆘 Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port Issues**:
   ```javascript
   // Use dynamic port
   const PORT = process.env.PORT || process.env.AGENT_PORT || 3001;
   ```

3. **Memory Errors**:
   ```bash
   # Increase memory limit
   node --max-old-space-size=512 src/index.js
   ```

4. **API Key Issues**:
   - Verify key is set correctly
   - Check key permissions
   - Test key locally first

### Getting Help

- **Platform Documentation**: Each platform has detailed guides
- **GitHub Issues**: Report deployment-specific issues
- **Community**: Join platform-specific communities for help

---

**Your Triage.AI agent is ready for the world! 🌍**

*Choose the deployment option that best fits your needs and get your agent online in minutes.*