import { useEffect, useState } from 'react';

// Reveals text progressively; stays fully visible for people who prefer reduced motion.
export function useTypewriter(text, active) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      return;
    }

    setCount(0);
    const total = Math.min(3400, Math.max(1300, text.length * 22));
    const start = performance.now();
    let frame;
    const step = (now) => {
      const progress = Math.min(1, (now - start) / total);
      setCount(Math.ceil(progress * text.length));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [text, active]);

  return count;
}
