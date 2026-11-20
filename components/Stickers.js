import { normName } from '@/lib/names';

// Slide photos of the person, cut out as die-cut stickers around their wish card.
export default function Stickers({ person, animated = true, eager = false }) {
  const slug = normName(person.full).replace(/\s+/g, '-');
  const pop = animated ? ' animate-pop' : '';
  const loading = eager ? 'eager' : 'lazy';

  return (
    <div aria-hidden="true">
      <span className={`sticker-slot sticker-a${pop}`} style={{ '--rot': '7deg', '--d': '800ms' }}>
        <img className="sticker sticker-float" src={`/stickers/${slug}-1.png`} alt="" loading={loading} draggable="false" />
      </span>
      <span className={`sticker-slot sticker-b${pop}`} style={{ '--rot': '-8deg', '--d': '980ms' }}>
        <img className="sticker sticker-float sticker-float-b" src={`/stickers/${slug}-2.png`} alt="" loading={loading} draggable="false" />
      </span>
    </div>
  );
}
