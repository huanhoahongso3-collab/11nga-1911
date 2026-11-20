import { aiConfigured, generateText } from '@/lib/ai';
import { buildGeneralPrompt, parseGeneralWish } from '@/lib/generalWish';
import { createLimiter } from '@/lib/rateLimit';
import { clientIp, isSameOrigin } from '@/lib/guard';

export const maxDuration = 30;

const limited = createLimiter(6, 60_000);

function reply(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

// Chỉ chạy khi người xem bấm "Viết lại lời chúc chung"; không có lời chúc viết sẵn để thay thế nên báo lỗi nếu AI không sẵn sàng.
export async function POST(request) {
  if (!isSameOrigin(request)) return reply({ error: 'forbidden' }, 403);
  if (limited(clientIp(request))) return reply({ error: 'rate_limited' }, 429);
  if (!aiConfigured()) return reply({ error: 'no_key' }, 503);

  try {
    const paragraphs = parseGeneralWish(await generateText(buildGeneralPrompt()));
    if (paragraphs.length === 0) throw new Error('empty');
    return reply({ paragraphs });
  } catch {
    return reply({ error: 'ai_error' }, 502);
  }
}
