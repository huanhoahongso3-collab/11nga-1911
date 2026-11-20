export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Saturated enough to read on the cream page background.
export const PALETTE = ['#FF7A9C', '#FFB020', '#35C2A0', '#6C8CFF', '#B07CF0', '#FF9770', '#F25F8C'];
export const PAPER_COLORS = [...PALETTE, '#FFE066'];
export const BURST_KINDS = ['peony', 'ring', 'heart', 'willow', 'star', 'spiral'];

const TAU = Math.PI * 2;

// Returns particle specs (relative to the burst centre). `scale` follows the viewport size.
export function burst(kind, scale) {
  const base = pick(PALETTE);
  const accent = pick(PALETTE);
  const parts = [];
  const add = (angle, speed, extra = {}) =>
    parts.push({
      vx: Math.cos(angle) * speed * scale,
      vy: Math.sin(angle) * speed * scale,
      g: 0.06,
      drag: 0.955,
      life: rand(55, 80),
      size: rand(2.4, 3.8) * scale,
      color: base,
      shape: 'dot',
      ...extra,
    });

  if (kind === 'peony') {
    for (let i = 0; i < 74; i++) {
      add((i / 74) * TAU + rand(-0.05, 0.05), rand(2.2, 6), { color: i % 3 === 0 ? accent : base });
    }
  } else if (kind === 'ring') {
    for (let i = 0; i < 48; i++) add((i / 48) * TAU, 5.2, { drag: 0.96, life: rand(60, 75) });
    for (let i = 0; i < 26; i++) add((i / 26) * TAU + 0.1, 2.6, { color: accent, drag: 0.95 });
  } else if (kind === 'heart') {
    for (let i = 0; i < 64; i++) {
      const t = (i / 64) * TAU;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      parts.push({
        vx: hx * 0.3 * scale,
        vy: hy * 0.3 * scale,
        g: 0.035,
        drag: 0.945,
        life: rand(70, 85),
        size: rand(3, 4.2) * scale,
        color: i % 4 === 0 ? '#FFB3C7' : '#FF5C8A',
        shape: 'dot',
      });
    }
    for (let i = 0; i < 10; i++) add(rand(0, TAU), rand(0.5, 2), { color: '#FFD166', shape: 'star', size: rand(4, 6) * scale, life: 60 });
  } else if (kind === 'willow') {
    for (let i = 0; i < 70; i++) {
      add(rand(0, TAU), rand(2, 5.2), {
        g: 0.03,
        drag: 0.986,
        life: rand(110, 150),
        size: rand(1.8, 2.8) * scale,
        color: i % 2 ? '#FFB020' : accent,
        twinkle: true,
      });
    }
  } else if (kind === 'star') {
    for (let spoke = 0; spoke < 10; spoke++) {
      const angle = (spoke / 10) * TAU - Math.PI / 2;
      const reach = spoke % 2 ? 2.6 : 5.8;
      for (let j = 0; j < 6; j++) {
        add(angle, reach * (0.35 + j * 0.13), { drag: 0.95, life: rand(55, 70), size: rand(3, 4.6) * scale, color: j % 2 ? accent : base });
      }
    }
    for (let i = 0; i < 6; i++) add(rand(0, TAU), rand(0.5, 1.8), { shape: 'star', size: rand(5, 7) * scale, color: '#FFD166', life: 55 });
  } else if (kind === 'spiral') {
    for (let arm = 0; arm < 3; arm++) {
      for (let i = 0; i < 30; i++) {
        add(i * 0.32 + (arm * TAU) / 3, 1.4 + i * 0.13, { color: arm === 1 ? accent : base, drag: 0.958, life: rand(60, 78) });
      }
    }
  }

  return parts;
}
