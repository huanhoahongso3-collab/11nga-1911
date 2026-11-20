export const PastelAudio = {
  onChange: null,
  ctx: null,
  masterGain: null,
  isMuted: false,
  isPlayingMusic: false,
  loopTimer: null,
  noteStep: 0,

  // Giai điệu hộp nhạc chúc mừng 19/11 trong trẻo, vui tươi (tông Đô trưởng / Sol trưởng nhẹ nhàng)
  melody: [
    // Ô nhịp 1: Khởi đầu tươi sáng
    { f: 523.25, d: 0.32, b: 261.63 }, // C5 + bass C4
    { f: 659.25, d: 0.32, b: 0 },      // E5
    { f: 783.99, d: 0.32, b: 392.00 }, // G5 + bass G4
    { f: 1046.50, d: 0.56, b: 0 },     // C6
    // Ô nhịp 2: Ngân nga ấm áp
    { f: 880.00, d: 0.32, b: 349.23 }, // A5 + bass F4
    { f: 783.99, d: 0.32, b: 0 },      // G5
    { f: 659.25, d: 0.62, b: 261.63 }, // E5 + bass C4
    { f: 0,      d: 0.16, b: 0 },      // Nghỉ nhẹ
    // Ô nhịp 3: Nhí nhảnh vui tươi
    { f: 587.33, d: 0.32, b: 392.00 }, // D5 + bass G4
    { f: 659.25, d: 0.32, b: 0 },      // E5
    { f: 783.99, d: 0.32, b: 329.63 }, // G5 + bass E4
    { f: 880.00, d: 0.56, b: 0 },      // A5
    // Ô nhịp 4: Kết câu êm ái
    { f: 783.99, d: 0.32, b: 349.23 }, // G5 + bass F4
    { f: 659.25, d: 0.32, b: 392.00 }, // E5 + bass G4
    { f: 523.25, d: 0.78, b: 261.63 }, // C5 + bass C4
    { f: 0,      d: 0.35, b: 0 }       // Nghỉ trước khi lặp
  ],

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.24;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // Phát một nốt chuông hộp nhạc/piano pastel có độ ngân vang mềm mại
  playMusicBoxNote(freq, duration, isBass = false) {
    if (!this.ctx || this.isMuted || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Sóng sine mượt + họa âm nhẹ tạo chất tiếng hộp nhạc trong trẻo
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.value = isBass ? 0.04 : 0.11;

    const peak = isBass ? 0.16 : 0.28;
    const release = isBass ? duration + 0.65 : duration + 0.85;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + release);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + release + 0.05);
    overtone.stop(now + release + 0.05);
  },

  startMusic() {
    this.initContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.onChange?.();

    const scheduleNext = () => {
      if (!this.isPlayingMusic) return;
      const note = this.melody[this.noteStep];
      if (note.f > 0) {
        this.playMusicBoxNote(note.f, note.d, false);
      }
      if (note.b > 0) {
        this.playMusicBoxNote(note.b, note.d * 1.4, true);
      }
      this.noteStep = (this.noteStep + 1) % this.melody.length;
      this.loopTimer = setTimeout(scheduleNext, note.d * 1000);
    };

    scheduleNext();
  },

  stopMusic() {
    this.isPlayingMusic = false;
    clearTimeout(this.loopTimer);
  },

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.24, this.ctx.currentTime, 0.03);
    }
    if (!muted && !this.isPlayingMusic) {
      this.startMusic();
    }
    this.onChange?.();
  },

  // Tiếng nổ pháo giấy pastel êm nhẹ, vui tai (không chói)
  playSoftPopSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Tiếng "póc" trầm ấm
    const osc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240 + Math.random() * 80, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.14);

    popGain.gain.setValueAtTime(0.001, now);
    popGain.gain.linearRampToValueAtTime(0.18, now + 0.01);
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(popGain);
    popGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.17);

    // Tiếng lấp lánh nhẹ của pháo giấy bung nở
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.4;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.11, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
  }
};
