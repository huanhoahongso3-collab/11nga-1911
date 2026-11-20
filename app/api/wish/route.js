import { findPerson } from '@/lib/names';
import { getProfile, buildPrompt, TONE_PROMPTS } from '@/lib/profiles';
import { aiConfigured, generateText } from '@/lib/ai';
import { createShareId } from '@/lib/share';
import { createLimiter } from '@/lib/rateLimit';
import { clientIp, isSameOrigin, readJsonBody } from '@/lib/guard';

export const maxDuration = 30;

const limited = createLimiter(10, 60_000);

function reply(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  if (!isSameOrigin(request)) return reply({ error: 'forbidden' }, 403);
  if (limited(clientIp(request))) return reply({ error: 'rate_limited' }, 429);

  const parsed = await readJsonBody(request);
  if (parsed.error) return reply({ error: parsed.error === 'too_large' ? 'too_large' : 'bad_request' }, parsed.error === 'too_large' ? 413 : 400);
  const body = parsed.value;

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
