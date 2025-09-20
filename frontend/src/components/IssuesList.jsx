import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Github, Calendar, MessageCircle, Tag } from 'lucide-react';
import axios from 'axios';

const IssuesList = ({ onIssueSelect, selectedIssue, onRepositoryChange, repository }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoInput, setRepoInput] = useState(repository);

  const fetchIssues = async (repo) => {
    // Handle GitHub URLs and extract owner/repo
    let cleanRepo = repo.trim();
    if (cleanRepo.startsWith('http')) {
      // Extract owner/repo from GitHub URL
      const match = cleanRepo.match(/github\.com\/([^\/]+\/[^\/]+)/);
      if (match) {
        cleanRepo = match[1];
      } else {
        setError('Invalid GitHub URL format');
        return;
      }
    }
    
    if (!cleanRepo || !cleanRepo.includes('/')) {
      setError('Please enter a valid repository (owner/repo)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [owner, repoName] = cleanRepo.split('/');
      const url = `/api/github/repos/${owner}/${repoName}/issues?per_page=10`;
      const response = await axios.get(url);
      setIssues(response.data.issues || []);
      onRepositoryChange(cleanRepo);
    } catch (error) {
      console.error('Error fetching issues:', error);
      if (error.response?.status === 404) {
        setError('Repository not found or not accessible');
      } else if (error.response?.status === 401) {
        setError('GitHub token required or invalid');
      } else {
        setError('Failed to fetch issues. Please try again.');
      }
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (repoInput.trim()) {
      fetchIssues(repoInput.trim());
    }
  };

  const handleRefresh = () => {
    if (repository) {
      fetchIssues(repository);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (labels) => {
    const priority = labels.find(label => 
      ['critical', 'high', 'medium', 'low'].some(p => 
        label.name.toLowerCase().includes(p)
      )
    );
    
    if (priority) {
      const name = priority.name.toLowerCase();
      if (name.includes('critical')) return 'bg-red-100 text-red-800';
      if (name.includes('high')) return 'bg-orange-100 text-orange-800';
      if (name.includes('medium')) return 'bg-yellow-100 text-yellow-800';
      if (name.includes('low')) return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    if (repository && repository !== repoInput) {
      setRepoInput(repository);
    }
  }, [repository]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Github className="h-5 w-5 mr-2" />
            GitHub Issues
          </h2>
          {repository && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh issues"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Repository Search */}
        <form onSubmit={handleSearch} className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="Enter repository (e.g., facebook/react or GitHub URL)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !repoInput.trim()}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load Issues'}
          </button>
        </form>
      </div>

      {/* Issues List */}
      <div className="max-h-96 overflow-y-auto">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-200">
            {error}
          </div>
        )}

        {!error && issues.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            <Github className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No issues found</p>
            <p className="text-sm mt-1">Enter a repository above to get started</p>
          </div>
        )}

        {loading && (
          <div className="p-8 text-center">
            <RefreshCw className="h-6 w-6 mx-auto mb-2 text-gray-400 animate-spin" />
            <p className="text-gray-500">Loading issues...</p>
          </div>
        )}

        {issues.map((issue) => (
          <div
            key={issue.id}
            onClick={() => onIssueSelect(issue)}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
              selectedIssue?.id === issue.id ? 'bg-primary-50 border-l-4 border-l-primary-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  #{issue.number} {issue.title}
                </h3>
                
                <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(issue.created_at)}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {issue.comments_count}
                  </div>
                </div>

                {/* Labels */}
                {issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {issue.labels.slice(0, 3).map((label) => (
                      <span
                        key={label.name}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor([label])}`}
                      >
                        <Tag className="h-2 w-2 mr-1" />
                        {label.name}
                      </span>
                    ))}
                    {issue.labels.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{issue.labels.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesList;