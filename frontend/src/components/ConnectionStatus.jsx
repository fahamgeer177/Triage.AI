import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    agent: 'checking',
    github: 'checking'
  });

  const checkConnections = async () => {
    const results = {
      backend: 'checking',
      agent: 'checking',
      github: 'checking'
    };

    try {
      // Check backend health
      await axios.get('/api/github/user', { timeout: 5000 });
      results.backend = 'connected';
      results.github = 'connected';
    } catch (error) {
      results.backend = 'error';
      if (error.response?.status === 401) {
        results.github = 'unauthorized';
      } else {
        results.github = 'error';
      }
    }

    try {
      // Check triage agent
      await axios.get('/api/triage/agent/health', { timeout: 5000 });
      results.agent = 'connected';
    } catch (error) {
      results.agent = 'error';
    }

    setStatus(results);
  };

  useEffect(() => {
    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (state) => {
    switch (state) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'unauthorized':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'checking':
      default:
        return <Clock className="h-4 w-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (state) => {
    switch (state) {
      case 'connected':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'unauthorized':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'checking':
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (service, state) => {
    switch (state) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'unauthorized':
        return service === 'github' ? 'Token Required' : 'Unauthorized';
      case 'checking':
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">System Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Backend Status */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.backend)}`}>
          {getStatusIcon(status.backend)}
          <div>
            <p className="text-sm font-medium">Backend API</p>
            <p className="text-xs">{getStatusText('backend', status.backend)}</p>
          </div>
        </div>

        {/* Triage Agent Status */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.agent)}`}>
          {getStatusIcon(status.agent)}
          <div>
            <p className="text-sm font-medium">Triage Agent</p>
            <p className="text-xs">{getStatusText('agent', status.agent)}</p>
          </div>
        </div>

        {/* GitHub Status */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.github)}`}>
          {getStatusIcon(status.github)}
          <div>
            <p className="text-sm font-medium">GitHub API</p>
            <p className="text-xs">{getStatusText('github', status.github)}</p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {status.github === 'unauthorized' && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ GitHub token not configured. Set GITHUB_TOKEN environment variable to access GitHub repositories.
          </p>
        </div>
      )}

      {status.agent === 'error' && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            ❌ Triage agent is not running. Start the agent with: <code className="bg-red-100 px-1 rounded">npm run dev:agent</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;