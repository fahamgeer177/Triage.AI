#!/usr/bin/env node

/**
 * Public Agent Discovery and Registration Updater
 * Updates Coral Protocol registration with public URLs
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class PublicAgentManager {
  constructor() {
    this.registrationPath = path.join(__dirname, 'coral-registration.json');
    this.agentPath = path.join(__dirname, 'agent.yaml');
  }

  async getPublicURL() {
    return new Promise((resolve) => {
      console.log('\n🌐 Enter your public agent URL (e.g., from Railway, Render, ngrok):');
      console.log('Examples:');
      console.log('  - https://triage-agent-production.up.railway.app');
      console.log('  - https://triage-agent.onrender.com');
      console.log('  - https://abc123.ngrok.io');
      console.log('');
      
      rl.question('Public URL: ', (url) => {
        resolve(url.trim());
      });
    });
  }

  async updateRegistration(publicURL) {
    try {
      // Load current registration
      const registrationData = JSON.parse(fs.readFileSync(this.registrationPath, 'utf8'));
      
      // Update with public URLs
      registrationData.agent.runtime.host = new URL(publicURL).hostname;
      registrationData.agent.runtime.public_url = publicURL;
      registrationData.registration.public_endpoint = publicURL;
      registrationData.registration.public_urls = {
        health: `${publicURL}/health`,
        metadata: `${publicURL}/metadata`,
        analyze: `${publicURL}/analyze`
      };
      registrationData.registration.last_updated = new Date().toISOString();
      registrationData.registration.status = 'public';

      // Save updated registration
      fs.writeFileSync(this.registrationPath, JSON.stringify(registrationData, null, 2));
      
      console.log('\n✅ Registration updated successfully!');
      console.log('\n🔗 Your agent is now publicly accessible at:');
      console.log(`   Health: ${publicURL}/health`);
      console.log(`   Metadata: ${publicURL}/metadata`);
      console.log(`   Analyze: ${publicURL}/analyze`);

      return publicURL;
    } catch (error) {
      console.error('❌ Error updating registration:', error.message);
      return null;
    }
  }

  async createPublicReadme(publicURL) {
    const readmeContent = `# 🤖 Triage.AI Agent - Public Access

## 🌐 Live Agent URLs

Your Triage.AI agent is now publicly accessible:

- **Health Check**: [${publicURL}/health](${publicURL}/health)
- **Agent Metadata**: [${publicURL}/metadata](${publicURL}/metadata)
- **Analyze Endpoint**: \`POST ${publicURL}/analyze\`

## 🚀 How to Use

### Test the Agent
\`\`\`bash
# Check if agent is healthy
curl ${publicURL}/health

# Get agent metadata and schema
curl ${publicURL}/metadata

# Analyze a GitHub issue
curl -X POST ${publicURL}/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Login form validation error",
    "body": "The login form shows incorrect error messages when email format is invalid",
    "repository": "myapp/frontend"
  }'
\`\`\`

### Use in Your Application
\`\`\`javascript
// JavaScript example
const response = await fetch('${publicURL}/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Your issue title',
    body: 'Your issue description',
    repository: 'owner/repo'
  })
});

const triage = await response.json();
console.log(triage);
\`\`\`

### Python Example
\`\`\`python
import requests

response = requests.post('${publicURL}/analyze', json={
    'title': 'Database connection timeout',
    'body': 'Users are experiencing timeout errors when connecting to the database',
    'repository': 'myapp/backend'
})

triage = response.json()
print(triage)
\`\`\`

## 📋 Coral Protocol Integration

This agent is registered with the Coral Protocol ecosystem:

- **Agent Name**: triage-agent
- **Version**: 1.0.0
- **Type**: HTTP Agent
- **Compliance**: ✅ Coral Protocol Standard
- **Registration**: [coral-registration.json](./coral-registration.json)

## 🎯 For Developers

### Clone and Deploy Your Own
\`\`\`bash
git clone https://github.com/fahamgeer177/Triage.AI.git
cd Triage.AI/triage-agent
npm install
npm start
\`\`\`

### Deploy to Railway
\`\`\`bash
# Connect to Railway
railway login
railway init
railway up
\`\`\`

### Deploy to Render
1. Fork this repository
2. Connect to Render.com
3. Deploy as web service
4. Set environment variables

### Environment Variables
- \`OPENAI_API_KEY\`: Your OpenAI API key
- \`PORT\`: Port number (auto-set by most platforms)

## 📞 Support

- **Repository**: [GitHub](https://github.com/fahamgeer177/Triage.AI)
- **Issues**: [GitHub Issues](https://github.com/fahamgeer177/Triage.AI/issues)
- **Hackathon**: Internet of Agents @ Solana Skyline

---
*Powered by Coral Protocol & OpenAI*
`;

    fs.writeFileSync(path.join(__dirname, 'PUBLIC_ACCESS.md'), readmeContent);
    console.log('\n📝 Created PUBLIC_ACCESS.md with usage instructions');
  }

  async run() {
    console.log('🌐 Public Agent Configuration');
    console.log('=' .repeat(40));

    const publicURL = await this.getPublicURL();
    
    if (!publicURL) {
      console.log('❌ No URL provided. Exiting...');
      rl.close();
      return;
    }

    // Validate URL format
    try {
      new URL(publicURL);
    } catch (error) {
      console.log('❌ Invalid URL format. Please provide a valid URL.');
      rl.close();
      return;
    }

    console.log(`\n🔄 Updating registration for: ${publicURL}`);
    
    const updated = await this.updateRegistration(publicURL);
    if (updated) {
      await this.createPublicReadme(publicURL);
      
      console.log('\n🎉 Your agent is now publicly accessible!');
      console.log('\n📤 Share these URLs:');
      console.log(`   🔗 Agent URL: ${publicURL}`);
      console.log(`   📋 Registration: ./coral-registration.json`);
      console.log(`   📖 Usage Guide: ./PUBLIC_ACCESS.md`);
    }

    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  const manager = new PublicAgentManager();
  manager.run().catch(console.error);
}

module.exports = PublicAgentManager;