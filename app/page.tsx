'use client';

import { useState } from 'react';
import CommitGenerator from '@/components/CommitGenerator';
import GitStatus from '@/components/GitStatus';

export default function Home() {
  const [repoPath, setRepoPath] = useState('.');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Git Commit Assistant
          </h1>
          <p className="text-gray-600">
            AI-powered commit messages using MCP and LLMs
          </p>
        </header>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repository Path
          </label>
          <input
            type="text"
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter git repository path (default: current directory)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GitStatus repoPath={repoPath} refreshKey={refreshKey} />
          <CommitGenerator repoPath={repoPath} onCommitSuccess={handleRefresh} />
        </div>
      </div>
    </main>
  );
}
