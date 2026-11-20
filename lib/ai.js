import Anthropic from '@anthropic-ai/sdk';

// Proxy tương thích OpenAI dùng trong cbh-youth-online-api (config/services.php -> chat_api).
const CYO_URL = process.env.CYO_AI_URL || 'https://chat-api.chuyenbienhoa.com/v1/chat/completions';
const CYO_MODEL = process.env.CYO_AI_MODEL || 'gemini-auto';
const CLAUDE_MODEL = process.env.WISH_MODEL || 'claude-opus-5-5';

const hasCyo = () => Boolean(process.env.CYO_AI_API);
const hasClaude = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

export function aiConfigured() {
  return hasCyo() || hasClaude();
}

async function viaCyo(prompt) {
  const response = await fetch(CYO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CYO_AI_API}`,
    },
    body: JSON.stringify({
      model: CYO_MODEL,
      temperature: 0.8,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`CYO AI returned HTTP ${response.status}`);

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string') throw new Error('CYO AI response had no message content');
  return text;
}

async function viaClaude(prompt) {
  const client = new Anthropic();
  const response = await client.beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'low' },
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal') throw new Error('Claude refused the request');

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');
}

function describe(error) {
  return error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error?.message || String(error);
}

// Thử proxy CYO trước, rồi tới Claude nếu có key. Ném lỗi khi không nhà cung cấp nào trả về nội dung.
export async function generateText(prompt) {
  const attempts = [];
  if (hasCyo()) attempts.push(['cyo', viaCyo]);
  if (hasClaude()) attempts.push(['claude', viaClaude]);
  if (attempts.length === 0) throw new Error('no AI provider configured');

  let lastError;
  for (const [name, run] of attempts) {
    try {
      const text = (await run(prompt)).trim().replace(/^["“”]+|["“”]+$/g, '').trim();
      if (text) return text;
      lastError = new Error(`${name} returned empty text`);
    } catch (error) {
      lastError = error;
    }
    console.error(`wish generation via ${name} failed:`, describe(lastError));
  }
  throw lastError;
}
