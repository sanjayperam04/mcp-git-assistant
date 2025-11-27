# MCP Architecture Documentation

## Overview

This project demonstrates a real-world implementation of the **Model Context Protocol (MCP)** for git operations. Instead of directly executing shell commands, all git interactions go through the official MCP Git server.

## What is MCP?

Model Context Protocol is an open standard that enables AI applications to securely connect to external data sources and tools through a standardized interface. Think of it as a universal adapter between your AI application and various services.

## Why Use MCP?

**Traditional Approach (Without MCP):**
```typescript
// Direct shell execution - tightly coupled
exec('git status --porcelain', (error, stdout) => {
  // Parse output manually
});
```

**MCP Approach:**
```typescript
// Standardized protocol - loosely coupled
const result = await callMCPTool(client, 'git_status', {
  repo_path: repoPath
});
```

**Benefits:**
- ✅ Standardized interface across different tools
- ✅ Better error handling and type safety
- ✅ Security through controlled access
- ✅ Easy to swap implementations
- ✅ Built-in capability negotiation

## Architecture Components

### 1. MCP Client (`lib/mcp-client.ts`)

The client manages connections to MCP servers:

```typescript
export async function createMCPClient(
  command: string,
  args: string[],
  env?: Record<string, string>
): Promise<MCPClient>
```

**Responsibilities:**
- Spawn MCP server process via stdio transport
- Establish connection with capability negotiation
- Provide interface for tool calls
- Handle cleanup and disconnection

### 2. Git MCP Wrapper (`lib/git-mcp.ts`)

High-level functions that wrap MCP tool calls:

```typescript
export async function getGitStatus(repoPath: string): Promise<GitStatus>
export async function getGitDiff(repoPath: string, staged: boolean): Promise<string>
export async function gitCommit(repoPath: string, message: string): Promise<string>
```

**Responsibilities:**
- Create MCP client for each operation
- Call appropriate MCP tools
- Parse and format responses
- Ensure proper cleanup

### 3. API Routes

Next.js API routes that expose MCP functionality:

- `/api/git/status` - Get repository status via MCP
- `/api/git/generate-commit` - Generate commit message using MCP + LLM
- `/api/git/commit` - Commit changes via MCP

## MCP Server Used

**Package**: `@modelcontextprotocol/server-git`

**Installation**: Automatic via `npx -y @modelcontextprotocol/server-git`

**Available Tools:**
- `git_status` - Get repository status
- `git_diff_unstaged` - Get unstaged changes
- `git_diff_staged` - Get staged changes (if available)
- `git_commit` - Create a commit
- `git_log` - View commit history

## Request Flow

### Example: Getting Git Status

```
1. User clicks "Refresh" in UI
   ↓
2. Frontend calls /api/git/status
   ↓
3. API route calls getGitStatus(repoPath)
   ↓
4. getGitStatus creates MCP client:
   - Spawns: npx -y @modelcontextprotocol/server-git <repoPath>
   - Connects via stdio transport
   ↓
5. Calls MCP tool: git_status
   ↓
6. Git MCP server executes git commands
   ↓
7. Returns structured response
   ↓
8. Parse and format response
   ↓
9. Close MCP client
   ↓
10. Return to frontend
```

## Code Example: MCP Tool Call

```typescript
// Create client
const mcpClient = await createMCPClient('npx', [
  '-y',
  '@modelcontextprotocol/server-git',
  repoPath,
]);

try {
  // Call tool
  const result = await callMCPTool(mcpClient.client, 'git_status', {
    repo_path: repoPath,
  });

  // Process result
  const statusText = result[0]?.text || '';
  
  // Parse and return
  return parseStatus(statusText);
} finally {
  // Always cleanup
  await closeMCPClient(mcpClient);
}
```

## MCP vs Direct Execution

| Aspect | Direct Execution | MCP |
|--------|-----------------|-----|
| Coupling | Tight | Loose |
| Error Handling | Manual parsing | Structured |
| Security | Full shell access | Controlled tools |
| Portability | OS-dependent | Standardized |
| Testing | Mock shell commands | Mock MCP server |
| Extensibility | Hard to extend | Easy to add tools |

## Benefits for This Project

1. **Educational**: Demonstrates real MCP usage
2. **Scalable**: Easy to add more MCP servers (filesystem, database, etc.)
3. **Maintainable**: Clear separation of concerns
4. **Professional**: Uses industry-standard protocol
5. **Resume-worthy**: Shows understanding of modern AI architecture

## Future MCP Enhancements

Potential additions using other MCP servers:

- **Filesystem MCP**: Read code files for better context
- **GitHub MCP**: Create PRs automatically
- **Slack MCP**: Notify team of commits
- **Database MCP**: Log commit analytics
- **Sequential Thinking MCP**: Complex commit analysis

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Git MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/git)

## Debugging MCP

Enable debug logging:
```typescript
const transport = new StdioClientTransport({
  command,
  args,
  env: { 
    ...process.env, 
    DEBUG: 'mcp:*'  // Enable debug logs
  },
});
```

Check MCP server is working:
```bash
npx -y @modelcontextprotocol/server-git . --help
```
