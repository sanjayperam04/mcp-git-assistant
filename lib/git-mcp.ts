import { createMCPClient, closeMCPClient, callMCPTool } from './mcp-client';

export interface GitStatus {
  branch: string;
  staged: string[];
  unstaged: string[];
  untracked: string[];
}

export async function getGitStatus(repoPath: string): Promise<GitStatus> {
  const mcpClient = await createMCPClient('npx', [
    '-y',
    '@modelcontextprotocol/server-git',
    repoPath,
  ]);

  try {
    // Get git status using MCP
    const statusResult = await callMCPTool(mcpClient.client, 'git_status', {
      repo_path: repoPath,
    });

    // Parse the status output
    const statusText = statusResult[0]?.text || '';
    
    // Get current branch
    const branchResult = await callMCPTool(mcpClient.client, 'git_log', {
      repo_path: repoPath,
      max_count: 1,
    });
    
    const branchMatch = branchResult[0]?.text?.match(/On branch (.+)/);
    const branch = branchMatch ? branchMatch[1] : 'main';

    // Parse status to categorize files
    const staged: string[] = [];
    const unstaged: string[] = [];
    const untracked: string[] = [];

    const lines = statusText.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      
      if (line.includes('Changes to be committed:')) continue;
      if (line.includes('Changes not staged for commit:')) continue;
      if (line.includes('Untracked files:')) continue;
      
      // Staged files (new file, modified, deleted in staging area)
      if (line.match(/^\s+(new file|modified|deleted):\s+(.+)$/)) {
        const match = line.match(/^\s+(new file|modified|deleted):\s+(.+)$/);
        if (match) staged.push(match[2].trim());
      }
      // Unstaged files
      else if (line.match(/^\s+modified:\s+(.+)$/) && !staged.includes(line.match(/^\s+modified:\s+(.+)$/)?.[1] || '')) {
        const match = line.match(/^\s+modified:\s+(.+)$/);
        if (match) unstaged.push(match[1].trim());
      }
      // Untracked files
      else if (line.match(/^\s+(.+)$/) && !line.includes(':')) {
        const file = line.trim();
        if (file && !file.startsWith('(')) {
          untracked.push(file);
        }
      }
    }

    return { branch, staged, unstaged, untracked };
  } finally {
    await closeMCPClient(mcpClient);
  }
}

export async function getGitDiff(repoPath: string, staged: boolean = true): Promise<string> {
  const mcpClient = await createMCPClient('npx', [
    '-y',
    '@modelcontextprotocol/server-git',
    repoPath,
  ]);

  try {
    const result = await callMCPTool(mcpClient.client, 'git_diff_unstaged', {
      repo_path: repoPath,
    });

    if (staged) {
      // For staged changes, we need to use git_diff_staged if available
      // or parse the status differently
      const stagedResult = await callMCPTool(mcpClient.client, 'git_status', {
        repo_path: repoPath,
      });
      return stagedResult[0]?.text || '';
    }

    return result[0]?.text || '';
  } finally {
    await closeMCPClient(mcpClient);
  }
}

export async function gitCommit(repoPath: string, message: string): Promise<string> {
  const mcpClient = await createMCPClient('npx', [
    '-y',
    '@modelcontextprotocol/server-git',
    repoPath,
  ]);

  try {
    const result = await callMCPTool(mcpClient.client, 'git_commit', {
      repo_path: repoPath,
      message: message,
    });

    return result[0]?.text || 'Commit successful';
  } finally {
    await closeMCPClient(mcpClient);
  }
}

export async function getChangedFiles(repoPath: string): Promise<string> {
  const mcpClient = await createMCPClient('npx', [
    '-y',
    '@modelcontextprotocol/server-git',
    repoPath,
  ]);

  try {
    const result = await callMCPTool(mcpClient.client, 'git_status', {
      repo_path: repoPath,
    });

    return result[0]?.text || '';
  } finally {
    await closeMCPClient(mcpClient);
  }
}
