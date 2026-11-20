import { findPerson } from '@/lib/names';
import { getProfile, buildPrompt, TONE_PROMPTS } from '@/lib/profiles';
import { aiConfigured, generateText } from '@/lib/ai';
import { createShareId } from '@/lib/share';
import { createLimiter } from '@/lib/rateLimit';

export const maxDuration = 30;

const limited = createLimiter(10, 60_000);

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

  const tone = typeof body?.tone === 'string' && Object.hasOwn(TONE_PROMPTS, body.tone) ? body.tone : '';

  const fallback = (reason) => reply({
    text: profile.fallback,
    source: 'fallback',
    reason,
    shareId: createShareId(person, profile.fallback, true),
  });

  if (!aiConfigured()) return fallback('no_key');

  try {
    const text = await generateText(buildPrompt(person, profile, tone));
    return reply({ text, source: 'ai', shareId: createShareId(person, text) });
  } catch {
    return fallback('ai_error');
  }
}
