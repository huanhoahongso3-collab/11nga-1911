'use client';

import PersonalCard from './PersonalCard';
import { launchExtraCelebration } from '@/lib/fireworks';

// **chữ** thành chữ in đậm.
function renderBold(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part));
}

export default function CardStep({ person, generalWish, musicOn, onBack, onToggleMusic, showToast }) {
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
          {generalWish.map((paragraph, i) => (
            <p key={i}>{renderBold(paragraph)}</p>
          ))}
        </div>
      </article>

      <div className="animate-pop" style={{ '--d': '300ms' }}>
        <PersonalCard person={person} showToast={showToast} onCelebrate={launchExtraCelebration} />
      </div>
    </section>
  );
}
