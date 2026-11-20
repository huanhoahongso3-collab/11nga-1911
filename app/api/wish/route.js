import { findPerson } from '@/lib/names';
import { getProfile, buildPrompt } from '@/lib/profiles';
import { aiConfigured, generateText } from '@/lib/ai';
import { createShareId } from '@/lib/share';

export const maxDuration = 30;

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

  const fallback = (reason) => reply({
    text: profile.fallback,
    source: 'fallback',
    reason,
    shareId: createShareId(person, profile.fallback, true),
  });

  if (!aiConfigured()) return fallback('no_key');

  try {
    const text = await generateText(buildPrompt(person, profile));
    return reply({ text, source: 'ai', shareId: createShareId(person, text) });
  } catch {
    return fallback('ai_error');
  }
}
