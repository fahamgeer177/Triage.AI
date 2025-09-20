const axios = require('axios');

const AGENT_URL = process.env.TRIAGE_AGENT_URL || 'http://localhost:3001';

async function testAgent() {
  console.log('🧪 Testing Triage Agent...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${AGENT_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log();

    // Test metadata endpoint
    console.log('2. Testing metadata endpoint...');
    const metadataResponse = await axios.get(`${AGENT_URL}/metadata`);
    console.log('✅ Metadata:', JSON.stringify(metadataResponse.data, null, 2));
    console.log();

    // Test analysis endpoint with sample issue
    console.log('3. Testing analysis endpoint...');
    const sampleIssue = {
      title: 'Application crashes when clicking save button',
      body: `When I click the save button in the form, the entire application crashes with a null pointer exception. This happens consistently on both Chrome and Firefox browsers.

Steps to reproduce:
1. Open the form
2. Fill in some data
3. Click save button
4. Application crashes

Expected: Data should be saved
Actual: Application crashes`,
      comments: [
        'I can reproduce this issue as well',
        'Seems to be related to the validation logic'
      ],
      labels: ['bug'],
      repository: 'test/sample-repo'
    };

    const analysisResponse = await axios.post(`${AGENT_URL}/analyze`, sampleIssue);
    console.log('✅ Analysis result:', JSON.stringify(analysisResponse.data, null, 2));
    console.log();

    console.log('🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  testAgent();
}

module.exports = { testAgent };