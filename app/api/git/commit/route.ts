import { NextRequest, NextResponse } from 'next/server';
import { gitCommit } from '@/lib/git-mcp';

export async function POST(request: NextRequest) {
  try {
    const { repoPath = '.', message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Commit message is required' },
        { status: 400 }
      );
    }

    // Execute git commit using MCP
    const output = await gitCommit(repoPath, message);

    return NextResponse.json({ 
      success: true,
      output 
    });
  } catch (error) {
    console.error('Git commit error:', error);
    return NextResponse.json(
      { error: 'Failed to commit changes. Make sure you have staged changes.' },
      { status: 500 }
    );
  }
}
