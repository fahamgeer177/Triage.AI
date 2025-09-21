#!/usr/bin/env node

/**
 * Startup script for Triage Agent with enhanced logging and error handling
 */

const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('🚀 Starting Triage Agent...');
console.log('📋 Environment Check:');
console.log(`   - Node Version: ${process.version}`);
console.log(`   - Platform: ${process.platform}`);
console.log(`   - PORT: ${process.env.PORT || process.env.AGENT_PORT || 3001}`);
console.log(`   - HOST: ${process.env.HOST || '0.0.0.0'}`);
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   - OpenAI Key: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);

// Check for required dependencies
try {
  const requiredModules = ['express', 'cors', 'helmet', 'morgan', 'dotenv'];
  
  for (const module of requiredModules) {
    require.resolve(module);
    console.log(`   - ${module}: ✅ Available`);
  }
} catch (error) {
  console.error(`❌ Missing dependency: ${error.message}`);
  process.exit(1);
}

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});

// Start the main application
try {
  console.log('🔄 Loading main application...');
  require('./src/index.js');
} catch (error) {
  console.error('💥 Failed to start application:', error);
  process.exit(1);
}