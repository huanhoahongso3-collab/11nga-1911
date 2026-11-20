'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { NAMES, normName } from '@/lib/names';
import { GUESS } from '@/lib/guessData';
import { PastelFireworks, clearCelebrationTimers, launchExtraCelebration } from '@/lib/fireworks';

const ROUNDS = 8;
const MAX_HINT_LEVEL = 2;
const BLUR = [20, 11, 5];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function newGame() {
  return shuffle(NAMES)
    .slice(0, ROUNDS)
    .map((person) => ({
      person,
      photo: Math.random() < 0.5 ? 1 : 2,
      options: shuffle([person, ...shuffle(NAMES.filter((n) => n.full !== person.full)).slice(0, 3)]),
    }));
}

function rating(score) {
  const max = ROUNDS * 3;
  if (score >= max * 0.8) return 'Quá đỉnh, cậu thuộc lớp như lòng bàn tay! 🏆';
  if (score >= max * 0.55) return 'Khá lắm, cậu quen mặt hầu hết các bạn rồi đó! 👏';
  if (score >= max * 0.3) return 'Cũng ổn, lần sau chắc còn hơn nữa nha 🙂';
  return 'Cậu cần ngồi chơi với lớp nhiều hơn rồi đó 😆';
}

export default function GuessGame() {
  const canvasRef = useRef(null);
  const [rounds, setRounds] = useState(null);
  const [index, setIndex] = useState(0);
  const [level, setLevel] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [earned, setEarned] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    PastelFireworks.init(canvasRef.current);
    setRounds(newGame());
    return () => clearCelebrationTimers();
  }, []);

  const done = rounds && index >= rounds.length;
  useEffect(() => {
    if (done) launchExtraCelebration();
  }, [done]);

  function restart() {
    setRounds(newGame());
    setIndex(0);
    setLevel(0);
    setWrong([]);
    setAnswered(false);
    setEarned(0);
    setScore(0);
  }

  function choose(round, option) {
    if (answered || wrong.includes(option.full)) return;
    if (option.full === round.person.full) {
      const points = Math.max(1, 3 - level - wrong.length);
      setEarned(points);
      setScore((s) => s + points);
      setAnswered(true);
      PastelFireworks.sparkleAt(window.innerWidth / 2, window.innerHeight * 0.38, 18);
      PastelFireworks.rocket(0.5, 0.3, 'ring');
    } else {
      setWrong((list) => [...list, option.full]);
    }
  }

  function next() {
    setIndex((i) => i + 1);
    setLevel(0);
    setWrong([]);
    setAnswered(false);
    setEarned(0);
  }

  const round = rounds && rounds[index];

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-40" />

      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          href="/"
          className="hover-pop px-3.5 py-2 rounded-xl bg-white hover:bg-cream text-ink text-xs font-bold border border-butterBorder"
        >
          ← Về trang thiệp
        </Link>
        <span className="hover-pop cursor-default px-3.5 py-2 rounded-xl bg-butter text-ink text-xs font-bold border border-butterBorder">
          ⭐ {score} điểm
        </span>
      </div>

      <section className="paper-card rounded-3xl p-6 sm:p-8 relative animate-reveal">
        <div className="washi-tape washi-tape-peach" />

        {!rounds && <p className="text-center text-inkLight font-semibold py-10">Đang chuẩn bị trò chơi...</p>}

        {round && !done && (
          <>
            <div className="flex items-center justify-between gap-3 mb-1 pt-1">
              <h1 className="font-hand text-3xl sm:text-4xl text-ink leading-none">Ai đây nhỉ?</h1>
              <span className="text-xs font-bold text-inkLight">
                Câu {index + 1}/{rounds.length}
              </span>
            </div>
            <div className="h-2 rounded-full bg-cream border border-ink/10 overflow-hidden mb-5" aria-hidden="true">
              <div
                className="h-full rounded-full bg-mintBorder transition-all duration-500"
                style={{ width: `${((index + (answered ? 1 : 0)) / rounds.length) * 100}%` }}
              />
            </div>

            <div className="mx-auto mb-5 flex h-60 w-60 max-w-full items-center justify-center rounded-full border-2 border-peachBorder bg-peachSoft/50 overflow-hidden">
              <img
                key={`${index}-${answered}`}
                src={`/stickers/${normName(round.person.full).replace(/\s+/g, '-')}-${round.photo}.png`}
                alt={answered ? round.person.full : 'Ảnh mờ của một bạn nam'}
                draggable="false"
                className={`game-photo ${answered ? 'diecut animate-pop' : ''}`}
                style={answered ? undefined : { filter: `blur(${BLUR[level]}px) brightness(0.97)` }}
              />
            </div>

            <ul className="mb-5 flex flex-wrap justify-center gap-2" aria-label="Gợi ý">
              {GUESS[round.person.full].slice(0, level + 1).map((hint) => (
                <li
                  key={hint}
                  className="animate-pop px-3 py-1.5 rounded-full bg-butter border-2 border-butterBorder text-xs sm:text-sm font-bold text-ink"
                >
                  💡 {hint}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-3">
              {round.options.map((option) => {
                const isRight = answered && option.full === round.person.full;
                const isWrong = wrong.includes(option.full);
                return (
                  <button
                    key={option.full}
                    type="button"
                    onClick={() => choose(round, option)}
                    disabled={answered || isWrong}
                    className={`btn-sticker py-3 px-3 rounded-2xl font-bold text-base border-2 text-ink ${
                      isRight
                        ? 'bg-mintSoft border-mintBorder shadow-[0_4px_0_rgb(var(--c-mintBorder))]'
                        : isWrong
                          ? 'bg-pinkSoft border-pinkBorder opacity-60 line-through'
                          : 'bg-white border-peachBorder shadow-[0_4px_0_rgb(var(--c-peachBorder))]'
                    } disabled:cursor-not-allowed`}
                  >
                    {option.call}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              {answered ? (
                <>
                  <p className="font-hand text-xl text-ink">
                    Đúng rồi! {round.person.full} <span className="text-mintBorder">+{earned}</span>
                  </p>
                  <button
                    type="button"
                    onClick={next}
                    className="btn-sticker px-5 py-2.5 rounded-2xl bg-peachSoft text-ink font-bold text-sm border-2 border-peachBorder shadow-[0_4px_0_rgb(var(--c-peachBorder))]"
                  >
                    {index + 1 === rounds.length ? 'Xem kết quả 🎉' : 'Câu tiếp theo →'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setLevel((l) => Math.min(MAX_HINT_LEVEL, l + 1))}
                  disabled={level >= MAX_HINT_LEVEL}
                  className="btn-sticker px-4 py-2.5 rounded-2xl bg-butter text-ink font-bold text-xs sm:text-sm border-2 border-butterBorder shadow-[0_4px_0_rgb(var(--c-butterBorder))] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>💡</span>
                  <span>Gợi ý thêm (-1 điểm)</span>
                </button>
              )}
            </div>
          </>
        )}

        {done && (
          <div className="text-center py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-inkLight">Kết quả của cậu</p>
            <p className="font-hand text-6xl text-ink my-2">
              {score}
              <span className="text-2xl text-inkLight"> / {ROUNDS * 3}</span>
            </p>
            <p className="text-sm sm:text-base font-semibold text-ink max-w-xs mx-auto mb-6">{rating(score)}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="btn-sticker px-5 py-2.5 rounded-2xl bg-mintSoft text-ink font-bold text-sm border-2 border-mintBorder shadow-[0_4px_0_rgb(var(--c-mintBorder))]"
              >
                🔄 Chơi lại
              </button>
              <Link
                href="/"
                className="btn-sticker px-5 py-2.5 rounded-2xl bg-white text-ink font-bold text-sm border-2 border-peachBorder shadow-[0_4px_0_rgb(var(--c-peachBorder))]"
              >
                💌 Mở thiệp của tớ
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
