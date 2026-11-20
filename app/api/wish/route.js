import Anthropic from '@anthropic-ai/sdk';
import { findPerson } from '@/lib/names';
import { getProfile, buildPrompt } from '@/lib/profiles';

export const maxDuration = 30;

const MODEL = process.env.WISH_MODEL || 'claude-opus-5-5';
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map();

// Best-effort limiter: serverless instances don't share memory, so this only slows down a single warm instance.
function limited(ip) {
  const now = Date.now();
  if (hits.size > 1000) {
    for (const [key, list] of hits) {
      if (!list.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function reply(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) return reply({ error: 'rate_limited' }, 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad_request' }, 400);
  }

  const person = typeof body?.name === 'string' && body.name.length <= 60 ? findPerson(body.name) : null;
  const profile = person ? getProfile(person.full) : null;
  if (!person || !profile) return reply({ error: 'invalid_name' }, 400);

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return reply({ text: profile.fallback, source: 'fallback' });
  }

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: buildPrompt(person, profile) }],
    });

    if (response.stop_reason === 'refusal') throw new Error('refusal');

    const text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim()
      .replace(/^["“”]+|["“”]+$/g, '')
      .trim();
    if (!text) throw new Error('empty');

    return reply({ text, source: 'ai' });
  } catch (error) {
    console.error('wish generation failed:', error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
    return reply({ text: profile.fallback, source: 'fallback' });
  }
}
