'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const MODES = ['auto', 'light', 'dark'];
const ICONS = { auto: '🌓', light: '☀️', dark: '🌙' };
const LABELS = { auto: 'theo thiết bị', light: 'sáng', dark: 'tối' };

// Cycles system -> light -> dark. The choice is remembered; the inline script in the layout applies it before first paint.
export default function ThemeToggle() {
  const pathname = usePathname();
  const [mode, setMode] = useState('auto');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') setMode(saved);
    } catch {
      /* storage blocked: stay on the system theme */
    }
  }, []);

  function cycle() {
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    setMode(next);
    try {
      if (next === 'auto') {
        localStorage.removeItem('theme');
        document.documentElement.removeAttribute('data-theme');
      } else {
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
      }
    } catch {
      document.documentElement.setAttribute('data-theme', next === 'auto' ? '' : next);
    }
  }

  // The read-only share page (opened from a QR code) has no controls.
  if (pathname.startsWith('/w/')) return null;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Giao diện ${LABELS[mode]}. Bấm để đổi.`}
      title={`Giao diện ${LABELS[mode]}`}
      className="hover-pop fixed right-2 top-2 z-[60] h-10 w-10 rounded-full bg-white border-2 border-peachBorder text-lg leading-none flex items-center justify-center shadow-[0_3px_0_rgb(var(--c-peachBorder))]"
    >
      <span aria-hidden="true">{ICONS[mode]}</span>
    </button>
  );
}
