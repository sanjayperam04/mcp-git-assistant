# Smart Git Commit Assistant

An AI-powered tool that generates intelligent commit messages by analyzing your git changes using **Model Context Protocol (MCP)** and LLMs. Built with Next.js, TypeScript, and Tailwind CSS.

## What is MCP?

This project uses the **Model Context Protocol (MCP)** - an open standard for connecting AI applications to external data sources and tools. Instead of directly executing git commands, we use the official `@modelcontextprotocol/server-git` MCP server to interact with git repositories in a standardized way.

## Features

- 🔌 **MCP Integration**: Uses official MCP Git server for all git operations
- 🤖 AI-generated commit messages using OpenAI or Anthropic
- 📊 Real-time git status visualization via MCP
- ✅ Staged, unstaged, and untracked file tracking
- ✏️ Edit generated messages before committing
- 🎨 Clean, modern UI with Tailwind CSS
- 🚀 Deploy to Vercel in minutes

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4 or Anthropic Claude
- **MCP**: Model Context Protocol SDK + Git MCP Server
- **Git Integration**: `@modelcontextprotocol/server-git` (official MCP server)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Git repository
- `npx` available (comes with Node.js)
- OpenAI API key OR Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd smart-git-commit-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your API key to `.env`:
```env
# Use one of these:
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. **Stage your changes**: Use `git add` to stage files you want to commit
2. **Open the app**: Navigate to the web interface
3. **Generate message**: Click "Generate Commit Message" to create an AI-powered commit message
4. **Review & edit**: Review the generated message and edit if needed
5. **Commit**: Click "Commit Changes" to commit with the message

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (OPENAI_API_KEY or ANTHROPIC_API_KEY)
5. Deploy!

Alternatively, use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── git/
│   │       ├── status/route.ts       # Git status endpoint
│   │       ├── commit/route.ts       # Commit endpoint
│   │       └── generate-commit/route.ts  # AI generation endpoint
│   ├── layout.tsx
│   ├── page.tsx                      # Main page
│   └── globals.css
├── components/
│   ├── CommitGenerator.tsx           # Commit message UI
│   └── GitStatus.tsx                 # Git status display
├── lib/
│   ├── mcp-client.ts                 # MCP client utilities
│   ├── git-mcp.ts                    # Git operations via MCP
│   └── llm.ts                        # LLM integration
└── package.json
```

## How It Works (MCP Architecture)

1. **MCP Client**: Next.js API routes create MCP client connections
2. **Git MCP Server**: Spawns `@modelcontextprotocol/server-git` via `npx`
3. **MCP Tools**: Calls MCP tools like `git_status`, `git_diff_unstaged`, `git_commit`
4. **AI Generation**: Sends diff to OpenAI/Anthropic with specialized prompt
5. **MCP Commit**: Executes commit through MCP server

### MCP Flow Diagram
```
User → Next.js API → MCP Client → Git MCP Server → Git Repository
                         ↓
                    OpenAI/Claude
                         ↓
                  Commit Message
```

## Commit Message Format

The AI follows conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Troubleshooting

**"No staged changes found"**
- Run `git add <files>` to stage your changes first

**"Failed to get git status"**
- Make sure you're in a git repository
- Check that git is installed: `git --version`

**"No LLM API key configured"**
- Add OPENAI_API_KEY or ANTHROPIC_API_KEY to your .env file

**"MCP tool error"**
- Make sure `npx` is available: `npx --version`
- The Git MCP server is downloaded automatically on first use

## Future Enhancements

- [ ] PR description generation
- [ ] Changelog automation
- [ ] Commit quality scoring
- [ ] Team analytics dashboard
- [ ] VS Code extension
- [ ] CLI tool
- [ ] Multi-language support

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

## Author

Built with ❤️ for developers who want better commit messages
