'use client';

import { useState } from 'react';

interface CommitGeneratorProps {
  repoPath: string;
  onCommitSuccess: () => void;
}

export default function CommitGenerator({ repoPath, onCommitSuccess }: CommitGeneratorProps) {
  const [commitMessage, setCommitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const generateCommitMessage = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('/api/git/generate-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoPath }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate commit message');
      }
      
      const data = await response.json();
      setCommitMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      setError('Commit message cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoPath, message: commitMessage }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to commit');
      }
      
      setSuccess(true);
      setCommitMessage('');
      onCommitSuccess();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Commit Message Generator</h2>

      <div className="space-y-4">
        <button
          onClick={generateCommitMessage}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Commit Message'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded p-4 text-green-700 text-sm">
            Commit successful!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commit Message
          </label>
          <textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Generated commit message will appear here..."
          />
        </div>

        <button
          onClick={handleCommit}
          disabled={loading || !commitMessage.trim()}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Committing...' : 'Commit Changes'}
        </button>

        <p className="text-xs text-gray-500">
          Tip: Review and edit the generated message before committing
        </p>
      </div>
    </div>
  );
}
