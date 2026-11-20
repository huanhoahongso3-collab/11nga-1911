'use client';

import { useEffect, useRef, useState } from 'react';
import { findPerson } from '@/lib/names';

export default function WelcomeCard({ onOpen, focusOnMount }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  function fail(message) {
    setError(message);
    const input = inputRef.current;
    if (input) {
      input.classList.remove('animate-shake');
      void input.offsetWidth;
      input.classList.add('animate-shake');
      input.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const raw = name.trim();
    if (!raw) return fail('Cậu nhập tên của mình trước khi mở thiệp nhé!');

    const person = findPerson(raw);
    if (!person) {
      return fail('Tên chưa hợp lệ rồi. Cậu hãy nhập tên gọi (từ cuối của họ tên) hoặc họ tên đầy đủ nhé!');
    }

    setError('');
    onOpen(person);
  }

  return (
    <section className="animate-reveal">
      <div className="paper-card rounded-3xl p-7 sm:p-11 relative text-center">
        <div className="washi-tape" />

        <svg
          className="hidden sm:block w-9 h-9 text-butterBorder absolute top-6 right-7 doodle-float pointer-events-none"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2l2.8 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17l-5.9 3.1 1.3-6.6-4.9-4.6 6.7-.8L12 2z" />
        </svg>

        <div
          className="animate-rise inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-butter border-2 border-butterBorder text-ink text-xs sm:text-sm font-bold mb-5"
          style={{ '--d': '60ms' }}
        >
          <span className="animate-bob">🍀</span>
          <span>19/11 • Lớp 11 Nga</span>
        </div>

        <h1 className="animate-rise font-hand text-3xl sm:text-5xl text-ink leading-tight mb-3" style={{ '--d': '160ms' }}>
          Gửi các chàng trai{' '}
          <span className="inline-block bg-mintSoft px-3 py-0.5 rounded-2xl border-2 border-mintBorder transform -rotate-1">
            11 Nga
          </span>
        </h1>

        <p
          className="animate-rise max-w-md mx-auto text-inkLight text-sm sm:text-base leading-relaxed font-medium mb-7"
          style={{ '--d': '260ms' }}
        >
          Hội con gái 11 Nga đã chuẩn bị sẵn một tấm thiệp nhỏ xinh dành riêng cho cậu. Nhập tên gọi của cậu (từ cuối của
          họ tên) hoặc họ tên đầy đủ để mở thiệp nhé!
        </p>

        <form onSubmit={handleSubmit} className="animate-rise max-w-md mx-auto space-y-3.5" style={{ '--d': '360ms' }} noValidate>
          <input
            ref={inputRef}
            type="text"
            id="boyNameInput"
            autoComplete="off"
            maxLength={40}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError('');
            }}
            placeholder="Nhập tên của cậu nhé..."
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'nameError' : undefined}
            className={`w-full px-5 py-3.5 rounded-2xl bg-cream border-2 ${
              error ? 'border-rose-400' : 'border-peachBorder'
            } focus:border-ink focus:bg-white focus:outline-none text-center text-ink placeholder-inkLight/60 text-base sm:text-lg font-semibold transition`}
          />

          {error && (
            <p id="nameError" role="alert" className="text-xs sm:text-sm font-semibold text-rose-500 leading-snug">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-sticker cta-pulse w-full py-3.5 px-6 rounded-2xl bg-peachSoft hover:bg-peachBorder/75 text-ink font-bold text-base sm:text-lg border-2 border-peachBorder shadow-[0_5px_0_#F3BE9C] flex items-center justify-center gap-2"
          >
            <span>Mở thiệp 19/11 ✨</span>
          </button>
        </form>

        <p className="animate-rise mt-6 text-xs text-inkLight font-semibold" style={{ '--d': '460ms' }}>
          From tập thể nữ 11 Nga với thật nhiều yêu thương ♥
        </p>
      </div>
    </section>
  );
}
