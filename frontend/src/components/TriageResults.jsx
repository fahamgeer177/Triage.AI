import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Tag, 
  MessageSquare, 
  Lightbulb,
  Target,
  Brain,
  Loader2
} from 'lucide-react';

const TriageResults = ({ results, isAnalyzing, issue }) => {
  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: AlertTriangle,
        description: 'Requires immediate attention'
      },
      high: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        icon: AlertTriangle,
        description: 'High priority, address soon'
      },
      medium: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock,
        description: 'Normal priority'
      },
      low: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle,
        description: 'Low priority'
      }
    };
    return configs[priority] || configs.medium;
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Critical impact on functionality'
      },
      major: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'Major impact, affects many users'
      },
      moderate: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Moderate impact'
      },
      minor: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Minor impact, low risk'
      }
    };
    return configs[severity] || configs.moderate;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatConfidence = (confidence) => {
    return `${Math.round(confidence * 100)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-primary-600 mr-2" />
            <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            AI Analysis in Progress
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Our Coral Protocol agent is analyzing the issue...
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                Processing issue content
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 animate-pulse"></div>
                Running AI analysis
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                Generating recommendations
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No analysis results yet</p>
          <p className="text-sm mt-1">
            {issue ? 'Click "Run Triage Analysis" to analyze the selected issue' : 'Select an issue and run analysis to see results here'}
          </p>
        </div>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(results.priority);
  const severityConfig = getSeverityConfig(results.severity);
  const PriorityIcon = priorityConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Triage Results
          </h2>
          <div className="text-xs text-gray-500">
            {results.analyzed_at && formatDate(results.analyzed_at)}
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="p-4 space-y-6 max-h-96 overflow-y-auto">
        {/* Priority and Severity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
            <div className={`flex items-center px-3 py-2 rounded-lg border ${priorityConfig.color}`}>
              <PriorityIcon className="h-4 w-4 mr-2" />
              <div>
                <div className="font-medium capitalize">{results.priority}</div>
                <div className="text-xs opacity-75">{priorityConfig.description}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Severity</label>
            <div className={`px-3 py-2 rounded-lg border ${severityConfig.color}`}>
              <div className="font-medium capitalize">{results.severity}</div>
              <div className="text-xs opacity-75">{severityConfig.description}</div>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
            <Target className="h-4 w-4 mr-1" />
            Confidence Score
          </label>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className={`text-lg font-semibold ${getConfidenceColor(results.confidence)}`}>
                {formatConfidence(results.confidence)}
              </span>
              <div className="flex-1 mx-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      results.confidence >= 0.8 ? 'bg-green-500' :
                      results.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${results.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {results.summary && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              Summary
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">{results.summary}</p>
            </div>
          </div>
        )}

        {/* Suggested Labels */}
        {results.suggested_labels && results.suggested_labels.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              Suggested Labels
            </label>
            <div className="flex flex-wrap gap-2">
              {results.suggested_labels.map((label, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 border border-primary-200"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {results.next_steps && results.next_steps.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <Lightbulb className="h-4 w-4 mr-1" />
              Recommended Next Steps
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <ul className="space-y-2">
                {results.next_steps.map((step, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Reasoning */}
        {results.reasoning && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              AI Reasoning
            </label>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <p className="text-sm text-blue-800">{results.reasoning}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {results.agent_version && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Analysis by Triage Agent v{results.agent_version} • Powered by Coral Protocol
          </p>
        </div>
      )}
    </div>
  );
};

export default TriageResults;