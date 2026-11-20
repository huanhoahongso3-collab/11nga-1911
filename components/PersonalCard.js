'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NAMES, normName } from '@/lib/names';
import { renderPersonalCard, downloadCanvas } from '@/lib/exportCard';

const EMOJIS = ['🌟', '🍀', '🎈', '☀️', '📚', '✨', '💫'];

export default function PersonalCard({ person, showToast, onCelebrate }) {
  const [wish, setWish] = useState({ status: 'loading', text: '', source: '' });
  const controller = useRef(null);
  const emoji = EMOJIS[NAMES.findIndex((n) => n.full === person.full) % EMOJIS.length];

  const loadWish = useCallback(async () => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setWish({ status: 'loading', text: '', source: '' });

    try {
      const response = await fetch('/api/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: person.full }),
        signal: current.signal,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.text) throw new Error(data?.error || 'request_failed');
      setWish({ status: 'ready', text: data.text, source: data.source });
    } catch (error) {
      if (error.name === 'AbortError') return;
      setWish({ status: 'error', text: '', source: '' });
    }
  }, [person.full]);

  useEffect(() => {
    loadWish();
    return () => controller.current?.abort();
  }, [loadWish]);

  function saveCard() {
    if (wish.status !== 'ready') {
      showToast('Đợi lời chúc viết xong đã nhé!', '⏳');
      return;
    }
    const canvas = renderPersonalCard(person.full, wish.text);
    downloadCanvas(canvas, `Thiep-19-11-11Nga-${normName(person.full).replace(/\s+/g, '-')}.png`);
    showToast('Đã lưu ảnh thiệp của cậu về máy!', '📸');
  }

  const loading = wish.status === 'loading';

  return (
    <article className="paper-card-mint rounded-3xl p-6 sm:p-8 relative">
      <div className="washi-tape washi-tape-mint" />

      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 pt-1 border-b border-dashed border-mintBorder">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-white border border-mintBorder flex items-center justify-center text-xl shrink-0">
            {emoji}
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
        <p className="text-sm sm:text-base text-ink leading-relaxed font-medium" aria-live="polite">
          {loading && `Đang viết lời chúc riêng cho ${person.call}...`}
          {wish.status === 'ready' && `"${wish.text}"`}
          {wish.status === 'error' && 'Chưa tạo được lời chúc lúc này. Cậu bấm "Viết lại lời chúc" để thử lại nhé!'}
        </p>
        <p className="mt-4 text-right font-hand text-lg text-inkLight">— Tập thể nữ 11 Nga —</p>
        {wish.status === 'ready' && wish.source === 'fallback' && (
          <p className="mt-2 text-xs text-inkLight font-semibold">
            AI chưa sẵn sàng nên đây là lời chúc viết sẵn dành riêng cho {person.call}.
          </p>
        )}
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
