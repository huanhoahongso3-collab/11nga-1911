import { createHmac, timingSafeEqual } from 'node:crypto';
import { deflateRawSync, inflateRawSync } from 'node:zlib';
import { NAMES } from './names';
import { getProfile } from './profiles';

// Chỉ dùng phía server. ID chia sẻ chứa luôn lời chúc (nén) kèm chữ ký, nên không cần database
// và lời chúc luôn giữ nguyên như lúc được tạo. Đổi khóa ký sẽ làm các mã QR cũ không mở được nữa.
const MAX_TEXT = 1200;

function secret() {
  return (
    process.env.SHARE_SECRET ||
    process.env.CYO_AI_API ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.ANTHROPIC_AUTH_TOKEN ||
    ''
  );
}

function sign(body) {
  return createHmac('sha256', secret()).update(body).digest().subarray(0, 16).toString('base64url');
}

// prewritten = true khi `text` đúng là lời chúc viết sẵn của bạn đó (an toàn để dùng ID không ký khi chưa có khóa).
export function createShareId(person, text, prewritten = false) {
  const index = NAMES.findIndex((n) => n.full === person.full);
  if (index < 0 || !text || text.length > MAX_TEXT) return null;

  if (!secret()) return prewritten ? `p-${index}` : null;

  const body = deflateRawSync(Buffer.concat([Buffer.from([index]), Buffer.from(text, 'utf8')])).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function readShareId(id) {
  const value = String(id || '');
  if (value.length > 4000) return null;

  const plain = value.match(/^p-(\d{1,2})$/);
  if (plain) {
    const person = NAMES[Number(plain[1])];
    const profile = person && getProfile(person.full);
    return profile ? { person, text: profile.fallback } : null;
  }

  const [body, signature, ...extra] = value.split('.');
  if (!body || !signature || extra.length || !secret()) return null;

  const expected = sign(body);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const raw = inflateRawSync(Buffer.from(body, 'base64url'), { maxOutputLength: 8192 });
    const person = NAMES[raw[0]];
    const text = raw.subarray(1).toString('utf8');
    if (!person || !text || text.length > MAX_TEXT) return null;
    return { person, text };
  } catch {
    return null;
  }
}
