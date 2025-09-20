const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const githubRoutes = require('./routes/github');
const triageRoutes = require('./routes/triage');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'triage-ai-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/github', githubRoutes);
app.use('/api/triage', triageRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Triage.AI Backend',
    version: '1.0.0',
    description: 'Backend orchestration server for AI-powered GitHub issue triage',
    endpoints: {
      health: '/health',
      github: '/api/github/*',
      triage: '/api/triage/*'
    },
    documentation: 'https://github.com/your-org/triage-ai'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    available_routes: [
      'GET /health',
      'GET /api/github/repos/:owner/:repo/issues',
      'POST /api/triage/analyze'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('[BACKEND] Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Triage.AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🐙 GitHub API: http://localhost:${PORT}/api/github`);
  console.log(`🤖 Triage API: http://localhost:${PORT}/api/triage`);
});

module.exports = app;