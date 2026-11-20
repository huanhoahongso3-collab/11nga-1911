const BALLOONS = [
  { x: 6, s: 46, h: 0, dur: 7.5, delay: 0.5, sway: 30 },
  { x: 16, s: 38, h: 150, dur: 8.5, delay: 1.1, sway: -26 },
  { x: 27, s: 52, h: 300, dur: 7, delay: 0.8, sway: 34 },
  { x: 38, s: 40, h: 60, dur: 9, delay: 1.7, sway: -30 },
  { x: 50, s: 48, h: 210, dur: 8, delay: 0.3, sway: 28 },
  { x: 62, s: 42, h: 330, dur: 8.8, delay: 1.4, sway: -34 },
  { x: 73, s: 50, h: 100, dur: 7.2, delay: 0.9, sway: 26 },
  { x: 84, s: 38, h: 250, dur: 9.4, delay: 2, sway: -28 },
  { x: 93, s: 46, h: 30, dur: 7.8, delay: 1.2, sway: 32 },
];

export default function Balloons() {
  return (
    <div aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <span
          key={i}
          className="balloon"
          style={{ '--x': `${b.x}%`, '--s': `${b.s}px`, '--h': `${b.h}deg`, '--dur': `${b.dur}s`, '--delay': `${b.delay}s`, '--sway': `${b.sway}px` }}
        >
          🎈
        </span>
      ))}
    </div>
  );
}
