'use client';

import { useEffect, useState } from 'react';

interface GitStatusProps {
  repoPath: string;
  refreshKey: number;
}

interface StatusData {
  branch: string;
  staged: string[];
  unstaged: string[];
  untracked: string[];
}

export default function GitStatus({ repoPath, refreshKey }: GitStatusProps) {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, [repoPath, refreshKey]);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/git/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoPath }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch git status');
      
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Git Status</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Git Status</h2>
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Git Status</h2>
        <button
          onClick={fetchStatus}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {status && (
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Branch:</span>
            <span className="ml-2 text-gray-900">{status.branch}</span>
          </div>

          {status.staged.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-green-700 mb-2">
                Staged Changes ({status.staged.length})
              </h3>
              <ul className="space-y-1">
                {status.staged.map((file, idx) => (
                  <li key={idx} className="text-sm text-gray-700 pl-4">
                    • {file}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {status.unstaged.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-yellow-700 mb-2">
                Unstaged Changes ({status.unstaged.length})
              </h3>
              <ul className="space-y-1">
                {status.unstaged.map((file, idx) => (
                  <li key={idx} className="text-sm text-gray-700 pl-4">
                    • {file}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {status.untracked.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Untracked Files ({status.untracked.length})
              </h3>
              <ul className="space-y-1">
                {status.untracked.map((file, idx) => (
                  <li key={idx} className="text-sm text-gray-700 pl-4">
                    • {file}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {status.staged.length === 0 && 
           status.unstaged.length === 0 && 
           status.untracked.length === 0 && (
            <p className="text-gray-500 text-sm">No changes detected</p>
          )}
        </div>
      )}
    </div>
  );
}
