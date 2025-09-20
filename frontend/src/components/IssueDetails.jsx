import React, { useState } from 'react';
import { FileText, Calendar, User, MessageCircle, Tag, ExternalLink, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';

const IssueDetails = ({ issue, onTriageStart, onTriageComplete, isAnalyzing, repository }) => {
  const [error, setError] = useState(null);

  const handleRunTriage = async () => {
    if (!issue) return;

    onTriageStart();
    setError(null);

    try {
      const payload = {
        title: issue.title,
        body: issue.body || '',
        labels: issue.labels.map(label => label.name),
        repository: repository,
        issue_number: issue.number
      };

      const response = await axios.post('/api/triage/analyze', payload, {
        timeout: 60000 // 60 second timeout for AI analysis
      });

      onTriageComplete(response.data);
    } catch (error) {
      console.error('Triage analysis failed:', error);
      
      let errorMessage = 'Failed to analyze issue';
      if (error.response?.status === 503) {
        errorMessage = 'Triage agent is not available. Please ensure it is running.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request to triage agent';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Analysis timed out. Please try again.';
      }
      
      setError(errorMessage);
      onTriageComplete(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 300) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!issue) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Select an issue to view details</p>
          <p className="text-sm mt-1">Choose an issue from the list to see its details and run triage analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Issue Details
          </h2>
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View on GitHub
          </a>
        </div>
        
        <div className="text-sm text-gray-600">
          #{issue.number} • {repository}
        </div>
      </div>

      {/* Issue Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Title */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">{issue.title}</h3>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>{issue.user.login}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(issue.created_at)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span>{issue.comments_count} comments</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Tag className="h-4 w-4 mr-2" />
            <span>{issue.labels.length} labels</span>
          </div>
        </div>

        {/* Labels */}
        {issue.labels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {issue.labels.map((label) => (
                <span
                  key={label.name}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `#${label.color}20`,
                    color: `#${label.color}`,
                    border: `1px solid #${label.color}40`
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        {issue.body && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <pre className="whitespace-pre-wrap font-sans">
                {truncateText(issue.body)}
              </pre>
              {issue.body.length > 300 && (
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 text-xs mt-2 inline-block"
                >
                  Read full description on GitHub →
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Triage Action */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleRunTriage}
          disabled={isAnalyzing}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Run Triage Analysis
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 mt-2 text-center">
          AI analysis typically takes 10-30 seconds
        </p>
      </div>
    </div>
  );
};

export default IssueDetails;