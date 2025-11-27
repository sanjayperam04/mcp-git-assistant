import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface MCPClient {
  client: Client;
  transport: StdioClientTransport;
}

export async function createMCPClient(
  command: string,
  args: string[],
  env?: Record<string, string>
): Promise<MCPClient> {
  const transport = new StdioClientTransport({
    command,
    args,
    env: { ...process.env, ...env },
  });

  const client = new Client(
    {
      name: 'smart-git-commit-assistant',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);
  return { client, transport };
}

export async function closeMCPClient(mcpClient: MCPClient): Promise<void> {
  await mcpClient.client.close();
}

export async function callMCPTool(
  client: Client,
  toolName: string,
  args: Record<string, unknown>
): Promise<any> {
  const result = await client.callTool({
    name: toolName,
    arguments: args,
  });

  if (result.isError) {
    throw new Error(`MCP tool error: ${JSON.stringify(result.content)}`);
  }

  return result.content;
}
