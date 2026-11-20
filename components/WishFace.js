import Stickers from './Stickers';
import { NAMES } from '@/lib/names';

const EMOJIS = ['🌟', '🍀', '🎈', '☀️', '📚', '✨', '💫'];

// Read-only wish card shared by the public share page and the PNG export.
// `fixed` uses the desktop layout regardless of the viewport (needed for a consistent export size).
export default function WishFace({ person, text, fixed = false, animated = true, children }) {
  const emoji = EMOJIS[NAMES.findIndex((n) => n.full === person.full) % EMOJIS.length];
  const frame = fixed ? 'pt-[88px] pb-[88px] export-desktop' : 'pt-[68px] pb-16 sm:pt-[88px] sm:pb-[88px]';
  const pad = fixed ? 'p-8' : 'p-6 sm:p-8';
  const body = fixed ? 'text-base' : 'text-sm sm:text-base';

  return (
    <div className={`relative ${frame}`}>
      <Stickers person={person} animated={animated} eager={fixed} />
      <article className={`paper-card-mint rounded-3xl ${pad} relative`}>
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

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-mintBorder/80">
          <p className={`${body} text-ink leading-relaxed font-medium`}>&quot;{text}&quot;</p>
          <p className="mt-4 text-right font-hand text-lg text-inkLight">— Tập thể nữ 11 Nga —</p>
        </div>

        {children}
      </article>
    </div>
  );
}
