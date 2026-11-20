'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import WelcomeCard from './WelcomeCard';
import CardStep from './CardStep';
import QrPanel from './QrPanel';
import Toast from './Toast';
import Ambient from './Ambient';
import { PastelAudio } from '@/lib/audio';
import { PastelFireworks, triggerOpeningCelebration, clearCelebrationTimers } from '@/lib/fireworks';

export default function Greeting() {
  const [person, setPerson] = useState(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(true);
  const [toast, setToast] = useState({ text: '', icon: '✨', show: false });
  const canvasRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((text, icon = '✨') => {
    clearTimeout(toastTimer.current);
    setToast({ text, icon, show: true });
    toastTimer.current = setTimeout(() => setToast((current) => ({ ...current, show: false })), 2500);
  }, []);

  useEffect(() => {
    PastelFireworks.init(canvasRef.current);
    PastelAudio.onChange = () => setMusicOn(!PastelAudio.isMuted);
    return () => {
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
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-40" />

      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 my-auto">
        {person ? (
          <CardStep
            person={person}
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
        <span className="text-rose-400">♥</span>
        <span> by Tập thể nữ 11 Nga</span>
      </footer>
    </>
  );
}
