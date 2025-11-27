import { NextRequest, NextResponse } from 'next/server';
import { getGitStatus } from '@/lib/git-mcp';

export async function POST(request: NextRequest) {
  try {
    const { repoPath = '.' } = await request.json();

    // Get git status using MCP
    const status = await getGitStatus(repoPath);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Git status error:', error);
    return NextResponse.json(
      { error: 'Failed to get git status. Make sure you are in a git repository.' },
      { status: 500 }
    );
  }
}
