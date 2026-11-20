'use client';

import { useState } from 'react';
import CreditsPlayer from './CreditsPlayer';

// Still frame of the video; the video itself only downloads when someone presses play.
const POSTER = '/credits/girls.jpg';

export default function Credits() {
  const [open, setOpen] = useState(false);

  return (
    <figure className="credits relative mx-auto mb-6 w-full max-w-[340px] sm:max-w-[400px] px-2">
      <span className="twinkle absolute -left-1 top-6 text-lg text-pinkBorder" style={{ '--d': '0s' }} aria-hidden="true">♥</span>
      <span className="twinkle absolute -right-1 top-14 text-xl text-butterBorder" style={{ '--d': '0.8s' }} aria-hidden="true">✦</span>
      <span className="twinkle absolute -left-2 bottom-16 text-xl text-mintBorder" style={{ '--d': '1.5s' }} aria-hidden="true">✿</span>
      <span className="twinkle absolute -right-2 bottom-10 text-lg text-peachBorder" style={{ '--d': '2.1s' }} aria-hidden="true">♥</span>

      <div className="polaroid">
        <div className="washi-tape washi-tape-peach" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Phát video của tập thể nữ 11 Nga"
          className="polaroid-photo block w-full"
        >
          <img
            src={POSTER}
            alt="Tập thể nữ 11 Nga"
            width={1000}
            height={557}
            loading="lazy"
            decoding="async"
            draggable="false"
            className="polaroid-img is-active"
          />
          <span className="play-badge" aria-hidden="true">
            <span className="pl-1">▶</span>
          </span>
        </button>
        <figcaption className="mt-2.5 text-center font-hand text-xl sm:text-2xl leading-none text-ink">
          Tập thể nữ 11 Nga <span className="text-pinkBorder">♥</span>
        </figcaption>
      </div>

      {open && <CreditsPlayer onClose={() => setOpen(false)} />}
    </figure>
  );
}
