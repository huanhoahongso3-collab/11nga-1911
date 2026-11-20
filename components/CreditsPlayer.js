'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const VIDEO = '/credits/girls.mp4';

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;

// Full-screen player for the credit video. The clip is stored portrait and shown rotated (like on the class slide),
// so the browser's own controls would be sideways: this player draws its own.
export default function CreditsPlayer({ onClose }) {
  const root = useRef(null);
  const video = useRef(null);
  const enteredFullscreen = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState({ current: 0, duration: 0 });
  const [canFullscreen, setCanFullscreen] = useState(false);

  const close = useCallback(() => {
    if (fullscreenElement()) {
      enteredFullscreen.current = false;
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    }
    onClose();
  }, [onClose]);

  // Open straight into full screen where the browser allows it (needs this tap as the user gesture).
  useEffect(() => {
    const el = root.current;
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    setCanFullscreen(Boolean(request));
    if (request) {
      Promise.resolve(request.call(el))
        .then(() => {
          enteredFullscreen.current = true;
        })
        .catch(() => {});
    }
    video.current?.play().catch(() => {});

    const onFullscreenChange = () => {
      if (!fullscreenElement() && enteredFullscreen.current) {
        enteredFullscreen.current = false;
        onClose();
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') close();
      else if (event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const el = video.current;
    if (!el) return;
    if (el.paused || el.ended) el.play().catch(() => {});
    else el.pause();
  }

  function toggleMute() {
    if (!video.current) return;
    video.current.muted = !video.current.muted;
    setMuted(video.current.muted);
  }

  function toggleFullscreen() {
    if (fullscreenElement()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      const el = root.current;
      Promise.resolve((el.requestFullscreen || el.webkitRequestFullscreen).call(el))
        .then(() => {
          enteredFullscreen.current = true;
        })
        .catch(() => {});
    }
  }

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Video của tập thể nữ 11 Nga"
      className="lightbox-in fixed inset-0 z-[90] flex flex-col items-center justify-center gap-3 bg-black p-3"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Đóng"
        className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full border-2 border-white/30 bg-white/10 text-white text-lg leading-none"
      >
        ✕
      </button>

      <div className="credits-stage">
        <video
          ref={video}
          src={VIDEO}
          playsInline
          preload="metadata"
          className="credits-video"
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => setTime({ current: event.currentTarget.currentTime, duration: event.currentTarget.duration })}
          onLoadedMetadata={(event) => setTime({ current: 0, duration: event.currentTarget.duration })}
        />
        {!playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Phát"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-3xl text-white"
          >
            <span className="pl-1">▶</span>
          </button>
        )}
      </div>

      <div className="credits-bar flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-white">
        <button type="button" onClick={toggle} aria-label={playing ? 'Tạm dừng' : 'Phát'} className="w-6 text-lg leading-none">
          {playing ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          min="0"
          max={time.duration || 0}
          step="0.1"
          value={time.current}
          onChange={(event) => {
            if (video.current) video.current.currentTime = Number(event.target.value);
          }}
          aria-label="Tua video"
          className="min-w-0 flex-1 accent-[#F3BE9C]"
        />
        <span className="w-[5.5rem] text-center text-xs font-bold tabular-nums">
          {formatTime(time.current)} / {formatTime(time.duration)}
        </span>
        <button type="button" onClick={toggleMute} aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'} className="w-6 text-lg leading-none">
          {muted ? '🔇' : '🔊'}
        </button>
        {canFullscreen && (
          <button type="button" onClick={toggleFullscreen} aria-label="Toàn màn hình" className="w-6 text-lg leading-none">
            ⛶
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
