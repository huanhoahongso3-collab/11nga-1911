'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NAMES, normName } from '@/lib/names';
import { renderPersonalCard, downloadCanvas } from '@/lib/exportCard';

const EMOJIS = ['🌟', '🍀', '🎈', '☀️', '📚', '✨', '💫'];

const FALLBACK_NOTES = {
  no_key: (call) => `Máy chủ chưa có khóa AI nên đây là lời chúc viết sẵn dành riêng cho ${call}.`,
  ai_error: (call) => `AI đang bận hoặc bị lỗi nên đây là lời chúc viết sẵn dành riêng cho ${call}.`,
};

// Reveals text progressively; stays fully visible for people who prefer reduced motion.
function useTypewriter(text, active) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      return;
    }

    setCount(0);
    const total = Math.min(3400, Math.max(1300, text.length * 22));
    const start = performance.now();
    let frame;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / total);
      setCount(Math.ceil(progress * text.length));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [text, active]);

  return count;
}

export default function PersonalCard({ person, showToast, onCelebrate }) {
  const [wish, setWish] = useState({ status: 'loading', text: '', source: '', reason: '' });
  const controller = useRef(null);
  const emoji = EMOJIS[NAMES.findIndex((n) => n.full === person.full) % EMOJIS.length];

  const loadWish = useCallback(async () => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setWish({ status: 'loading', text: '', source: '', reason: '' });

    try {
      const response = await fetch('/api/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: person.full }),
        signal: current.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.text) throw new Error(data?.error || 'request_failed');
      setWish({ status: 'ready', text: data.text, source: data.source, reason: data.reason || '' });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setWish({ status: 'error', text: '', source: '', reason: '' });
    }
  }, [person.full]);

  useEffect(() => {
    loadWish();
    return () => controller.current?.abort();
  }, [loadWish]);

  const ready = wish.status === 'ready';
  const typed = useTypewriter(wish.text, ready);
  const typing = ready && typed < wish.text.length;

  function saveCard() {
    if (!ready) {
      showToast('Đợi lời chúc viết xong đã nhé!', '⏳');
      return;
    }
    const canvas = renderPersonalCard(person.full, wish.text);
    downloadCanvas(canvas, `Thiep-19-11-11Nga-${normName(person.full).replace(/\s+/g, '-')}.png`);
    showToast('Đã lưu ảnh thiệp của cậu về máy!', '📸');
  }

  const loading = wish.status === 'loading';
  const note = wish.source === 'fallback' ? (FALLBACK_NOTES[wish.reason] || FALLBACK_NOTES.ai_error)(person.call) : '';

  return (
    <article className="paper-card-mint rounded-3xl p-6 sm:p-8 relative">
      <div className="washi-tape washi-tape-mint" />

      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 pt-1 border-b border-dashed border-mintBorder">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-white border border-mintBorder flex items-center justify-center text-xl shrink-0">
            <span className="animate-bob">{emoji}</span>
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-inkLight block">Lời nhắn riêng dành cho</span>
            <h2 className="font-hand text-2xl sm:text-3xl text-ink leading-tight">{person.full}</h2>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-pinkSoft text-ink text-xs font-bold border border-pinkBorder">
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
              &quot;{wish.text.slice(0, typed)}
            </span>
            <span aria-hidden="true" className="opacity-0">
              {wish.text.slice(typed)}&quot;
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCelebrate}
          className="btn-sticker px-4 py-2.5 rounded-2xl bg-pinkSoft hover:bg-pinkBorder/60 text-ink font-bold text-xs sm:text-sm border-2 border-pinkBorder shadow-[0_4px_0_#F6BDCB] flex items-center gap-1.5"
        >
          <span>🎉</span>
          <span>Bắn pháo chúc mừng</span>
        </button>

        <button
          type="button"
          onClick={loadWish}
          disabled={loading}
          className="btn-sticker px-4 py-2.5 rounded-2xl bg-mintSoft hover:bg-mintBorder/70 text-ink font-bold text-xs sm:text-sm border-2 border-mintBorder shadow-[0_4px_0_#A9DFB1] flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
        >
          <span>🔄</span>
          <span>Viết lại lời chúc</span>
        </button>

        <button
          type="button"
          onClick={saveCard}
          className="btn-sticker px-5 py-2.5 rounded-2xl bg-butter hover:bg-butterBorder/70 text-ink font-bold text-xs sm:text-sm border-2 border-butterBorder shadow-[0_4px_0_#EBD584] flex items-center gap-2 ml-auto"
        >
          <span>📸</span>
          <span>Lưu ảnh thiệp của tớ</span>
        </button>
      </div>
    </article>
  );
}
