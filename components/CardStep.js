'use client';

import { useState } from 'react';
import PersonalCard from './PersonalCard';
import { useTypewriter } from '@/lib/useTypewriter';
import { launchExtraCelebration } from '@/lib/fireworks';

// **chữ** thành chữ in đậm.
function renderBold(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

export default function CardStep({ person, generalWish, musicOn, onBack, onToggleMusic, showToast }) {
  // Lời chúc chung chỉ được viết lại khi bấm nút, và quay về bản gốc khi tải lại trang.
  const [general, setGeneral] = useState({ paragraphs: generalWish, custom: false, fresh: false });
  const [busy, setBusy] = useState(false);

  const fullText = general.paragraphs.join('\n\n');
  const typed = useTypewriter(fullText, general.fresh);
  const typing = general.fresh && typed < fullText.length;
  const starts = [];
  general.paragraphs.reduce((offset, paragraph) => {
    starts.push(offset);
    return offset + paragraph.length + 2;
  }, 0);

  async function regenerateGeneral() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch('/api/general-wish', { method: 'POST' });
      const data = await response.json().catch(() => null);
      if (response.status === 429) {
        showToast('Cậu bấm nhanh quá, đợi chút rồi thử lại nhé!', '⏳');
      } else if (!response.ok || !data?.paragraphs?.length) {
        showToast('AI chưa viết được lúc này, cậu thử lại sau nhé!', '⚠️');
      } else {
        setGeneral({ paragraphs: data.paragraphs, custom: true, fresh: true });
      }
    } catch {
      showToast('Chưa kết nối được, cậu thử lại nhé!', '⚠️');
    } finally {
      setBusy(false);
    }
  }

  function resetGeneral() {
    setGeneral({ paragraphs: generalWish, custom: false, fresh: false });
  }

  return (
    <section className="space-y-7 sm:space-y-8 animate-reveal">
      <header
        className="animate-rise paper-card-butter rounded-2xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-2.5"
        style={{ '--d': '0ms' }}
      >
        <button
          type="button"
          onClick={onBack}
          className="hover-pop px-3.5 py-2 rounded-xl bg-white hover:bg-cream text-ink text-xs font-bold border border-butterBorder shrink-0"
        >
          ← Đổi tên khác
        </button>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={onToggleMusic}
            className={`btn-sticker px-3.5 py-2 rounded-xl text-ink text-xs font-bold border flex items-center gap-1.5 ${
              musicOn
                ? 'bg-mintSoft hover:bg-mintBorder/70 border-mintBorder shadow-[0_3px_0_#A9DFB1]'
                : 'bg-white border-ink/20 shadow-[0_3px_0_#A9DFB1]'
            }`}
          >
            {musicOn ? (
              <span className="eq" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            ) : (
              <span>🔇</span>
            )}
            <span>{musicOn ? 'Đang phát nhạc' : 'Bật nhạc'}</span>
          </button>

          <button
            type="button"
            onClick={launchExtraCelebration}
            className="btn-sticker px-3.5 py-2 rounded-xl bg-pinkSoft hover:bg-pinkBorder/70 text-ink text-xs font-bold border border-pinkBorder shadow-[0_3px_0_#F6BDCB] flex items-center gap-1.5"
          >
            <span>🎆</span>
            <span>Thả thêm pháo</span>
          </button>
        </div>
      </header>

      <article className="animate-rise paper-card rounded-3xl p-6 sm:p-8 relative" style={{ '--d': '140ms' }}>
        <div className="washi-tape washi-tape-peach" />

        <div className="flex items-center gap-3 mb-4 pt-1">
          <span className="hover-spin w-10 h-10 rounded-2xl bg-peachSoft/60 border border-peachBorder flex items-center justify-center text-xl shrink-0">
            🌿
          </span>
          <div>
            <h2 className="font-hand text-2xl sm:text-3xl text-ink leading-none mb-1">Lời chúc chung gửi các bạn nam 11 Nga</h2>
            <p className="text-xs text-inkLight font-semibold">Từ hội con gái lớp mình</p>
          </div>
        </div>

        <div className="bg-cream rounded-2xl p-5 sm:p-6 border border-dashed border-ink/15 space-y-3 text-sm sm:text-base leading-relaxed text-ink font-medium">
          {busy ? (
            <div aria-live="polite">
              <p className="text-sm sm:text-base text-inkLight font-semibold mb-3">
                Đang viết lời chúc chung
                <span className="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </p>
              <div className="space-y-2.5">
                <div className="shimmer w-full" />
                <div className="shimmer w-11/12" />
                <div className="shimmer w-3/4" />
              </div>
            </div>
          ) : (
            general.paragraphs.map((paragraph, i) => {
              if (!general.fresh) return <p key={i}>{renderBold(paragraph)}</p>;
              const start = starts[i];
              const shown = Math.max(0, Math.min(paragraph.length, typed - start));
              const active = typing && typed >= start && typed < start + paragraph.length + 2;
              return (
                <p key={i} aria-label={paragraph}>
                  <span aria-hidden="true" className={active ? 'caret' : ''}>
                    {paragraph.slice(0, shown)}
                  </span>
                  <span aria-hidden="true" className="opacity-0">
                    {paragraph.slice(shown)}
                  </span>
                </p>
              );
            })
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={regenerateGeneral}
            disabled={busy}
            className="btn-sticker px-4 py-2.5 rounded-2xl bg-peachSoft hover:bg-peachBorder/60 text-ink font-bold text-xs sm:text-sm border-2 border-peachBorder shadow-[0_4px_0_#F3BE9C] flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-wait"
          >
            <span>🔄</span>
            <span>Viết lại lời chúc chung</span>
          </button>

          {general.custom && !busy && (
            <button
              type="button"
              onClick={resetGeneral}
              className="btn-sticker px-4 py-2.5 rounded-2xl bg-white hover:bg-cream text-ink font-bold text-xs sm:text-sm border-2 border-peachBorder shadow-[0_4px_0_#F3BE9C] flex items-center gap-1.5"
            >
              <span>↩️</span>
              <span>Về lời chúc gốc</span>
            </button>
          )}
        </div>
      </article>

      <div className="animate-pop" style={{ '--d': '300ms' }}>
        <PersonalCard person={person} showToast={showToast} onCelebrate={launchExtraCelebration} />
      </div>
    </section>
  );
}
