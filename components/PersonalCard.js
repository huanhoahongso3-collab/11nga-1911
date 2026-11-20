'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NAMES, normName } from '@/lib/names';
import { exportNodeToPng, renderPng, shareBlob } from '@/lib/exportImage';
import { useTypewriter } from '@/lib/useTypewriter';
import Stickers from './Stickers';
import WishExport from './WishExport';

const EMOJIS = ['🌟', '🍀', '🎈', '☀️', '📚', '✨', '💫'];

// '' = giữ nguyên giọng như mặc định.
const TONES = [
  { id: '', label: 'Giữ nguyên' },
  { id: 'funny', label: '😂 Hài hước' },
  { id: 'touching', label: '🥹 Cảm động' },
  { id: 'short', label: '⚡ Ngắn gọn' },
];

const FALLBACK_NOTES = {
  no_key: (call) => `Máy chủ chưa có khóa AI nên đây là lời chúc viết sẵn dành riêng cho ${call}.`,
  ai_error: (call) => `AI đang bận hoặc bị lỗi nên đây là lời chúc viết sẵn dành riêng cho ${call}.`,
};

export default function PersonalCard({ person, showToast, onCelebrate }) {
  const [wish, setWish] = useState({ status: 'loading', text: '', source: '', reason: '', shareId: '', tone: '' });
  const [tone, setTone] = useState('');
  const [qr, setQr] = useState('');
  const [saving, setSaving] = useState(false);
  const [shareImage, setShareImage] = useState(null);
  const controller = useRef(null);
  const exportRef = useRef(null);
  // The chosen tone is only read when a wish is requested, so picking a chip never triggers a request by itself.
  const toneRef = useRef('');
  const emoji = EMOJIS[NAMES.findIndex((n) => n.full === person.full) % EMOJIS.length];
  const slug = normName(person.full).replace(/\s+/g, '-');

  function chooseTone(id) {
    toneRef.current = id;
    setTone(id);
  }

  const loadWish = useCallback(async () => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    const applied = toneRef.current;
    setWish({ status: 'loading', text: '', source: '', reason: '', shareId: '', tone: applied });

    try {
      const response = await fetch('/api/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: person.full, tone: applied }),
        signal: current.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.text) throw new Error(data?.error || 'request_failed');
      setWish({
        status: 'ready',
        text: data.text,
        source: data.source,
        reason: data.reason || '',
        shareId: data.shareId || '',
        tone: applied,
      });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setWish({ status: 'error', text: '', source: '', reason: '', shareId: '', tone: applied });
    }
  }, [person.full]);

  useEffect(() => {
    loadWish();
    return () => controller.current?.abort();
  }, [loadWish]);

  const ready = wish.status === 'ready';
  const typed = useTypewriter(wish.text, ready);
  const typing = ready && typed < wish.text.length;
  const shareUrl = () => (wish.shareId ? `${window.location.origin}/w/${wish.shareId}` : window.location.origin);

  // The QR points to a read-only page that shows exactly this wish.
  useEffect(() => {
    if (!ready || !wish.shareId) {
      setQr('');
      return;
    }
    let cancelled = false;
    import('qrcode')
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(`${window.location.origin}/w/${wish.shareId}`, {
          errorCorrectionLevel: 'L',
          margin: 1,
          width: 600,
          color: { dark: '#4A4238', light: '#FFFFFF' },
        }),
      )
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch(() => {
        if (!cancelled) setQr('');
      });
    return () => {
      cancelled = true;
    };
  }, [ready, wish.shareId]);

  // Pre-render the image so "Chia sẻ" can open the share sheet immediately (browsers need it right after the tap).
  useEffect(() => {
    setShareImage(null);
    if (!ready || (wish.shareId && !qr)) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const blob = await renderPng(exportRef.current, 2);
        if (!cancelled) setShareImage(blob);
      } catch {
        /* sharing just stays unavailable; saving still works */
      }
    }, 900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [ready, wish.text, wish.shareId, qr]);

  async function saveCard() {
    if (!ready) {
      showToast('Đợi lời chúc viết xong đã nhé!', '⏳');
      return;
    }
    if (saving) return;
    if (wish.shareId && !qr) {
      showToast('Đang tạo mã QR, chờ chút nhé!', '⏳');
      return;
    }

    setSaving(true);
    try {
      const result = await exportNodeToPng(exportRef.current, `Thiep-19-11-11Nga-${slug}.png`);
      if (result === 'downloaded') showToast('Đã lưu ảnh thiệp của cậu về máy!', '📸');
      else if (result === 'shared') showToast('Chọn "Lưu ảnh" để giữ thiệp nhé!', '📸');
    } catch {
      showToast('Chưa tạo được ảnh, cậu thử lại nhé!', '⚠️');
    } finally {
      setSaving(false);
    }
  }

  async function shareCard() {
    if (!ready) {
      showToast('Đợi lời chúc viết xong đã nhé!', '⏳');
      return;
    }
    if (!shareImage) {
      showToast('Đang chuẩn bị ảnh, cậu bấm lại sau vài giây nhé!', '⏳');
      return;
    }
    const result = await shareBlob(shareImage, `Thiep-19-11-11Nga-${slug}.png`, {
      title: `Lời chúc 19/11 cho ${person.call}`,
      text: `Lời chúc 19/11 dành cho ${person.full} ✨`,
      url: shareUrl(),
    });
    if (result === 'copied') showToast('Đã chép link, cậu dán vào Zalo hoặc Messenger nhé!', '🔗');
    else if (result === 'unsupported') showToast('Máy này chưa hỗ trợ chia sẻ, cậu hãy lưu ảnh nhé!', '⚠️');
  }

  const loading = wish.status === 'loading';
  const note = wish.source === 'fallback' ? (FALLBACK_NOTES[wish.reason] || FALLBACK_NOTES.ai_error)(person.call) : '';
  const toneChanged = !loading && tone !== wish.tone;

  return (
    <div className="relative pt-[68px] pb-16 sm:pt-[88px] sm:pb-[88px]">
      <Stickers person={person} />
      <article className="paper-card-mint rounded-3xl p-6 sm:p-8 relative">
        <div className="washi-tape washi-tape-mint" />

        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 pt-1 border-b border-dashed border-mintBorder">
          <div className="flex items-center gap-3">
            <span className="hover-spin w-10 h-10 rounded-2xl bg-white border border-mintBorder flex items-center justify-center text-xl shrink-0">
              <span className="animate-bob">{emoji}</span>
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-inkLight block">Lời nhắn riêng dành cho</span>
              <h2 className="hover-word font-hand text-2xl sm:text-3xl text-ink leading-tight">{person.full}</h2>
            </div>
          </div>

          <span className="hover-pop cursor-default px-3 py-1 rounded-full bg-pinkSoft text-ink text-xs font-bold border border-pinkBorder">
            11 Nga ♥ 19/11
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-mintBorder/80 shadow-xs mb-5">
          {loading && (
            <div aria-live="polite">
              <p className="text-sm sm:text-base text-inkLight font-semibold mb-3">
                Đang viết lời chúc riêng cho {person.call}
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </p>
              <div className="space-y-2.5">
                <div className="shimmer w-full" />
                <div className="shimmer w-11/12" />
                <div className="shimmer w-2/3" />
              </div>
            </div>
          )}

          {ready && (
            <p className="text-sm sm:text-base text-ink leading-relaxed font-medium" aria-label={wish.text}>
              <span aria-hidden="true" className={typing ? 'caret' : ''}>
                &quot;{wish.text.slice(0, typed)}{!typing && '"'}
              </span>
              <span aria-hidden="true" className="opacity-0">
                {wish.text.slice(typed)}{typing && '"'}
              </span>
            </p>
          )}

          {wish.status === 'error' && (
            <p className="text-sm sm:text-base text-ink leading-relaxed font-medium">
              Chưa tạo được lời chúc lúc này. Cậu bấm &quot;Viết lại lời chúc&quot; để thử lại nhé!
            </p>
          )}

          <p className="mt-4 text-right font-hand text-lg text-inkLight">— Tập thể nữ 11 Nga —</p>
          {note && <p className="mt-2 text-xs text-inkLight font-semibold">{note}</p>}
        </div>

        <div className="mb-5" role="group" aria-label="Giọng điệu lời chúc">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-inkLight mr-1">Giọng điệu</span>
            {TONES.map((option) => (
              <button
                key={option.id || 'default'}
                type="button"
                aria-pressed={tone === option.id}
                onClick={() => chooseTone(option.id)}
                className={`hover-pop px-3 py-1 rounded-full text-xs font-bold text-ink border-2 ${
                  tone === option.id
                    ? 'bg-butter border-butterBorder shadow-[0_2px_0_rgb(var(--c-butterBorder))]'
                    : 'bg-white border-mintBorder/70'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {toneChanged && (
            <p className="mt-2 text-xs font-semibold text-inkLight">Cậu bấm &quot;Viết lại lời chúc&quot; để áp dụng giọng này nhé.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCelebrate}
            className="btn-sticker px-4 py-2.5 rounded-2xl bg-pinkSoft hover:bg-pinkBorder/60 text-ink font-bold text-xs sm:text-sm border-2 border-pinkBorder shadow-[0_4px_0_rgb(var(--c-pinkBorder))] flex items-center gap-1.5"
          >
            <span>🎉</span>
            <span>Bắn pháo chúc mừng</span>
          </button>

          <button
            type="button"
            onClick={loadWish}
            disabled={loading}
            className="btn-sticker px-4 py-2.5 rounded-2xl bg-mintSoft hover:bg-mintBorder/70 text-ink font-bold text-xs sm:text-sm border-2 border-mintBorder shadow-[0_4px_0_rgb(var(--c-mintBorder))] flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
          >
            <span>🔄</span>
            <span>Viết lại lời chúc</span>
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={shareCard}
              disabled={!ready}
              className="btn-sticker px-4 py-2.5 rounded-2xl bg-white hover:bg-cream text-ink font-bold text-xs sm:text-sm border-2 border-mintBorder shadow-[0_4px_0_rgb(var(--c-mintBorder))] flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>📤</span>
              <span>Chia sẻ</span>
            </button>

            <button
              type="button"
              onClick={saveCard}
              disabled={saving}
              className="btn-sticker px-5 py-2.5 rounded-2xl bg-butter hover:bg-butterBorder/70 text-ink font-bold text-xs sm:text-sm border-2 border-butterBorder shadow-[0_4px_0_rgb(var(--c-butterBorder))] flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
            >
              <span>📸</span>
              <span>{saving ? 'Đang tạo ảnh...' : 'Lưu ảnh thiệp của tớ'}</span>
            </button>
          </div>
        </div>
      </article>

      {ready && (
        <div aria-hidden="true" style={{ position: 'fixed', left: '-10000px', top: 0, pointerEvents: 'none' }}>
          <WishExport ref={exportRef} person={person} text={wish.text} qr={qr} />
        </div>
      )}
    </div>
  );
}
