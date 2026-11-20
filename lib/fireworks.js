import { PastelAudio } from './audio';
import { PALETTE, PAPER_COLORS, BURST_KINDS, burst, rand, pick } from './fireworkShapes';

const MAX_PARTICLES = 1500;
const TAU = Math.PI * 2;

function drawHeart(ctx, s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.5, -s, 0, -s * 0.45);
  ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.3, 0, s * 0.35);
  ctx.fill();
}

function drawStar(ctx, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outer = (i * TAU) / 5 - Math.PI / 2;
    const inner = outer + Math.PI / 5;
    if (i === 0) ctx.moveTo(Math.cos(outer) * r, Math.sin(outer) * r);
    else ctx.lineTo(Math.cos(outer) * r, Math.sin(outer) * r);
    ctx.lineTo(Math.cos(inner) * r * 0.45, Math.sin(inner) * r * 0.45);
  }
  ctx.closePath();
  ctx.fill();
}

export const PastelFireworks = {
  canvas: null,
  ctx: null,
  w: 0,
  h: 0,
  scale: 1,
  particles: [],
  rockets: [],
  raf: null,
  last: 0,
  lastPop: 0,
  resizeBound: false,

  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    if (!this.resizeBound) {
      this.resizeBound = true;
      window.addEventListener('resize', () => this.resize());
    }
  },

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.scale = Math.min(1.15, Math.max(0.55, Math.min(this.w, this.h) / 720));
  },

  disabled() {
    return !this.canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  add(spec) {
    if (this.particles.length >= MAX_PARTICLES) return;
    this.particles.push({ max: spec.life, rot: 0, vrot: 0, ...spec });
  },

  pop() {
    const now = performance.now();
    if (now - this.lastPop > 70) {
      this.lastPop = now;
      PastelAudio.playSoftPopSound();
    }
  },

  confettiCannon(side) {
    if (this.disabled()) return;
    this.pop();
    const x = side === 'left' ? this.w * 0.04 : this.w * 0.96;
    const y = this.h * 0.92;
    const aim = side === 'left' ? -Math.PI / 3 : (-2 * Math.PI) / 3;
    for (let i = 0; i < 46; i++) {
      const angle = aim + rand(-0.5, 0.5);
      const speed = rand(9, 19) * this.scale;
      this.add({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        g: 0.3,
        drag: 0.965,
        life: rand(110, 170),
        size: rand(5, 10) * this.scale,
        color: pick(PAPER_COLORS),
        shape: pick(['paper', 'paper', 'paper', 'strip', 'heart', 'star', 'dot']),
        rot: rand(0, TAU),
        vrot: rand(-0.25, 0.25),
        flip: rand(0, TAU),
        vflip: rand(0.12, 0.3),
        sway: rand(0, TAU),
      });
    }
    this.start();
  },

  rocket(xRatio, yRatio, kind) {
    if (this.disabled()) return;
    const startX = this.w * (xRatio + rand(-0.12, 0.12));
    this.rockets.push({
      sx: startX,
      sy: this.h + 10,
      tx: this.w * xRatio,
      ty: this.h * yRatio,
      x: startX,
      y: this.h + 10,
      t: 0,
      duration: rand(52, 68),
      kind,
      color: pick(PALETTE),
    });
    PastelAudio.playWhoosh();
    this.start();
  },

  explode(x, y, kind, color) {
    this.pop();
    burst(kind, this.scale).forEach((spec) => this.add({ x, y, ...spec }));
    this.add({ x, y, vx: 0, vy: 0, g: 0, drag: 1, life: 22, size: 4 * this.scale, grow: 70 * this.scale, color, shape: 'ring' });
  },

  sparkleAt(x, y, count = 12) {
    if (this.disabled()) return;
    for (let i = 0; i < count; i++) {
      const angle = rand(0, TAU);
      const speed = rand(1.5, 4.8) * this.scale;
      this.add({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        g: 0.08,
        drag: 0.93,
        life: rand(28, 46),
        size: rand(4, 8) * this.scale,
        color: pick(PALETTE),
        shape: pick(['heart', 'star', 'dot', 'dot']),
        rot: rand(0, TAU),
        vrot: rand(-0.15, 0.15),
      });
    }
    this.start();
  },

  trailAt(x, y) {
    if (this.disabled()) return;
    this.add({
      x,
      y,
      vx: rand(-0.4, 0.4),
      vy: -rand(0.2, 0.9),
      g: -0.005,
      drag: 0.97,
      life: rand(20, 30),
      size: rand(2, 4) * this.scale,
      color: pick(PALETTE),
      shape: Math.random() < 0.3 ? 'star' : 'dot',
    });
    this.start();
  },

  start() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame((now) => this.tick(now));
  },

  tick(now) {
    const ctx = this.ctx;
    const k = Math.min(3, (now - this.last) / 16.667 || 1);
    this.last = now;

    // Fade the previous frame instead of clearing it: this leaves glowing trails.
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.26)';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'source-over';

    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.t += k / r.duration;
      const ease = 1 - Math.pow(1 - Math.min(r.t, 1), 2.2);
      r.x = r.sx + (r.tx - r.sx) * ease + Math.sin(r.t * 14) * 3 * this.scale;
      r.y = r.sy + (r.ty - r.sy) * ease;

      for (let j = 0; j < 2; j++) {
        this.add({
          x: r.x,
          y: r.y,
          vx: rand(-0.4, 0.4),
          vy: rand(0.4, 1.4),
          g: 0.04,
          drag: 0.92,
          life: rand(16, 26),
          size: rand(1.4, 2.6) * this.scale,
          color: Math.random() < 0.5 ? r.color : '#FFB020',
          shape: 'dot',
        });
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3.2 * this.scale, 0, TAU);
      ctx.fill();

      if (r.t >= 1) {
        this.explode(r.x, r.y, r.kind, r.color);
        this.rockets.splice(i, 1);
      }
    }

    let alive = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.life -= k;
      if (p.life <= 0) continue;

      const drag = Math.pow(p.drag, k);
      p.vx *= drag;
      p.vy = p.vy * drag + p.g * k;
      if (p.sway !== undefined) {
        p.sway += 0.08 * k;
        p.x += Math.sin(p.sway) * 0.6 * k;
      }
      p.x += p.vx * k;
      p.y += p.vy * k;
      p.rot += p.vrot * k;
      this.particles[alive++] = p;

      const fade = Math.max(0, Math.min(1, (p.life / p.max) * 1.6));
      if (p.twinkle && Math.random() < 0.25) continue;
      ctx.fillStyle = p.color;

      if (p.shape === 'ring') {
        ctx.globalAlpha = fade * 0.6;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2 * this.scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (1 - p.life / p.max) * p.grow, 0, TAU);
        ctx.stroke();
        continue;
      }

      ctx.globalAlpha = fade;
      if (p.shape === 'dot') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.55 + 0.45 * fade), 0, TAU);
        ctx.fill();
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.shape === 'heart') drawHeart(ctx, p.size);
      else if (p.shape === 'star') drawStar(ctx, p.size);
      else {
        p.flip += p.vflip * k;
        ctx.scale(1, Math.cos(p.flip));
        if (p.shape === 'strip') ctx.fillRect(-p.size * 0.15, -p.size * 1.1, p.size * 0.3, p.size * 2.2);
        else ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
      }
      ctx.restore();
    }
    this.particles.length = alive;
    ctx.globalAlpha = 1;

    if (this.particles.length === 0 && this.rockets.length === 0) {
      ctx.clearRect(0, 0, this.w, this.h);
      this.raf = null;
      return;
    }
    this.raf = requestAnimationFrame((t) => this.tick(t));
  },
};

let timers = [];
const later = (ms, fn) => timers.push(setTimeout(fn, ms));

export function clearCelebrationTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

export function triggerOpeningCelebration() {
  clearCelebrationTimers();
  const fw = PastelFireworks;

  fw.confettiCannon('left');
  fw.confettiCannon('right');
  fw.rocket(0.5, 0.3, 'heart');
  later(450, () => fw.rocket(0.24, 0.32, 'peony'));
  later(700, () => fw.rocket(0.76, 0.32, 'ring'));
  later(1300, () => {
    fw.confettiCannon('left');
    fw.confettiCannon('right');
    fw.rocket(0.5, 0.2, 'willow');
  });
  later(1900, () => fw.rocket(0.3, 0.26, 'star'));
  later(2100, () => fw.rocket(0.7, 0.26, 'spiral'));
  later(2900, () => {
    [0.2, 0.4, 0.6, 0.8].forEach((x, i) => later(i * 160, () => fw.rocket(x, rand(0.18, 0.34), pick(BURST_KINDS))));
  });
  later(3900, () => fw.rocket(0.5, 0.28, 'heart'));
}

export function launchExtraCelebration() {
  const fw = PastelFireworks;
  fw.confettiCannon(Math.random() < 0.5 ? 'left' : 'right');
  fw.rocket(rand(0.25, 0.75), rand(0.2, 0.34), pick(BURST_KINDS));
  later(320, () => fw.rocket(rand(0.25, 0.75), rand(0.2, 0.34), pick(BURST_KINDS)));
  later(640, () => fw.rocket(rand(0.25, 0.75), rand(0.2, 0.34), 'heart'));
}
