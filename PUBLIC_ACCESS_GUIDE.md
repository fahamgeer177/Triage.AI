# 🌐 Public Access Guide for Triage.AI Agent

Your Triage.AI agent is currently running locally. Here are several ways to make it publicly accessible for others to use:

## 🚀 Quick Public Access Options

### Option 1: ngrok (Instant Public URL)
```bash
# Install ngrok and create account at https://ngrok.com
# Then run:
ngrok http 3001

# This will give you URLs like:
# https://abc123.ngrok.io -> http://localhost:3001
```

**Your agent will be accessible at:**
- Health: `https://your-ngrok-url.ngrok.io/health`
- Metadata: `https://your-ngrok-url.ngrok.io/metadata`
- Analyze: `https://your-ngrok-url.ngrok.io/analyze`

### Option 2: Cloudflare Tunnel (Free, Persistent)
```bash
# Install cloudflared
npm install -g cloudflared

# Create tunnel
cloudflared tunnel --url http://localhost:3001
```

## 🏗️ Production Deployment Options

### Option A: Railway.app (Recommended for Hackathon)
1. Create account at https://railway.app
2. Connect your GitHub repository
3. Railway will auto-deploy your triage-agent
4. Gets permanent URL like: `https://triage-agent-production.up.railway.app`

### Option B: Render.com (Free Tier)
1. Create account at https://render.com
2. Connect GitHub repo
3. Deploy as web service
4. Gets URL like: `https://triage-agent.onrender.com`

### Option C: Vercel (Serverless)
1. Create account at https://vercel.com
2. Deploy with: `vercel --prod`
3. Gets URL like: `https://triage-agent.vercel.app`

## 📝 For Hackathon Submission

### Current Demo URLs
- **Frontend Demo**: `http://localhost:5173` (make this public too!)
- **Agent Health**: `http://localhost:3001/health`
- **Agent Metadata**: `http://localhost:3001/metadata`

### What Judges/Users Need
1. **Public Agent URL** - So they can test the API directly
2. **Public Frontend URL** - So they can use the full application
3. **GitHub Repository** - With your source code
4. **Coral Registration** - Your `coral-registration.json` file

## 🔧 Quick Setup Commands

### Make Agent Public (Choose One)
```bash
# Option 1: ngrok
ngrok http 3001

# Option 2: Railway (after setup)
railway up

# Option 3: Render (after connecting GitHub)
# Deploys automatically on git push
```

### Make Frontend Public
```bash
# For frontend (port 5173)
ngrok http 5173

# Or deploy frontend to Vercel
cd frontend && vercel --prod
```

## 🌟 Recommended for Hackathon

1. **Use Railway for agent** - Free, persistent, good for demos
2. **Use Vercel for frontend** - Fast, reliable, great for React apps
3. **Share both URLs** in your submission
4. **Include GitHub repo** with setup instructions

## 📋 After Deployment Checklist

- [ ] Test agent health endpoint publicly
- [ ] Test agent metadata endpoint
- [ ] Test analyze endpoint with sample data
- [ ] Update `coral-registration.json` with public URLs
- [ ] Test frontend connecting to public agent
- [ ] Share URLs with hackathon judges

## 🔗 Public URLs Template

Once deployed, your URLs will look like:
```
🤖 Agent URLs:
- Health: https://your-agent-url.com/health
- Metadata: https://your-agent-url.com/metadata
- Analyze: https://your-agent-url.com/analyze

🌐 Frontend URL:
- Dashboard: https://your-frontend-url.com

📁 Source Code:
- GitHub: https://github.com/yourusername/Triage.AI

📋 Coral Registration:
- Registration: https://github.com/yourusername/Triage.AI/blob/main/triage-agent/coral-registration.json
```

Choose the deployment option that works best for your needs!