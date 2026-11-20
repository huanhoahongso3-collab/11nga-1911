const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const BPM = 84;
const BEAT = 60 / BPM;
const BARS = 8;
const MASTER_LEVEL = 0.8;

const CHORDS = {
  C: [48, 52, 55],
  Am: [45, 48, 52],
  F: [41, 45, 48],
  G: [43, 47, 50],
};
const PROGRESSION = ['C', 'Am', 'F', 'G', 'C', 'F', 'G', 'C'];
const C_MAJOR = [0, 2, 4, 5, 7, 9, 11];
const ARP_PATTERN = [0, 1, 2, 1, 0, 1, 2, 1];
const RHYTHMS = [
  [1, 1, 2],
  [0.5, 0.5, 1, 2],
  [2, 1, 1],
  [1.5, 0.5, 2],
  [1, 1, 1, 1],
  [0.5, 0.5, 0.5, 0.5, 2],
  [1, 0.5, 0.5, 2],
];

// Bell-like partials: slightly inharmonic, higher partials fade faster.
const PARTIALS = [
  { ratio: 1, gain: 1, decay: 1 },
  { ratio: 2, gain: 0.28, decay: 0.6 },
  { ratio: 3.01, gain: 0.1, decay: 0.35 },
  { ratio: 5.4, gain: 0.04, decay: 0.2 },
];

function melodyForBar(chordName, previous, isLast) {
  const chordClasses = CHORDS[chordName].map((m) => m % 12);
  const notes = [];

  if (isLast) {
    notes.push({ beat: 0, midi: pick([76, 79]), dur: 2 }, { beat: 2, midi: 72, dur: 2 });
    return notes;
  }

  const range = [];
  for (let m = 67; m <= 84; m++) if (C_MAJOR.includes(m % 12)) range.push(m);

  let beat = 0;
  let current = previous;
  pick(RHYTHMS).forEach((dur, i) => {
    const skip = i === 0 && Math.random() < 0.15;
    if (!skip) {
      const strong = beat % 2 === 0;
      const weights = range.map((m) => {
        const chordTone = chordClasses.includes(m % 12);
        let w = Math.exp(-Math.abs(m - current) / 3);
        w *= chordTone ? (strong ? 4 : 1.5) : strong ? 0.4 : 1;
        if (m === current) w *= 0.4;
        return w;
      });
      let r = Math.random() * weights.reduce((a, b) => a + b, 0);
      let chosen = range[range.length - 1];
      for (let k = 0; k < range.length; k++) {
        r -= weights[k];
        if (r <= 0) {
          chosen = range[k];
          break;
        }
      }
      current = chosen;
      notes.push({ beat, midi: chosen, dur });
    }
    beat += dur;
  });
  return notes;
}

// One 8-bar loop. The melody is generated fresh each time so it never repeats exactly.
function buildLoop(startNote = 76) {
  const events = [];
  let previous = startNote;

  for (let bar = 0; bar < BARS; bar++) {
    const name = PROGRESSION[bar];
    const chord = CHORDS[name];
    const origin = bar * 4;

    events.push({ at: origin, kind: 'pad', midis: chord.map((m) => m + 12), dur: 4 * BEAT, vel: 0.1, jitter: 0 });
    events.push({ at: origin, kind: 'bass', midi: chord[0] - 12, vel: 0.5, jitter: 0 });
    ARP_PATTERN.forEach((index, i) => {
      events.push({
        at: origin + i * 0.5,
        kind: 'arp',
        midi: chord[index],
        vel: i === 0 ? 0.3 : 0.2,
        jitter: rand(-0.004, 0.004),
      });
    });

    melodyForBar(name, previous, bar === BARS - 1).forEach((n) => {
      previous = n.midi;
      events.push({
        at: origin + n.beat,
        kind: 'melody',
        midi: n.midi,
        ring: 1.2 + n.dur * 0.5,
        vel: 0.42,
        jitter: rand(-0.012, 0.014),
      });
    });
  }

  return events.sort((a, b) => a.at - b.at);
}

function makeImpulse(ctx, seconds, decay) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

export const PastelAudio = {
  ctx: null,
  master: null,
  bus: null,
  noise: null,
  isMuted: false,
  isPlayingMusic: false,
  onChange: null,
  timer: null,
  loop: [],
  loopIndex: 0,
  loopStart: 0,

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      this.ctx = ctx;

      this.master = ctx.createGain();
      this.master.gain.value = this.isMuted ? 0 : MASTER_LEVEL;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.01;
      compressor.release.value = 0.25;
      this.master.connect(compressor);
      compressor.connect(ctx.destination);

      this.bus = ctx.createGain();
      const tone = ctx.createBiquadFilter();
      tone.type = 'lowpass';
      tone.frequency.value = 5200;
      tone.Q.value = 0.3;
      this.bus.connect(tone);

      const dry = ctx.createGain();
      dry.gain.value = 0.8;
      tone.connect(dry);
      dry.connect(this.master);

      const reverb = ctx.createConvolver();
      reverb.buffer = makeImpulse(ctx, 2.6, 2.4);
      const wet = ctx.createGain();
      wet.gain.value = 0.45;
      tone.connect(reverb);
      reverb.connect(wet);
      wet.connect(this.master);

      const noiseLength = Math.floor(ctx.sampleRate * 0.4);
      this.noise = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < noiseLength; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },

  bell(t, midi, ring, vel, pan = 0) {
    const ctx = this.ctx;
    const freq = midiToFreq(midi);
    let out = this.bus;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      panner.connect(this.bus);
      out = panner;
    }

    PARTIALS.forEach((p) => {
      const length = ring * p.decay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq * p.ratio;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vel * p.gain * 0.5, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + length + 0.05);
    });
  },

  pad(t, midis, dur, vel) {
    const ctx = this.ctx;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.connect(this.bus);

    midis.forEach((midi) => {
      [
        ['sine', 1],
        ['triangle', 1.003],
      ].forEach(([type, detune]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = midiToFreq(midi) * detune;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(vel * 0.25, t + 0.9);
        gain.gain.setValueAtTime(vel * 0.25, t + dur - 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.2);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(t);
        osc.stop(t + dur + 1.3);
      });
    });
  },

  bass(t, midi, vel) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = midiToFreq(midi);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vel * 0.3, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    osc.connect(gain);
    gain.connect(this.bus);
    osc.start(t);
    osc.stop(t + 1.7);
  },

  play(event, t) {
    const vel = event.vel * rand(0.88, 1.1);
    if (event.kind === 'melody') this.bell(t, event.midi, event.ring, vel, rand(-0.25, 0.25));
    else if (event.kind === 'arp') this.bell(t, event.midi, 0.9, vel, rand(-0.5, 0.5));
    else if (event.kind === 'pad') this.pad(t, event.midis, event.dur, vel);
    else if (event.kind === 'bass') this.bass(t, event.midi, vel);
  },

  tick() {
    const ctx = this.ctx;
    const horizon = ctx.currentTime + 1.2;
    for (;;) {
      if (this.loopIndex >= this.loop.length) {
        this.loop = buildLoop();
        this.loopIndex = 0;
        this.loopStart += BARS * 4 * BEAT;
      }
      const event = this.loop[this.loopIndex];
      const t = this.loopStart + event.at * BEAT + event.jitter;
      if (t > horizon) break;
      this.loopIndex++;
      if (!this.isMuted && t > ctx.currentTime - 0.05) this.play(event, Math.max(t, ctx.currentTime));
    }
  },

  startMusic() {
    this.initContext();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.loop = buildLoop();
    this.loopIndex = 0;
    this.loopStart = this.ctx.currentTime + 0.25;
    this.timer = setInterval(() => this.tick(), 150);
    this.tick();
    this.onChange?.();
  },

  stopMusic() {
    this.isPlayingMusic = false;
    clearInterval(this.timer);
    this.timer = null;
  },

  setMuted(muted) {
    this.isMuted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, this.ctx.currentTime, 0.05);
    }
    if (!muted && !this.isPlayingMusic) this.startMusic();
    this.onChange?.();
  },

  // Soft firework pop: low thump, filtered crackle and a few high chimes that ring into the reverb.
  playSoftPopSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(rand(180, 260), t);
    thump.frequency.exponentialRampToValueAtTime(55, t + 0.18);
    thumpGain.gain.setValueAtTime(0.0001, t);
    thumpGain.gain.linearRampToValueAtTime(0.22, t + 0.008);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    thump.connect(thumpGain);
    thumpGain.connect(this.bus);
    thump.start(t);
    thump.stop(t + 0.22);

    const crackle = ctx.createBufferSource();
    crackle.buffer = this.noise;
    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = rand(2400, 4200);
    band.Q.value = 1.2;
    const crackleGain = ctx.createGain();
    crackleGain.gain.setValueAtTime(0.1, t);
    crackleGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    crackle.connect(band);
    band.connect(crackleGain);
    crackleGain.connect(this.bus);
    crackle.start(t);

    const chimes = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < chimes; i++) {
      this.bell(t + 0.06 + i * rand(0.07, 0.16), pick([88, 91, 93, 96, 100]), 0.6, 0.12, rand(-0.7, 0.7));
    }
  },
};
