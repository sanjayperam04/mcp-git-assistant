# MCP Git Assistant

A production-ready web application that leverages the Model Context Protocol (MCP) and Large Language Models to generate intelligent, conventional commit messages from git changes. Built with Next.js 14, TypeScript, and modern AI infrastructure.

## Overview

MCP Git Assistant demonstrates enterprise-grade integration of the Model Context Protocol for git operations. Rather than executing shell commands directly, the application communicates with the official `@modelcontextprotocol/server-git` MCP server, providing a standardized, secure, and maintainable approach to git automation.

This architecture showcases how MCP can bridge AI applications with external tools while maintaining separation of concerns and enabling seamless extensibility.

## Key Features

- **MCP Protocol Integration**: Implements Model Context Protocol for standardized git operations
- **Multi-Provider LLM Support**: Compatible with Groq (Llama 3.3 70B), OpenAI (GPT-4), and Anthropic (Claude 3.5)
- **Real-Time Repository Analysis**: Live git status monitoring through MCP tools
- **Conventional Commits**: Generates commit messages following industry best practices
- **Type-Safe Architecture**: Full TypeScript implementation with strict type checking
- **Production-Ready**: Optimized for deployment on Vercel with edge runtime support

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.x |
| **Protocol** | Model Context Protocol (MCP) SDK |
| **MCP Server** | `@modelcontextprotocol/server-git` |
| **LLM Providers** | Groq, OpenAI, Anthropic |
| **Runtime** | Node.js 18+ |
| **Deployment** | Vercel (Edge-optimized) |

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git 2.x or higher
- API key from one of the supported LLM providers

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanjayperam04/mcp-git-assistant.git
cd mcp-git-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Add your LLM provider API key to `.env`:
```env
# Recommended: Groq (fastest, free tier available)
GROQ_API_KEY=gsk_...

# Alternative providers:
# OPENAI_API_KEY=sk-proj-...
# ANTHROPIC_API_KEY=sk-ant-...
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Configure environment variables:
   - `GROQ_API_KEY` or `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
4. Deploy

### Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Other Platforms

The application is compatible with any Node.js hosting platform that supports Next.js 14.

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

## Architecture

### MCP Integration Flow

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────────┐
│   Browser   │─────▶│  Next.js API │─────▶│ MCP Client  │─────▶│  Git MCP     │
│     UI      │      │    Routes    │      │             │      │   Server     │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────────┘
                              │                                          │
                              │                                          ▼
                              │                                   ┌──────────────┐
                              │                                   │     Git      │
                              ▼                                   │  Repository  │
                       ┌──────────────┐                          └──────────────┘
                       │  LLM Provider│
                       │ (Groq/OpenAI)│
                       └──────────────┘
```

### Request Lifecycle

1. **Client Request**: User initiates action through web interface
2. **API Route**: Next.js API route receives request
3. **MCP Connection**: Establishes stdio transport to Git MCP server
4. **Tool Invocation**: Calls MCP tools (`git_status`, `git_diff_unstaged`, `git_commit`)
5. **LLM Processing**: Sends git diff to LLM for commit message generation
6. **Response**: Returns structured data to client
7. **Cleanup**: Closes MCP connection

For detailed architecture documentation, see [MCP_ARCHITECTURE.md](./MCP_ARCHITECTURE.md)

## Commit Message Standards

Generated commit messages adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Supported Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or modifications
- `chore`: Build process or auxiliary tool changes

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

## Roadmap

- [ ] Pull request description generation
- [ ] Automated changelog generation
- [ ] Commit quality metrics and scoring
- [ ] Team analytics dashboard
- [ ] VS Code extension
- [ ] CLI tool for terminal usage
- [ ] Multi-language commit message support
- [ ] Integration with additional MCP servers (filesystem, database)

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes following conventional commits
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the standardized AI-tool integration framework
- [Anthropic](https://www.anthropic.com/) for MCP specification and reference implementations
- [Vercel](https://vercel.com/) for Next.js framework and hosting platform

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with Model Context Protocol** | [Documentation](./MCP_ARCHITECTURE.md) | [Setup Guide](./SETUP.md)
