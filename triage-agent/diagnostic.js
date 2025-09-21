// Simple test to check if the agent can start
const path = require('path');
const fs = require('fs');

console.log('=== TRIAGE AGENT DIAGNOSTIC ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Check if files exist
const filesToCheck = [
  'package.json',
  'src/index.js',
  '.env'
];

filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

// Check dependencies
const requiredDeps = ['express', 'cors', 'helmet', 'morgan', 'dotenv'];
requiredDeps.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep} available`);
  } catch (error) {
    console.log(`❌ ${dep} missing`);
  }
});

// Try loading env
try {
  require('dotenv').config();
  console.log('✅ Environment loaded');
  console.log(`PORT: ${process.env.PORT || process.env.AGENT_PORT || 'not set'}`);
  console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? 'set' : 'not set'}`);
} catch (error) {
  console.log('❌ Environment loading failed:', error.message);
}

// Try to start a simple server
try {
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || process.env.AGENT_PORT || 3001;
  
  app.get('/test', (req, res) => {
    res.json({ status: 'working', timestamp: new Date().toISOString() });
  });
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Test server running on 0.0.0.0:${PORT}`);
    
    // Test the endpoint
    setTimeout(() => {
      const http = require('http');
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: '/test',
        method: 'GET',
      };
      
      const req = http.request(options, (res) => {
        console.log(`✅ Test endpoint responded with status: ${res.statusCode}`);
        server.close();
        process.exit(0);
      });
      
      req.on('error', (err) => {
        console.log(`❌ Test endpoint failed: ${err.message}`);
        server.close();
        process.exit(1);
      });
      
      req.end();
    }, 1000);
  });
  
  server.on('error', (error) => {
    console.log('❌ Server failed to start:', error.message);
    process.exit(1);
  });
  
} catch (error) {
  console.log('❌ Failed to create test server:', error.message);
  process.exit(1);
}