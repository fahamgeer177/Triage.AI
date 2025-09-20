# Triage.AI 🤖

**AI-Powered GitHub Issue Triage using Coral Protocol**

Built for the Internet of Agents Hackathon @ Solana Skyline

![Triage.AI Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Triage.AI+Dashboard)

## 🎯 Project Overview

Triage.AI is a complete solution that combines:
- **Coral Protocol Agent** (`triage-agent`) - AI-powered issue analysis endpoint
- **Backend API** - GitHub integration and agent orchestration  
- **React Frontend** - Beautiful dashboard for issue management and triage visualization

The system automatically analyzes GitHub issues and provides:
- **Priority** (low/medium/high/critical)
- **Severity** (minor/moderate/major/critical)  
- **Suggested Labels**
- **Summary** and **Next Steps**
- **Confidence Score** and **Reasoning**

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   React Frontend │    │   Backend API    │    │   Triage Agent      │
│                 │    │                  │    │   (Coral Protocol) │
│ • Issue Browser │◄──►│ • GitHub API     │◄──►│                     │
│ • Triage UI     │    │ • Agent Proxy    │    │ • OpenAI Analysis   │
│ • Results View  │    │ • CORS/Auth      │    │ • Issue Processing  │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
      :5173                   :3000                      :3001
```

## 📁 Project Structure

```
Triage.AI/
├── package.json                 # Root package.json with workspace scripts
├── .env.example                # Environment variables template
├── README.md                   # This file
│
├── triage-agent/               # Coral Protocol Agent
│   ├── package.json
│   ├── agent.yaml             # Coral metadata file
│   ├── src/
│   │   ├── index.js           # Agent server
│   │   └── services/
│   │       └── triageService.js  # AI analysis logic
│   └── test/
│       └── test-agent.js      # Agent testing
│
├── backend/                    # Express Backend
│   ├── package.json
│   ├── src/
│   │   ├── index.js           # Main server
│   │   └── routes/
│   │       ├── github.js      # GitHub API routes
│   │       └── triage.js      # Triage agent proxy
│   └── test/
│       └── test-backend.js    # Backend testing
│
└── frontend/                   # React + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx            # Main app component
        ├── main.jsx           # React entry point
        ├── index.css          # Tailwind styles
        └── components/
            ├── Header.jsx
            ├── ConnectionStatus.jsx
            ├── IssuesList.jsx
            ├── IssueDetails.jsx
            └── TriageResults.jsx
```

## 🚀 Quick Start (5-Hour Hackathon Setup)

### Prerequisites

- **Node.js 18+** and **npm 8+**
- **OpenAI API Key** (sign up at [openai.com](https://openai.com))
- **GitHub Personal Access Token** (for repo access)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/fahamgeer177/Triage.AI.git
cd Triage.AI

# Install all dependencies (root + all workspaces)
npm run install-all
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your API keys
```

**Required Environment Variables:**

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# GitHub Configuration  
GITHUB_TOKEN=ghp_your-github-token-here

# Agent Configuration
AGENT_PORT=3001
TRIAGE_AGENT_URL=http://localhost:3001

# Backend Configuration
BACKEND_PORT=3000

# Frontend Configuration  
VITE_BACKEND_URL=http://localhost:3000
```

### Step 3: Start All Services

**Option A: Start Everything (3 terminals)**

```bash
# Terminal 1: Start Triage Agent
npm run dev:agent

# Terminal 2: Start Backend API  
npm run dev:backend

# Terminal 3: Start Frontend
npm run dev:frontend
```

**Option B: Quick Development Script**

```bash
# Start all services with one command (requires PowerShell)
Start-Process -NoNewWindow npm "run dev:agent"
Start-Sleep 3
Start-Process -NoNewWindow npm "run dev:backend"  
Start-Sleep 3
npm run dev:frontend
```

### Step 4: Verify Setup

1. **Frontend**: http://localhost:5173
2. **Backend API**: http://localhost:3000/health
3. **Triage Agent**: http://localhost:3001/health

## 🔧 Configuration Details

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with scopes:
   - `repo` (for private repos) or `public_repo` (for public only)
   - `read:user`
3. Add token to `.env` as `GITHUB_TOKEN=ghp_...`

### OpenAI API Key

1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create API key in API Keys section
3. Add to `.env` as `OPENAI_API_KEY=sk-...`

### Alternative LLM Providers

To use different LLM providers, modify `triage-agent/src/services/triageService.js`:

```javascript
// For Anthropic Claude
const response = await axios.post('https://api.anthropic.com/v1/messages', {
  model: 'claude-3-sonnet-20240229',
  // ... configuration
});

// For Hugging Face
const response = await axios.post('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
  // ... configuration
});
```

## 🤖 Coral Protocol Integration

### Agent Registration

Register the agent with Coral Registry:

```bash
# Navigate to agent directory
cd triage-agent

# Register with Coral (requires Coral CLI)
coral agent register --file agent.yaml

# Or register manually with API
curl -X POST http://localhost:8080/agents \
  -H "Content-Type: application/json" \
  -d @agent.yaml
```

### Agent Metadata

The agent exposes Coral-compliant metadata at `/metadata`:

```bash
curl http://localhost:3001/metadata
```

Response includes:
- Agent name, version, description
- Input/output schema
- Available endpoints
- Usage examples

### Testing Agent Directly

```bash
# Test agent health
curl http://localhost:3001/health

# Test analysis endpoint
curl -X POST http://localhost:3001/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Application crashes on startup",
    "body": "The app crashes immediately when launched on Windows 10",
    "repository": "myorg/myapp"
  }'
```

## 🧪 Testing

### Agent Testing

```bash
cd triage-agent
npm test
# or
node test/test-agent.js
```

### Backend Testing

```bash
cd backend  
npm test
# or
node test/test-backend.js
```

### Manual Testing

**Test Complete Flow:**

1. Open frontend: http://localhost:5173
2. Check connection status (all green)
3. Enter repository: `facebook/react`
4. Select any issue
5. Click "Run Triage Analysis"
6. Verify results appear in right panel

## 📊 API Documentation

### Triage Agent API

#### `POST /analyze`

Analyze a GitHub issue and return triage recommendations.

**Request:**
```json
{
  "title": "Bug in login form",
  "body": "Login form validation is not working properly...",
  "comments": ["I can reproduce this", "Same issue here"],
  "labels": ["bug", "frontend"],
  "repository": "myorg/myapp"
}
```

**Response:**
```json
{
  "priority": "high",
  "severity": "major", 
  "suggested_labels": ["bug", "ui", "validation"],
  "summary": "Login form validation logic needs fixing",
  "next_steps": [
    "Review validation code in LoginForm component",
    "Add unit tests for validation logic",
    "Test across different browsers"
  ],
  "confidence": 0.85,
  "reasoning": "Issue affects core user functionality...",
  "timestamp": "2024-01-15T10:30:00Z",
  "agent_version": "1.0.0"
}
```

### Backend API

#### `GET /api/github/repos/:owner/:repo/issues`

Fetch issues from GitHub repository.

**Parameters:**
- `state`: open|closed|all (default: open)
- `per_page`: 1-100 (default: 5)
- `sort`: created|updated|comments (default: updated)

#### `POST /api/triage/analyze`

Proxy request to triage agent with additional metadata.

## 🎨 Frontend Features

### Dashboard Layout

- **Left Panel**: Repository connection and issues list
- **Middle Panel**: Selected issue details and triage trigger
- **Right Panel**: AI analysis results with visual indicators

### Visual Design

- **Priority Badges**: Color-coded priority levels
- **Confidence Scoring**: Visual progress bars
- **Status Indicators**: Real-time connection status
- **Responsive Layout**: Works on desktop and mobile

### Interactive Features

- **Repository Search**: Quick repo connection
- **Issue Selection**: Click to view details
- **Real-time Analysis**: Live progress indicators
- **External Links**: Quick access to GitHub

## 🔧 Troubleshooting

### Common Issues

**1. "Triage agent unavailable"**
```bash
# Check if agent is running
curl http://localhost:3001/health

# Restart agent
cd triage-agent && npm run dev
```

**2. "GitHub token required"**
```bash
# Verify token in .env
echo $GITHUB_TOKEN

# Test token validity
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

**3. "OpenAI API errors"**
```bash
# Check API key
echo $OPENAI_API_KEY

# Verify billing/quota
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

**4. "Port already in use"**
```bash
# Find process using port
netstat -ano | findstr :3001

# Kill process (Windows)
taskkill /PID <process-id> /F

# Or change ports in .env
```

### Debug Mode

Enable verbose logging:

```bash
# In .env
DEBUG=true
LOG_LEVEL=debug

# Or set in terminal
DEBUG=* npm run dev:agent
```

## 🚀 Production Deployment

### Building for Production

```bash
# Build frontend
npm run build:frontend

# Production build files in frontend/dist/
```

### Environment Variables for Production

```bash
# Production .env
NODE_ENV=production
OPENAI_API_KEY=your-production-key
GITHUB_TOKEN=your-production-token
BACKEND_PORT=80
AGENT_PORT=8080
TRIAGE_AGENT_URL=https://your-domain.com:8080
```

### Docker Support (Optional)

```dockerfile
# Dockerfile for agent
FROM node:18-alpine
WORKDIR /app
COPY triage-agent/package*.json ./
RUN npm install --production
COPY triage-agent/src ./src
EXPOSE 3001
CMD ["npm", "start"]
```

## 🎯 Demo Script (5-minute presentation)

### Setup (1 minute)

1. Show project structure and architecture
2. Highlight Coral Protocol integration
3. Display environment configuration

### Live Demo (3 minutes)

1. **Start services**: Show all 3 running (agent, backend, frontend)
2. **Connect repository**: Enter `facebook/react` or popular repo
3. **Browse issues**: Show real GitHub issues loading
4. **Select issue**: Pick interesting bug or feature request
5. **Run analysis**: Click triage button, show AI thinking
6. **Show results**: Highlight priority, severity, suggestions

### Technical Deep Dive (1 minute)

1. **Coral metadata**: Show agent.yaml and /metadata endpoint
2. **AI integration**: Demonstrate OpenAI analysis logic
3. **Registration**: Show Coral registry commands

## 🏆 Hackathon Highlights

### What Makes This Special

1. **Complete Coral Integration**: Full agent lifecycle with metadata and registry support
2. **Production Ready**: Error handling, testing, documentation
3. **Beautiful UI**: Polished React dashboard with real-time features
4. **Extensible Architecture**: Easy to add new analysis features
5. **AI-Powered**: Real OpenAI analysis with fallback handling

### Innovation Points

- **Multi-modal Analysis**: Processes title, body, comments, and labels
- **Confidence Scoring**: Provides transparency in AI decisions
- **Real-time Status**: Live connection monitoring
- **Batch Processing**: Supports analyzing multiple issues
- **Fallback Logic**: Works even when AI service is unavailable

## 📝 License

MIT License - Built for hackathon demonstration purposes.

## 🤝 Contributing

This is a hackathon project, but feel free to:
1. Fork the repository
2. Add new features or AI providers
3. Improve the UI/UX
4. Submit issues and feedback

**Repository**: https://github.com/fahamgeer177/Triage.AI

---

**Built with ❤️ for the Internet of Agents Hackathon @ Solana Skyline**

*Powered by Coral Protocol, OpenAI, and React*