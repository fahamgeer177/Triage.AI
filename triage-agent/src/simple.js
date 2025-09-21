const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// Basic middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Triage Agent is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint - CRITICAL for deployment
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    agent: 'triage-agent',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    port: PORT,
    host: HOST
  });
});

// Analysis endpoint with simple fallback
app.post('/analyze', async (req, res) => {
  try {
    const { title, body } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Simple analysis response (without OpenAI for now)
    const analysis = {
      priority: 'medium',
      severity: 'moderate',
      suggested_labels: ['bug'],
      summary: `Analysis for: ${title}`,
      next_steps: ['Review the issue', 'Assign to team member'],
      confidence: 0.8,
      reasoning: 'Basic analysis based on title and content',
      timestamp: new Date().toISOString(),
      agent_version: '1.0.0'
    };
    
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🤖 Triage Agent running on ${HOST}:${PORT}`);
  console.log(`📊 Health: http://${HOST}:${PORT}/health`);
  console.log(`🔍 Analysis: http://${HOST}:${PORT}/analyze`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;