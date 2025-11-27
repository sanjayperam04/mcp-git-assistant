import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are an expert at writing clear, concise git commit messages following best practices.

Guidelines:
- Use conventional commits format: type(scope): description
- Types: feat, fix, docs, style, refactor, test, chore
- Keep the first line under 72 characters
- Use imperative mood ("add" not "added")
- Be specific about what changed and why
- If there are breaking changes, mention them

Analyze the git diff and file changes to generate a meaningful commit message.`;

export async function generateCommitMessage(
  diff: string,
  files: string
): Promise<string> {
  const prompt = `Generate a commit message for these changes:

Files changed:
${files}

Diff:
${diff.substring(0, 3000)}${diff.length > 3000 ? '\n... (truncated)' : ''}

Provide only the commit message, no explanations.`;

  // Try Groq first (fastest and cheapest)
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile', // or 'mixtral-8x7b-32768'
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      return response.choices[0]?.message?.content?.trim() || 'Update files';
    } catch (error) {
      console.error('Groq error:', error);
    }
  }

  // Try OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      });

      return response.choices[0]?.message?.content?.trim() || 'Update files';
    } catch (error) {
      console.error('OpenAI error:', error);
    }
  }

  // Try Anthropic as fallback
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `${SYSTEM_PROMPT}\n\n${prompt}`,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text.trim();
      }
    } catch (error) {
      console.error('Anthropic error:', error);
    }
  }

  throw new Error('No LLM API key configured. Please set GROQ_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY in .env');
}
