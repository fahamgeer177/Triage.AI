# Coral Protocol Agent Registration

Your **Triage.AI Agent** has been successfully validated and prepared for Coral Protocol registration!

## 🎉 Registration Status: READY

### Agent Details
- **Name**: triage-agent
- **Version**: 1.0.0
- **Type**: HTTP Agent
- **Port**: 3001
- **Status**: ✅ Validated & Running

### 🔗 Agent Endpoints
- **Health Check**: `http://localhost:3001/health`
- **Metadata**: `http://localhost:3001/metadata`
- **Analyze**: `http://localhost:3001/analyze`

### 📋 Registration Files
- **Agent Config**: `agent.yaml` - Coral Protocol metadata
- **Registration Data**: `coral-registration.json` - Complete registration payload
- **Registration Script**: `register-agent.js` - Automated registration tool

## 🚀 How to Register

### Option 1: Automatic Registration (when registries are available)
```bash
npm run coral:register
```

### Option 2: Manual Registration with Future Registries
When Coral Protocol registries become available, use the generated `coral-registration.json` file:

```bash
# Submit to official registry
curl -X POST https://registry.coralprotocol.org/api/agents/register \
  -H "Content-Type: application/json" \
  -d @coral-registration.json

# Or submit to local Coral server
curl -X POST http://localhost:8080/api/agents/register \
  -H "Content-Type: application/json" \
  -d @coral-registration.json
```

### Option 3: Share Your Agent
Upload your `coral-registration.json` to GitHub, npm, or share directly with the Coral Protocol community:

```bash
# Publish to npm as a Coral agent package
npm publish --tag coral-agent

# Share on GitHub
git push origin main
```

## 🔍 Verification

Your agent meets all Coral Protocol standards:
- ✅ Valid `agent.yaml` metadata
- ✅ HTTP runtime with standard endpoints
- ✅ Health check accessible
- ✅ Metadata endpoint returns correct schema
- ✅ Analyze endpoint follows input/output standards
- ✅ Proper versioning and documentation

## 🌐 Making Your Agent Discoverable

### For Hackathon Submission
Include these URLs in your submission:
- **Agent Metadata**: `http://localhost:3001/metadata`
- **Live Demo**: `http://localhost:5173` (Frontend)
- **Registration File**: Link to your `coral-registration.json`

### For Production Deployment
1. Deploy your agent to a public server
2. Update the `host` in `agent.yaml` to your domain
3. Re-run registration with production URLs
4. Submit to official Coral Protocol registry

## 🎯 Next Steps

1. **Test your agent** with different GitHub repositories
2. **Share your registration file** with the Coral Protocol community
3. **Monitor for official registry announcements** from Coral Protocol
4. **Consider publishing** your agent as an npm package for easy installation

Your Triage.AI agent is now fully Coral Protocol compliant and ready for registration! 🚀