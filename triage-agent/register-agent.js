#!/usr/bin/env node

/**
 * Coral Protocol Agent Registration Script
 * 
 * This script registers your triage-agent with the Coral Protocol ecosystem
 * since the official CLI is not yet available.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const axios = require('axios');

class CoralAgentRegistrar {
  constructor() {
    this.agentPath = path.join(__dirname, 'agent.yaml');
    this.agentConfig = null;
    this.registryEndpoints = [
      'https://registry.coralprotocol.org', // Official registry (if available)
      'http://localhost:8080', // Local Coral server
    ];
  }

  async loadAgentConfig() {
    try {
      const yamlContent = fs.readFileSync(this.agentPath, 'utf8');
      this.agentConfig = yaml.load(yamlContent);
      console.log('✅ Agent configuration loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error loading agent.yaml:', error.message);
      return false;
    }
  }

  async validateAgent() {
    console.log('\n🔍 Validating agent configuration...');
    
    const requiredFields = ['name', 'version', 'description', 'runtime', 'endpoints'];
    const missing = requiredFields.filter(field => !this.agentConfig[field]);
    
    if (missing.length > 0) {
      console.error(`❌ Missing required fields: ${missing.join(', ')}`);
      return false;
    }

    // Test agent endpoints
    const baseUrl = `http://${this.agentConfig.runtime.host}:${this.agentConfig.runtime.port}`;
    
    try {
      // Test health endpoint
      const healthResponse = await axios.get(`${baseUrl}/health`, { timeout: 5000 });
      console.log('✅ Health endpoint accessible');

      // Test metadata endpoint
      const metadataResponse = await axios.get(`${baseUrl}/metadata`, { timeout: 5000 });
      console.log('✅ Metadata endpoint accessible');

      // Validate metadata response
      const metadata = metadataResponse.data;
      if (metadata.name === this.agentConfig.name && metadata.version === this.agentConfig.version) {
        console.log('✅ Metadata consistency verified');
      } else {
        console.warn('⚠️ Metadata inconsistency detected');
      }

      return true;
    } catch (error) {
      console.error('❌ Agent endpoint validation failed:', error.message);
      console.log('💡 Make sure your agent is running on the specified port');
      return false;
    }
  }

  async registerWithRegistry(registryUrl) {
    try {
      const registrationPayload = {
        agent: {
          name: this.agentConfig.name,
          version: this.agentConfig.version,
          description: this.agentConfig.description,
          author: this.agentConfig.author,
          license: this.agentConfig.license,
          tags: this.agentConfig.tags,
          runtime: this.agentConfig.runtime,
          endpoints: this.agentConfig.endpoints,
          schema: this.agentConfig.schema,
          coral: this.agentConfig.coral
        },
        timestamp: new Date().toISOString(),
        registry_version: '1.0.0'
      };

      console.log(`📡 Attempting registration with ${registryUrl}...`);
      
      const response = await axios.post(`${registryUrl}/api/agents/register`, registrationPayload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'coral-agent-registrar/1.0.0'
        },
        timeout: 10000
      });

      if (response.status === 200 || response.status === 201) {
        console.log(`✅ Successfully registered with ${registryUrl}`);
        console.log(`🎯 Agent ID: ${response.data.agentId || 'N/A'}`);
        return true;
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`🔍 Registry not available at ${registryUrl}`);
      } else if (error.response) {
        console.error(`❌ Registration failed: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.error(`❌ Registration error: ${error.message}`);
      }
      return false;
    }
  }

  async generateRegistrationFile() {
    const registrationData = {
      agent: this.agentConfig,
      registration: {
        timestamp: new Date().toISOString(),
        registry_compatible: true,
        local_endpoint: `http://${this.agentConfig.runtime.host}:${this.agentConfig.runtime.port}`,
        status: 'ready'
      }
    };

    const outputPath = path.join(__dirname, 'coral-registration.json');
    fs.writeFileSync(outputPath, JSON.stringify(registrationData, null, 2));
    console.log(`📝 Registration file created: ${outputPath}`);
    
    return outputPath;
  }

  async register() {
    console.log('🚀 Starting Coral Protocol Agent Registration');
    console.log('=' .repeat(50));

    // Load and validate configuration
    if (!await this.loadAgentConfig()) return false;
    if (!await this.validateAgent()) return false;

    console.log('\n📋 Agent Summary:');
    console.log(`   Name: ${this.agentConfig.name}`);
    console.log(`   Version: ${this.agentConfig.version}`);
    console.log(`   Description: ${this.agentConfig.description}`);
    console.log(`   Runtime: ${this.agentConfig.runtime.type} on port ${this.agentConfig.runtime.port}`);

    // Try registering with available registries
    console.log('\n🌐 Attempting registry registration...');
    let registrationSuccess = false;

    for (const registryUrl of this.registryEndpoints) {
      const success = await this.registerWithRegistry(registryUrl);
      if (success) {
        registrationSuccess = true;
        break;
      }
    }

    // Generate local registration file
    console.log('\n📄 Generating local registration file...');
    await this.generateRegistrationFile();

    // Final status
    console.log('\n' + '=' .repeat(50));
    if (registrationSuccess) {
      console.log('🎉 Agent successfully registered with Coral Protocol!');
    } else {
      console.log('📝 Agent validated and prepared for registration');
      console.log('💡 No active Coral Protocol registry found');
      console.log('📁 Local registration file created for future use');
    }

    console.log('\n🔗 Your agent is accessible at:');
    console.log(`   Health: http://localhost:${this.agentConfig.runtime.port}/health`);
    console.log(`   Metadata: http://localhost:${this.agentConfig.runtime.port}/metadata`);
    console.log(`   Analyze: http://localhost:${this.agentConfig.runtime.port}/analyze`);

    return true;
  }
}

// Run registration if called directly
if (require.main === module) {
  const registrar = new CoralAgentRegistrar();
  registrar.register().catch(console.error);
}

module.exports = CoralAgentRegistrar;