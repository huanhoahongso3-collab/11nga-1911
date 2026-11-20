'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Left = 2025 ("Day one"), right = 2026 ("One day"), as on the class slide.
const PHOTOS = [
  { year: '2025', label: 'Day one', frame: '/compare/2025-frame.jpg', full: '/compare/2025-full.jpg', rot: '-2deg' },
  { year: '2026', label: 'One day', frame: '/compare/2026-frame.jpg', full: '/compare/2026-full.jpg', rot: '2deg' },
];

export default function YearCompare() {
  const [open, setOpen] = useState(null);
  const closeButton = useRef(null);
  const opener = useRef(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  // The viewer closes with Esc, switches year with the arrow keys, and locks page scrolling while open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (event) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') setOpen(0);
      else if (event.key === 'ArrowRight') setOpen(1);
    };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  const current = open === null ? null : PHOTOS[open];

  return (
    <section className="mt-12 sm:mt-14" aria-labelledby="compare-title">
      <div className="paper-card-peach rounded-3xl p-6 sm:p-8 relative">
        <div className="washi-tape washi-tape-peach" />
        <h2 id="compare-title" className="font-hand text-2xl sm:text-3xl text-ink leading-tight text-center mb-6 pt-1">
          Lớp mình, năm ngoái và năm nay
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.year}
              type="button"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setOpen(i);
              }}
              aria-label={`Phóng to ảnh cả lớp năm ${photo.year}`}
              className="group flex flex-col items-center gap-2 text-ink"
            >
              <span className="px-3 py-0.5 rounded-full bg-butter border-2 border-butterBorder font-hand text-xl sm:text-2xl leading-tight">
                {photo.year}
              </span>
              <span className="film w-full" style={{ '--rot': photo.rot }}>
                <img
                  src={photo.frame}
                  alt={`Cả lớp năm ${photo.year}`}
                  width={900}
                  height={592}
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />
                <span className="film-zoom" aria-hidden="true">🔍</span>
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-inkLight">{photo.label}</span>
            </button>
          ))}
        </div>
      </div>

      {current &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Ảnh cả lớp năm ${current.year}`}
            className="lightbox-in fixed inset-0 z-[80] flex flex-col items-center justify-center gap-3 bg-black/85 p-4"
            onClick={close}
          >
            <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
              {PHOTOS.map((photo, i) => (
                <button
                  key={photo.year}
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-pressed={open === i}
                  className={`px-4 py-1.5 rounded-full border-2 font-hand text-xl leading-tight ${
                    open === i ? 'bg-butter border-butterBorder text-ink' : 'bg-white/10 border-white/30 text-white'
                  }`}
                >
                  {photo.year}
                </button>
              ))}
              <button
                ref={closeButton}
                type="button"
                onClick={close}
                aria-label="Đóng"
                className="ml-2 h-9 w-9 rounded-full border-2 border-white/30 bg-white/10 text-white text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <img
              key={current.year}
              src={current.full}
              alt={`Cả lớp năm ${current.year}`}
              className="max-h-[78vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
            <p className="text-sm font-bold text-white/80">
              {current.year} · {current.label}
            </p>
          </div>,
          document.body,
        )}
    </section>
  );
}
