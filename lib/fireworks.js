import { PastelAudio } from './audio';

export const PastelFireworks = {
  resizeBound: false,
  canvas: null,
  ctx: null,
  particles: [],
  rockets: [],
  animId: null,
  colors: [
    '#FFB5A7', // Hồng đào
    '#FFD8BE', // Cam mơ
    '#FFF3C4', // Vàng bơ
    '#B7E4C7', // Xanh bạc hà
    '#E0BBE4', // Tím lavender
    '#FFCCD5'  // Hồng phấn
  ],

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
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  // Bắn pháo giấy từ 2 góc dưới màn hình
  launchSideConfetti() {
    if (!this.canvas) return;
    PastelAudio.playSoftPopSound();

    const w = this.canvas.width;
    const h = this.canvas.height;
    const origins = [
      { x: w * 0.08, y: h * 0.88, angleBase: -Math.PI / 3 },
      { x: w * 0.92, y: h * 0.88, angleBase: (-2 * Math.PI) / 3 }
    ];

    origins.forEach(origin => {
      for (let i = 0; i < 34; i++) {
        const angle = origin.angleBase + (Math.random() - 0.5) * 0.65;
        const speed = 10 + Math.random() * 9;
        const shapes = ['rect', 'circle', 'star'];
        this.particles.push({
          x: origin.x,
          y: origin.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.24,
          drag: 0.975,
          size: 6 + Math.random() * 6,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          alpha: 1,
          decay: 0.011 + Math.random() * 0.006
        });
      }
    });

    this.ensureLoop();
  },

  // Bắn pháo bông pastel bay lên bầu trời và bung nở
  launchSkyFirework(targetXRatio = 0.5, targetYRatio = 0.28) {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const startX = w * (0.25 + Math.random() * 0.5);
    const targetX = w * targetXRatio;
    const targetY = h * targetYRatio;

    this.rockets.push({
      x: startX,
      y: h * 0.95,
      targetX,
      targetY,
      vx: (targetX - startX) / 34,
      vy: (targetY - h * 0.95) / 34,
      life: 34,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    });

    this.ensureLoop();
  },

  explodeSkyBurst(x, y, baseColor) {
    PastelAudio.playSoftPopSound();
    const count = 42;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.15;
      const speed = 2.4 + Math.random() * 4.8;
      const color = i % 2 === 0
        ? baseColor
        : this.colors[Math.floor(Math.random() * this.colors.length)];

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.09,
        drag: 0.96,
        size: 5 + Math.random() * 4,
        color,
        shape: i % 3 === 0 ? 'star' : 'circle',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        alpha: 1,
        decay: 0.015 + Math.random() * 0.008
      });
    }
  },

  drawStar(ctx, r) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      if (i === 0) ctx.moveTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
      else ctx.lineTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
      ctx.lineTo(Math.cos(innerAngle) * (r * 0.45), Math.sin(innerAngle) * (r * 0.45));
    }
    ctx.closePath();
    ctx.fill();
  },

  ensureLoop() {
    if (this.animId) return;
    const tick = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Cập nhật pháo bay lên
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const rk = this.rockets[i];
        rk.x += rk.vx;
        rk.y += rk.vy;
        rk.life--;

        this.ctx.save();
        this.ctx.fillStyle = rk.color;
        this.ctx.beginPath();
        this.ctx.arc(rk.x, rk.y, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        if (rk.life <= 0) {
          this.explodeSkyBurst(rk.x, rk.y, rk.color);
          this.rockets.splice(i, 1);
        }
      }

      // Cập nhật hạt pháo giấy & pháo bông
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else if (p.shape === 'star') {
          this.drawStar(this.ctx, p.size * 0.72);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0 || this.rockets.length > 0) {
        this.animId = requestAnimationFrame(tick);
      } else {
        this.animId = null;
      }
    };
    this.animId = requestAnimationFrame(tick);
  }
};

let celebrationTimers = [];
export function clearCelebrationTimers() {
  celebrationTimers.forEach(t => clearTimeout(t));
  celebrationTimers = [];
}

// Chuỗi pháo chào mừng tự động rực rỡ trong vài giây đầu khi mở thiệp
export function triggerOpeningCelebration() {
  clearCelebrationTimers();
  PastelFireworks.launchSideConfetti();
  PastelFireworks.launchSkyFirework(0.28, 0.25);

  celebrationTimers.push(setTimeout(() => {
    PastelFireworks.launchSkyFirework(0.72, 0.22);
  }, 450));

  celebrationTimers.push(setTimeout(() => {
    PastelFireworks.launchSkyFirework(0.50, 0.20);
    PastelFireworks.launchSideConfetti();
  }, 1150));

  celebrationTimers.push(setTimeout(() => {
    PastelFireworks.launchSkyFirework(0.32, 0.28);
  }, 2000));

  celebrationTimers.push(setTimeout(() => {
    PastelFireworks.launchSkyFirework(0.68, 0.26);
  }, 2650));
}

export function launchExtraCelebration() {
  PastelFireworks.launchSideConfetti();
  PastelFireworks.launchSkyFirework(0.25 + Math.random() * 0.5, 0.2 + Math.random() * 0.14);
  setTimeout(() => {
    PastelFireworks.launchSkyFirework(0.25 + Math.random() * 0.5, 0.2 + Math.random() * 0.14);
  }, 320);
}
