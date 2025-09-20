const express = require('express');
const axios = require('axios');

const router = express.Router();

const TRIAGE_AGENT_URL = process.env.TRIAGE_AGENT_URL || 'http://localhost:3001';

/**
 * POST /api/triage/analyze
 * Analyze a GitHub issue using the Coral triage agent
 */
router.post('/analyze', async (req, res) => {
  try {
    const { title, body, comments = [], labels = [], repository, issue_number } = req.body;

    // Validate required fields
    if (!title || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'title and body are required',
        required_fields: ['title', 'body']
      });
    }

    console.log(`[TRIAGE] Analyzing issue: "${title.substring(0, 50)}..." from ${repository || 'unknown repo'}`);

    // Prepare payload for the triage agent
    const payload = {
      title,
      body,
      comments: Array.isArray(comments) ? comments : [],
      labels: Array.isArray(labels) ? labels.map(l => typeof l === 'string' ? l : l.name) : [],
      repository: repository || 'unknown'
    };

    // Call the Coral triage agent
    const agentResponse = await axios.post(`${TRIAGE_AGENT_URL}/analyze`, payload, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const analysis = agentResponse.data;

    // Add metadata
    const result = {
      ...analysis,
      issue_number,
      repository,
      analyzed_at: new Date().toISOString(),
      agent_url: TRIAGE_AGENT_URL
    };

    console.log(`[TRIAGE] Analysis complete. Priority: ${result.priority}, Confidence: ${result.confidence}`);

    res.json(result);

  } catch (error) {
    console.error('[TRIAGE] Error calling triage agent:', error);

    // Handle different types of errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Triage agent unavailable',
        message: 'Cannot connect to the triage agent. Please ensure it is running.',
        agent_url: TRIAGE_AGENT_URL
      });
    }

    if (error.response && error.response.status === 400) {
      return res.status(400).json({
        error: 'Invalid request to triage agent',
        message: error.response.data?.message || 'Bad request',
        details: error.response.data
      });
    }

    if (error.response && error.response.status >= 500) {
      return res.status(502).json({
        error: 'Triage agent error',
        message: 'The triage agent encountered an internal error',
        details: error.response.data
      });
    }

    // Fallback error response
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message || 'An unexpected error occurred during analysis',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/triage/agent/health
 * Check the health of the triage agent
 */
router.get('/agent/health', async (req, res) => {
  try {
    const response = await axios.get(`${TRIAGE_AGENT_URL}/health`, {
      timeout: 5000
    });

    res.json({
      agent_status: 'healthy',
      agent_url: TRIAGE_AGENT_URL,
      agent_response: response.data,
      checked_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('[TRIAGE] Agent health check failed:', error);

    res.status(503).json({
      agent_status: 'unhealthy',
      agent_url: TRIAGE_AGENT_URL,
      error: error.message,
      checked_at: new Date().toISOString()
    });
  }
});

/**
 * GET /api/triage/agent/metadata
 * Get metadata from the triage agent
 */
router.get('/agent/metadata', async (req, res) => {
  try {
    const response = await axios.get(`${TRIAGE_AGENT_URL}/metadata`, {
      timeout: 5000
    });

    res.json({
      agent_url: TRIAGE_AGENT_URL,
      metadata: response.data,
      retrieved_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('[TRIAGE] Failed to get agent metadata:', error);

    res.status(503).json({
      error: 'Cannot retrieve agent metadata',
      agent_url: TRIAGE_AGENT_URL,
      message: error.message
    });
  }
});

/**
 * POST /api/triage/batch
 * Analyze multiple issues in batch (for bulk operations)
 */
router.post('/batch', async (req, res) => {
  try {
    const { issues } = req.body;

    if (!Array.isArray(issues) || issues.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'issues must be a non-empty array'
      });
    }

    if (issues.length > 10) {
      return res.status(400).json({
        error: 'Too many issues',
        message: 'Maximum 10 issues allowed per batch request'
      });
    }

    console.log(`[TRIAGE] Batch analyzing ${issues.length} issues`);

    const results = [];
    const errors = [];

    // Process issues sequentially to avoid overwhelming the agent
    for (let i = 0; i < issues.length; i++) {
      const issue = issues[i];
      
      try {
        const payload = {
          title: issue.title,
          body: issue.body,
          comments: issue.comments || [],
          labels: issue.labels || [],
          repository: issue.repository
        };

        const agentResponse = await axios.post(`${TRIAGE_AGENT_URL}/analyze`, payload, {
          timeout: 30000
        });

        results.push({
          index: i,
          issue_number: issue.number,
          analysis: agentResponse.data,
          status: 'success'
        });

      } catch (error) {
        console.error(`[TRIAGE] Batch item ${i} failed:`, error.message);
        
        errors.push({
          index: i,
          issue_number: issue.number,
          error: error.message,
          status: 'failed'
        });
      }
    }

    res.json({
      batch_size: issues.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('[TRIAGE] Batch analysis failed:', error);

    res.status(500).json({
      error: 'Batch analysis failed',
      message: error.message
    });
  }
});

module.exports = router;