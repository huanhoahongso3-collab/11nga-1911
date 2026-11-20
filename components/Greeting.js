'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import WelcomeCard from './WelcomeCard';
import CardStep from './CardStep';
import QrPanel from './QrPanel';
import Toast from './Toast';
import Ambient from './Ambient';
import Reveal from './Reveal';
import Balloons from './Balloons';
import { PastelAudio } from '@/lib/audio';
import { PastelFireworks, triggerOpeningCelebration, clearCelebrationTimers } from '@/lib/fireworks';

export default function Greeting({ generalWish }) {
  const [person, setPerson] = useState(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [toast, setToast] = useState({ text: '', icon: '✨', show: false });
  const canvasRef = useRef(null);
  const toastTimer = useRef(null);
  const revealTimer = useRef(null);
  const [revealing, setRevealing] = useState(false);

  const showToast = useCallback((text, icon = '✨') => {
    clearTimeout(toastTimer.current);
    setToast({ text, icon, show: true });
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, show: false })), 2500);
  }, []);

  useEffect(() => {
    PastelFireworks.init(canvasRef.current);
    PastelAudio.onChange = () => setMusicOn(!PastelAudio.isMuted);

    const onPointerDown = (event) => PastelFireworks.sparkleAt(event.clientX, event.clientY);
    let lastTrail = 0;
    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      const now = performance.now();
      if (now - lastTrail < 40) return;
      lastTrail = now;
      PastelFireworks.trailAt(event.clientX, event.clientY);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      clearTimeout(revealTimer.current);
      PastelAudio.onChange = null;
      PastelAudio.stopMusic();
      clearCelebrationTimers();
      clearTimeout(toastTimer.current);
    };
  }, []);

  // Browsers may block autoplay: start the music on the first touch while the card is open.
  useEffect(() => {
    if (!person) return;
    const unlock = () => {
      if (!PastelAudio.isMuted && !PastelAudio.isPlayingMusic) PastelAudio.startMusic();
    };
    document.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });
    return () => {
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, [person]);

  function openCard(selected) {
    setPerson(selected);
    setHasOpened(true);
    setRevealing(true);
    clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => setRevealing(false), 1450);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    PastelAudio.startMusic();
    triggerOpeningCelebration();
  }

  function backToWelcome() {
    clearCelebrationTimers();
    setPerson(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleMusic() {
    PastelAudio.setMuted(!PastelAudio.isMuted);
    showToast(
      PastelAudio.isMuted ? 'Đã tắt âm thanh' : 'Đang phát giai điệu chúc mừng 19/11',
      PastelAudio.isMuted ? '🔇' : '🎵',
    );
  }

  return (
    <>
      <Toast {...toast} />
      <Ambient />
      {person && <Balloons key={person.full} />}
      {revealing && <Reveal />}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-40" />

      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 my-auto">
        {person ? (
          <CardStep
            person={person}
            generalWish={generalWish}
            musicOn={musicOn}
            onBack={backToWelcome}
            onToggleMusic={toggleMusic}
            showToast={showToast}
          />
        ) : (
          <WelcomeCard onOpen={openCard} focusOnMount={hasOpened} />
        )}
        <QrPanel showToast={showToast} />
      </main>

      <footer className="text-center py-5 text-xs font-semibold text-inkLight">
        <span>Made with </span>
        <span className="hover-beat inline-block cursor-default text-rose-400">♥</span>
        <span> by Tập thể nữ 11 Nga</span>
      </footer>
    </>
  );
}
