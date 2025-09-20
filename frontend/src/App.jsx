import React, { useState } from 'react';
import Header from './components/Header';
import ConnectionStatus from './components/ConnectionStatus';
import IssuesList from './components/IssuesList';
import IssueDetails from './components/IssueDetails';
import TriageResults from './components/TriageResults';

function App() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [triageResults, setTriageResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repository, setRepository] = useState('');

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setTriageResults(null); // Clear previous results
  };

  const handleTriageComplete = (results) => {
    setTriageResults(results);
    setIsAnalyzing(false);
  };

  const handleTriageStart = () => {
    setIsAnalyzing(true);
    setTriageResults(null);
  };

  const handleRepositoryChange = (repo) => {
    setRepository(repo);
    setSelectedIssue(null);
    setTriageResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Connection Status */}
        <div className="mb-6">
          <ConnectionStatus />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Issues List */}
          <div className="lg:col-span-1">
            <IssuesList 
              onIssueSelect={handleIssueSelect}
              selectedIssue={selectedIssue}
              onRepositoryChange={handleRepositoryChange}
              repository={repository}
            />
          </div>

          {/* Middle Column - Issue Details */}
          <div className="lg:col-span-1">
            <IssueDetails 
              issue={selectedIssue}
              onTriageStart={handleTriageStart}
              onTriageComplete={handleTriageComplete}
              isAnalyzing={isAnalyzing}
              repository={repository}
            />
          </div>

          {/* Right Column - Triage Results */}
          <div className="lg:col-span-1">
            <TriageResults 
              results={triageResults}
              isAnalyzing={isAnalyzing}
              issue={selectedIssue}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            Triage.AI - Powered by{' '}
            <span className="font-semibold text-blue-600">Coral Protocol</span>
            {' '}& OpenAI
          </p>
          <p className="mt-1">
            Built for the Internet of Agents Hackathon @ Solana Skyline
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;