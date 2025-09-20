const axios = require('axios');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

async function testBackend() {
  console.log('🧪 Testing Triage.AI Backend...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log();

    // Test triage agent health
    console.log('2. Testing triage agent health...');
    const agentHealthResponse = await axios.get(`${BACKEND_URL}/api/triage/agent/health`);
    console.log('✅ Agent health:', agentHealthResponse.data);
    console.log();

    // Test triage agent metadata
    console.log('3. Testing triage agent metadata...');
    const metadataResponse = await axios.get(`${BACKEND_URL}/api/triage/agent/metadata`);
    console.log('✅ Agent metadata:', JSON.stringify(metadataResponse.data, null, 2));
    console.log();

    // Test triage analysis
    console.log('4. Testing triage analysis...');
    const analysisPayload = {
      title: 'Test issue for backend testing',
      body: 'This is a test issue to verify the backend triage functionality works correctly',
      repository: 'test/repo'
    };

    const analysisResponse = await axios.post(`${BACKEND_URL}/api/triage/analyze`, analysisPayload);
    console.log('✅ Triage analysis:', JSON.stringify(analysisResponse.data, null, 2));
    console.log();

    console.log('🎉 All backend tests passed!');

  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Test GitHub endpoints (requires GITHUB_TOKEN)
async function testGitHubEndpoints() {
  console.log('🐙 Testing GitHub endpoints...\n');

  try {
    // Test user authentication
    console.log('1. Testing GitHub user authentication...');
    const userResponse = await axios.get(`${BACKEND_URL}/api/github/user`);
    console.log('✅ GitHub user:', userResponse.data);
    console.log();

    // Test repository search
    console.log('2. Testing repository search...');
    const searchResponse = await axios.get(`${BACKEND_URL}/api/github/search/repositories?q=javascript&per_page=3`);
    console.log('✅ Repository search:', {
      total_count: searchResponse.data.total_count,
      found_repos: searchResponse.data.repositories.length
    });
    console.log();

    console.log('🎉 All GitHub tests passed!');

  } catch (error) {
    console.error('❌ GitHub test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  testBackend().then(() => {
    if (process.env.GITHUB_TOKEN) {
      return testGitHubEndpoints();
    } else {
      console.log('⚠️  Skipping GitHub tests (GITHUB_TOKEN not set)');
    }
  });
}

module.exports = { testBackend, testGitHubEndpoints };