const express = require('express');
const { Octokit } = require('@octokit/rest');

const router = express.Router();

// Function to get Octokit instance with current environment
const getOctokit = () => {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN
  });
};

// ✅ Temporary handler for old query-style route
router.get('/issues', async (req, res) => {
  try {
    const repo = req.query.repo;
    if (!repo) return res.status(400).json({ error: 'Missing repo query' });

    // Split owner/repo
    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      return res.status(400).json({ error: 'Invalid repo format. Use owner/repo' });
    }

    console.log(`[GITHUB] Fallback route: Fetching issues for ${owner}/${repoName}`);

    // Validate GitHub token
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        error: 'GitHub token not configured',
        message: 'GITHUB_TOKEN environment variable is required'
      });
    }

    // Fetch issues from GitHub API using Octokit
    const octokit = getOctokit();
    const response = await octokit.rest.issues.listForRepo({
      owner,
      repo: repoName,
      state: 'open',
      per_page: 10,
      sort: 'updated',
      direction: 'desc'
    });

    // Transform the response to match expected format
    const issues = response.data.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      state: issue.state,
      labels: issue.labels.map(label => ({
        name: label.name,
        color: label.color,
        description: label.description
      })),
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      comments_count: issue.comments || 0,
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url
      },
      html_url: issue.html_url
    }));

    res.json({ issues });
  } catch (err) {
    console.error('[GITHUB] Issues fallback error:', err.response?.data || err.message);
    if (err.status === 404) {
      res.status(404).json({ error: 'Repository not found or not accessible' });
    } else if (err.status === 401) {
      res.status(401).json({ error: 'GitHub token invalid or insufficient permissions' });
    } else {
      res.status(500).json({ error: 'GitHub issues fetch failed' });
    }
  }
});

/**
 * GET /api/github/repos/:owner/:repo/issues
 * Fetch issues from a GitHub repository
 */
router.get('/repos/:owner/:repo/issues', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open', per_page = 5, sort = 'updated', direction = 'desc' } = req.query;

    console.log(`[GITHUB] Fetching issues for ${owner}/${repo}`);

    // Validate GitHub token
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        error: 'GitHub token not configured',
        message: 'GITHUB_TOKEN environment variable is required'
      });
    }

    // Fetch issues from GitHub API
    const octokit = getOctokit();
    const response = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state,
      per_page: parseInt(per_page),
      sort,
      direction
    });

    // Transform the response to include only relevant data
    const issues = response.data.map(issue => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: issue.body || '',
      state: issue.state,
      labels: issue.labels.map(label => ({
        name: label.name,
        color: label.color,
        description: label.description
      })),
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url
      },
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      html_url: issue.html_url,
      comments_count: issue.comments,
      assignees: issue.assignees.map(assignee => ({
        login: assignee.login,
        avatar_url: assignee.avatar_url
      }))
    }));

    console.log(`[GITHUB] Found ${issues.length} issues`);

    res.json({
      repository: `${owner}/${repo}`,
      total_count: issues.length,
      issues
    });

  } catch (error) {
    console.error('[GITHUB] Error fetching issues:', error);

    if (error.status === 404) {
      return res.status(404).json({
        error: 'Repository not found',
        message: 'The specified repository does not exist or is not accessible'
      });
    }

    if (error.status === 401) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid GitHub token or insufficient permissions'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch issues',
      message: error.message || 'An error occurred while fetching GitHub issues'
    });
  }
});

/**
 * GET /api/github/repos/:owner/:repo/issues/:issue_number/comments
 * Fetch comments for a specific issue
 */
router.get('/repos/:owner/:repo/issues/:issue_number/comments', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;

    console.log(`[GITHUB] Fetching comments for issue #${issue_number} in ${owner}/${repo}`);

    const octokit = getOctokit();
    const response = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: parseInt(issue_number)
    });

    const comments = response.data.map(comment => ({
      id: comment.id,
      body: comment.body,
      user: {
        login: comment.user.login,
        avatar_url: comment.user.avatar_url
      },
      created_at: comment.created_at,
      updated_at: comment.updated_at
    }));

    console.log(`[GITHUB] Found ${comments.length} comments`);

    res.json({
      issue_number: parseInt(issue_number),
      comments_count: comments.length,
      comments
    });

  } catch (error) {
    console.error('[GITHUB] Error fetching comments:', error);

    if (error.status === 404) {
      return res.status(404).json({
        error: 'Issue not found',
        message: 'The specified issue does not exist'
      });
    }

    res.status(500).json({
      error: 'Failed to fetch comments',
      message: error.message || 'An error occurred while fetching issue comments'
    });
  }
});

/**
 * GET /api/github/user
 * Get authenticated user information
 */
router.get('/user', async (req, res) => {
  try {
    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({
        error: 'GitHub token not configured',
        authenticated: false
      });
    }

    const octokit = getOctokit();
    const response = await octokit.rest.users.getAuthenticated();

    res.json({
      authenticated: true,
      user: {
        login: response.data.login,
        name: response.data.name,
        avatar_url: response.data.avatar_url,
        public_repos: response.data.public_repos
      }
    });

  } catch (error) {
    console.error('[GITHUB] Error getting user info:', error);

    res.status(401).json({
      authenticated: false,
      error: 'Invalid GitHub token',
      message: 'Please check your GITHUB_TOKEN environment variable'
    });
  }
});

/**
 * GET /api/github/search/repositories
 * Search for repositories
 */
router.get('/search/repositories', async (req, res) => {
  try {
    const { q, per_page = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Missing query parameter',
        message: 'Query parameter "q" is required'
      });
    }

    const octokit = getOctokit();
    const response = await octokit.rest.search.repos({
      q,
      per_page: parseInt(per_page),
      sort: 'updated'
    });

    const repositories = response.data.items.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      open_issues_count: repo.open_issues_count,
      updated_at: repo.updated_at
    }));

    res.json({
      total_count: response.data.total_count,
      repositories
    });

  } catch (error) {
    console.error('[GITHUB] Error searching repositories:', error);

    res.status(500).json({
      error: 'Search failed',
      message: error.message || 'An error occurred while searching repositories'
    });
  }
});

module.exports = router;