# Setup Guide

## What You're Building

A git commit assistant that uses **Model Context Protocol (MCP)** to interact with git repositories. This demonstrates how to build AI applications using open standards instead of direct shell commands.

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

This installs:
- Next.js framework
- MCP SDK (`@modelcontextprotocol/sdk`)
- OpenAI/Anthropic SDKs
- The Git MCP server will be auto-downloaded via `npx` on first use

### 2. Configure API Key

Create a `.env` file:
```bash
cp .env.example .env
```

Get an API key from one of these providers:

**Option A: OpenAI (Recommended)**
- Go to https://platform.openai.com/api-keys
- Create new API key
- Add to `.env`: `OPENAI_API_KEY=sk-...`
- Cost: ~$0.01 per 100 commits

**Option B: Anthropic Claude**
- Go to https://console.anthropic.com/
- Create API key
- Add to `.env`: `ANTHROPIC_API_KEY=sk-ant-...`
- Cost: ~$0.02 per 100 commits

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000

### 4. Test It Out

In your terminal (in any git repo):
```bash
# Make some changes
echo "test" > test.txt

# Stage them
git add test.txt

# Go to http://localhost:3000 and generate a commit message!
```

**What happens behind the scenes:**
1. Your Next.js app spawns the Git MCP server via `npx`
2. MCP server connects to your git repository
3. App calls MCP tools like `git_status` and `git_diff_unstaged`
4. LLM analyzes the changes
5. App commits via MCP `git_commit` tool

See `MCP_ARCHITECTURE.md` for detailed flow.

## Deploy to Vercel

### Method 1: Vercel Dashboard (Easiest)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variable:
   - Key: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
   - Value: Your API key
5. Click Deploy
6. Done! Your app is live

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Git not found
```bash
# Install git
# macOS: brew install git
# Ubuntu: sudo apt-get install git
# Windows: https://git-scm.com/download/win
```

### API key not working
- Make sure there are no spaces in your .env file
- Restart the dev server after adding the key
- Check your API key is valid and has credits

## Next Steps

1. **Customize the prompt**: Edit `lib/llm.ts` to change commit message style
2. **Add features**: Check README.md for enhancement ideas
3. **Share it**: Deploy and share with your team!

## Cost Estimates

Using GPT-4o-mini (recommended):
- ~$0.0001 per commit message
- 10,000 commits = ~$1

Using Claude 3.5 Sonnet:
- ~$0.0002 per commit message
- 5,000 commits = ~$1

Both are extremely affordable for personal/team use.
