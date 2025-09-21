const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const triageService = require('./services/triageService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || process.env.AGENT_PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    const healthData = {
      status: 'healthy', 
      agent: 'triage-agent',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        port: PORT,
        host: process.env.HOST || '0.0.0.0'
      },
      config: {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    };
    
    console.log(`[HEALTH] Health check requested - Status: healthy`);
    res.status(200).json(healthData);
  } catch (error) {
    console.error('[HEALTH] Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint for basic connectivity check
app.get('/', (req, res) => {
  res.json({
    message: 'Triage Agent is running',
    agent: 'triage-agent',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      metadata: '/metadata', 
      analyze: '/analyze'
    }
  });
});

// Agent metadata endpoint (Coral Protocol requirement)
app.get('/metadata', (req, res) => {
  res.json({
    name: 'triage-agent',
    version: '1.0.0',
    description: 'AI-powered GitHub issue triage agent',
    author: 'Triage.AI Team',
    endpoints: {
      analyze: {
        method: 'POST',
        path: '/analyze',
        description: 'Analyze GitHub issue and provide triage recommendations'
      }
    },
    schema: {
      input: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Issue title' },
          body: { type: 'string', description: 'Issue description' },
          comments: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'Optional issue comments'
          },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Existing labels'
          },
          repository: { type: 'string', description: 'Repository name' }
        },
        required: ['title', 'body']
      },
      output: {
        type: 'object',
        properties: {
          priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high', 'critical'],
            description: 'Issue priority level'
          },
          severity: { 
            type: 'string', 
            enum: ['minor', 'moderate', 'major', 'critical'],
            description: 'Issue severity level'
          },
          suggested_labels: {
            type: 'array',
            items: { type: 'string' },
            description: 'Recommended labels for the issue'
          },
          summary: { 
            type: 'string', 
            description: 'Brief summary of the issue'
          },
          next_steps: {
            type: 'array',
            items: { type: 'string' },
            description: 'Recommended next steps'
          },
          confidence: { 
            type: 'number', 
            minimum: 0, 
            maximum: 1,
            description: 'Confidence score of the analysis'
          },
          reasoning: {
            type: 'string',
            description: 'Explanation of the triage decision'
          }
        }
      }
    }
  });
});

// Main triage analysis endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { title, body, comments = [], labels = [], repository } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'title and body are required'
      });
    }

    console.log(`[TRIAGE] Analyzing issue: "${title.substring(0, 50)}..."`);

    // Call the triage service
    const result = await triageService.analyzeIssue({
      title,
      body,
      comments,
      labels,
      repository
    });

    console.log(`[TRIAGE] Analysis complete. Priority: ${result.priority}, Confidence: ${result.confidence}`);

    res.json(result);

  } catch (error) {
    console.error('[TRIAGE] Error analyzing issue:', error);
    
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      priority: 'medium', // fallback
      severity: 'moderate', // fallback
      confidence: 0.1
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('[AGENT] Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// Start the server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🤖 Triage Agent running on ${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📋 Metadata: http://${HOST}:${PORT}/metadata`);
  console.log(`🔍 Analysis endpoint: http://${HOST}:${PORT}/analyze`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;