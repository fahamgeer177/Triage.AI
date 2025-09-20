import React from 'react';
import { Bot, Github, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Triage<span className="text-primary-600">.AI</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                AI-Powered GitHub Issue Triage
              </span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-4">
            {/* Coral Protocol Badge */}
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
              <Zap className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                Coral Protocol
              </span>
            </div>

            {/* GitHub Badge */}
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <Github className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                GitHub API
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            Automatically analyze and prioritize GitHub issues using AI-powered triage agents
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;