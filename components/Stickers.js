import { normName } from '@/lib/names';

// Slide photos of the person, cut out as die-cut stickers around their wish card.
export default function Stickers({ person }) {
  const slug = normName(person.full).replace(/\s+/g, '-');

  return (
    <div aria-hidden="true">
      <span className="sticker-slot sticker-a animate-pop" style={{ '--rot': '7deg', '--d': '800ms' }}>
        <img className="sticker sticker-float" src={`/stickers/${slug}-1.png`} alt="" loading="lazy" draggable="false" />
      </span>
      <span className="sticker-slot sticker-b animate-pop" style={{ '--rot': '-8deg', '--d': '980ms' }}>
        <img className="sticker sticker-float sticker-float-b" src={`/stickers/${slug}-2.png`} alt="" loading="lazy" draggable="false" />
      </span>
    </div>
  );
}
