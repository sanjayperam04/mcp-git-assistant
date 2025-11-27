import { NextRequest, NextResponse } from 'next/server';
import { getGitDiff, getChangedFiles } from '@/lib/git-mcp';
import { generateCommitMessage } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const { repoPath = '.' } = await request.json();

    // Get git diff for staged changes using MCP
    const diffOutput = await getGitDiff(repoPath, true);

    if (!diffOutput.trim()) {
      return NextResponse.json(
        { error: 'No staged changes found. Please stage your changes first.' },
        { status: 400 }
      );
    }

    // Get list of changed files using MCP
    const filesOutput = await getChangedFiles(repoPath);

    // Generate commit message using LLM
    const commitMessage = await generateCommitMessage(diffOutput, filesOutput);

    return NextResponse.json({ message: commitMessage });
  } catch (error) {
    console.error('Generate commit error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate commit message' },
      { status: 500 }
    );
  }
}
