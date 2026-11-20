'use client';

import { useEffect, useRef, useState } from 'react';
import { NAMES, normName } from '@/lib/names';

const ROTATIONS = [-6, 4, -3, 7, -5, 3, -7, 5, -2, 6, -4];

const PHOTOS = [1, 2].flatMap((n) =>
  NAMES.map((person, i) => ({
    key: `${person.full}-${n}`,
    call: person.call,
    src: `/stickers/${normName(person.full).replace(/\s+/g, '-')}-${n}.png`,
    rot: ROTATIONS[(i + n * 3) % ROTATIONS.length],
  })),
);

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PhotoWall() {
  const grid = useRef(null);
  // Shuffled on the client after mount, so the server HTML and the first client render always match.
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    setPhotos(shuffle(PHOTOS));
  }, []);

  // Photos below the fold start hidden and pop in as they scroll into view; everything else is visible at rest.
  useEffect(() => {
    if (!photos) return;
    const items = [...(grid.current?.children || [])];
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const below = items.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    below.forEach((el) => el.classList.add('wall-pre'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('wall-pre');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    below.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [photos]);

  return (
    <section className="mt-12 sm:mt-14" aria-labelledby="wall-title">
      <div className="paper-card-butter rounded-3xl p-6 sm:p-8 relative">
        <div className="washi-tape" />
        <div className="text-center mb-6 pt-1">
          <h2 id="wall-title" className="font-hand text-2xl sm:text-3xl text-ink leading-tight">
            Góc ảnh các chàng trai 11 Nga
          </h2>
        </div>

        <div ref={grid} className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-7 min-h-[28rem]">
          {photos?.map((photo) => (
            <figure key={photo.key} className="wall-item flex flex-col items-center gap-2" style={{ '--rot': `${photo.rot}deg` }}>
              <img src={photo.src} alt="" loading="lazy" draggable="false" className="diecut h-32 sm:h-40 w-auto max-w-full object-contain" />
              <figcaption className="px-2.5 py-0.5 rounded-full bg-white border border-butterBorder text-[11px] sm:text-xs font-bold text-ink">
                {photo.call}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
