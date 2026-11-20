const SHAPES = [
  { ch: '✦', x: 6, s: 18, c: '#EBD584', dur: 26, delay: -4, sway: 28, rot: 50, o: 0.55 },
  { ch: '♥', x: 14, s: 16, c: '#F6BDCB', dur: 32, delay: -18, sway: -22, rot: -30, o: 0.5 },
  { ch: '✿', x: 23, s: 22, c: '#F3BE9C', dur: 29, delay: -9, sway: 30, rot: 60, o: 0.45 },
  { ch: '☘', x: 33, s: 20, c: '#A9DFB1', dur: 35, delay: -25, sway: -26, rot: -45, o: 0.6 },
  { ch: '★', x: 42, s: 14, c: '#EBD584', dur: 24, delay: -2, sway: 20, rot: 70, o: 0.5 },
  { ch: '❀', x: 51, s: 24, c: '#F6BDCB', dur: 38, delay: -30, sway: -30, rot: 40, o: 0.4 },
  { ch: '♥', x: 60, s: 18, c: '#F3BE9C', dur: 27, delay: -13, sway: 24, rot: -50, o: 0.5 },
  { ch: '✦', x: 68, s: 20, c: '#A9DFB1', dur: 33, delay: -21, sway: -20, rot: 55, o: 0.55 },
  { ch: '✿', x: 76, s: 16, c: '#EBD584', dur: 30, delay: -7, sway: 26, rot: -35, o: 0.5 },
  { ch: '☘', x: 84, s: 22, c: '#A9DFB1', dur: 36, delay: -16, sway: -28, rot: 45, o: 0.5 },
  { ch: '★', x: 91, s: 16, c: '#F6BDCB', dur: 25, delay: -11, sway: 22, rot: 65, o: 0.55 },
  { ch: '❀', x: 96, s: 20, c: '#F3BE9C', dur: 31, delay: -27, sway: -24, rot: -40, o: 0.45 },
];

export default function Ambient() {
  return (
    <div aria-hidden="true">
      {SHAPES.map((shape, i) => (
        <span
          key={i}
          className="doodle"
          style={{
            '--x': `${shape.x}%`,
            '--s': `${shape.s}px`,
            '--c': shape.c,
            '--dur': `${shape.dur}s`,
            '--delay': `${shape.delay}s`,
            '--sway': `${shape.sway}px`,
            '--rot': `${shape.rot}deg`,
            '--o': shape.o,
          }}
        >
          {shape.ch}
        </span>
      ))}
    </div>
  );
}
