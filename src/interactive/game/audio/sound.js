// Procedural audio: every sound effect and the ambient soundtrack are
// synthesised with the Web Audio API — no audio files, nothing to license.
// The context is created lazily on the first user gesture (browser policy).

let ctx = null;
let master = null;
let sfxBus = null;
let musicBus = null;
let reverb = null;
let muted = false;
let musicTimer = null;
let noiseBuf = null;

export function initAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.8;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);

  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.55;
  sfxBus.connect(master);

  musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);

  reverb = ctx.createConvolver();
  reverb.buffer = impulse(3.2, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.38;
  reverb.connect(wet).connect(master);

  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  startMusic();
}

export function setMuted(m) {
  muted = m;
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.08);
}

export function suspendAudio(s) {
  if (!ctx) return;
  if (s) ctx.suspend();
  else ctx.resume();
}

function impulse(seconds, decay) {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

const ok = () => ctx && !muted && ctx.state === 'running';

function env(g, t, a, peak, d, sustain = 0) {
  g.gain.cancelScheduledValues(t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001, sustain), t + a + d);
}

function tone({ type = 'sine', f0, f1, dur = 0.2, vol = 0.3, attack = 0.005, wet = 0, detune = 0, when = 0 }) {
  if (!ok()) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  o.type = type;
  o.detune.value = detune;
  o.frequency.setValueAtTime(f0, t);
  if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  env(g, t, attack, vol, dur);
  o.connect(g).connect(sfxBus);
  if (wet) {
    const w = ctx.createGain();
    w.gain.value = wet;
    g.connect(w).connect(reverb);
  }
  o.start(t);
  o.stop(t + attack + dur + 0.05);
}

function noise({ dur = 0.2, vol = 0.3, type = 'bandpass', f0 = 1200, f1, q = 1, when = 0, wet = 0 }) {
  if (!ok()) return;
  const t = ctx.currentTime + when;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  env(g, t, 0.005, vol, dur);
  src.connect(f).connect(g).connect(sfxBus);
  if (wet) {
    const w = ctx.createGain();
    w.gain.value = wet;
    g.connect(w).connect(reverb);
  }
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
}

const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const hz = semi => 440 * Math.pow(2, (semi - 9) / 12); // semitones from C4

export const sfx = {
  jump: () => {
    tone({ type: 'square', f0: 260, f1: 520, dur: 0.12, vol: 0.06 });
    noise({ dur: 0.08, vol: 0.05, f0: 2400, q: 0.8 });
  },
  doubleJump: () => {
    tone({ type: 'triangle', f0: 420, f1: 980, dur: 0.18, vol: 0.12, wet: 0.3 });
    noise({ dur: 0.25, vol: 0.12, type: 'highpass', f0: 1800, f1: 5000, q: 0.5 });
  },
  land: impact => {
    noise({ dur: 0.08 + impact * 0.15, vol: 0.08 + impact * 0.22, type: 'lowpass', f0: 500 + impact * 400, f1: 120, q: 0.7 });
    if (impact > 0.4) tone({ type: 'sine', f0: 110, f1: 45, dur: 0.22, vol: 0.18 * impact });
  },
  step: alt => noise({ dur: 0.05, vol: 0.025, type: 'bandpass', f0: alt ? 1500 : 1100, q: 2 }),
  dash: () => {
    noise({ dur: 0.3, vol: 0.18, type: 'bandpass', f0: 600, f1: 3500, q: 1.4 });
    tone({ type: 'sawtooth', f0: 180, f1: 90, dur: 0.18, vol: 0.04 });
  },
  pad: () => {
    tone({ type: 'sine', f0: 200, f1: 900, dur: 0.35, vol: 0.2, wet: 0.2 });
    tone({ type: 'square', f0: 400, f1: 1600, dur: 0.25, vol: 0.04 });
  },
  collect: combo => {
    const base = Math.min(combo - 1, 7);
    tone({ type: 'triangle', f0: hz(12 + PENTA[base]), dur: 0.25, vol: 0.13, wet: 0.35 });
    tone({ type: 'sine', f0: hz(19 + PENTA[base]), dur: 0.4, vol: 0.08, wet: 0.5, when: 0.06 });
  },
  discover: () => {
    [0, 4, 7, 12, 16].forEach((s, i) => tone({ type: 'triangle', f0: hz(s + 12), dur: 0.6, vol: 0.1, wet: 0.6, when: i * 0.08 }));
  },
  achievement: () => {
    [7, 12, 16, 19, 24].forEach((s, i) => tone({ type: 'square', f0: hz(s + 12), dur: 0.18, vol: 0.05, when: i * 0.07, wet: 0.3 }));
    tone({ type: 'sine', f0: hz(36), dur: 0.9, vol: 0.06, when: 0.36, wet: 0.7 });
  },
  open: () => {
    tone({ type: 'sine', f0: 520, f1: 880, dur: 0.12, vol: 0.1, wet: 0.2 });
    noise({ dur: 0.15, vol: 0.04, type: 'highpass', f0: 3000 });
  },
  close: () => tone({ type: 'sine', f0: 760, f1: 420, dur: 0.12, vol: 0.08 }),
  click: () => tone({ type: 'square', f0: 1200, dur: 0.03, vol: 0.03 }),
  hover: () => tone({ type: 'sine', f0: 1800, dur: 0.02, vol: 0.015 }),
  respawn: () => {
    tone({ type: 'sawtooth', f0: 600, f1: 80, dur: 0.5, vol: 0.06 });
    tone({ type: 'sine', f0: hz(12), f1: hz(24), dur: 0.4, vol: 0.1, when: 0.45, wet: 0.5 });
  },
  warp: () => {
    noise({ dur: 0.8, vol: 0.12, type: 'bandpass', f0: 200, f1: 4000, q: 3, wet: 0.5 });
    tone({ type: 'sine', f0: 120, f1: 1200, dur: 0.8, vol: 0.1, wet: 0.4 });
  },
  start: () => {
    [0, 7, 12, 16, 19, 24].forEach((s, i) => tone({ type: 'triangle', f0: hz(s), dur: 0.8, vol: 0.1, when: i * 0.06, wet: 0.6 }));
  },
};

// ---------------------------------------------------------------------
// Ambient soundtrack: slow Cmaj7 – Am9 – Fmaj7 – G6 pad with a lazy
// pentatonic pluck melody on top. Scheduled a bar ahead.
// ---------------------------------------------------------------------
const CHORDS = [
  [-12, 4, 7, 11, 16],
  [-15, 4, 7, 12, 14],
  [-19, 5, 9, 12, 16],
  [-17, 4, 7, 9, 14],
];
const BAR = 4.8;

function padChord(semis, t) {
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(500, t);
  f.frequency.linearRampToValueAtTime(1300, t + BAR * 0.5);
  f.frequency.linearRampToValueAtTime(600, t + BAR);
  f.Q.value = 0.6;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.05, t + 1.4);
  g.gain.linearRampToValueAtTime(0.04, t + BAR - 0.6);
  g.gain.linearRampToValueAtTime(0.0001, t + BAR + 1.2);
  f.connect(g);
  g.connect(musicBus);
  const w = ctx.createGain();
  w.gain.value = 0.6;
  g.connect(w).connect(reverb);
  semis.forEach(s => {
    [-7, 7].forEach(det => {
      const o = ctx.createOscillator();
      o.type = s < 0 ? 'triangle' : 'sawtooth';
      o.frequency.value = hz(s);
      o.detune.value = det;
      o.connect(f);
      o.start(t);
      o.stop(t + BAR + 1.3);
    });
  });
}

function pluck(semi, t, vol = 0.05) {
  const o = ctx.createOscillator();
  o.type = 'triangle';
  o.frequency.value = hz(semi);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
  o.connect(g).connect(musicBus);
  const w = ctx.createGain();
  w.gain.value = 0.9;
  g.connect(w).connect(reverb);
  o.start(t);
  o.stop(t + 1.5);
}

function startMusic() {
  let bar = 0;
  let next = ctx.currentTime + 0.3;
  musicBus.gain.setTargetAtTime(0.9, ctx.currentTime, 3);
  const schedule = () => {
    if (!ctx) return;
    while (next < ctx.currentTime + BAR) {
      const ch = CHORDS[bar % CHORDS.length];
      padChord(ch, next);
      // sparse melody: 3–5 notes per bar from the pentatonic scale
      const notes = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < notes; i++) {
        const step = Math.floor(Math.random() * 8) * (BAR / 8);
        pluck(12 + PENTA[Math.floor(Math.random() * 8)], next + step, 0.035 + Math.random() * 0.02);
      }
      next += BAR;
      bar++;
    }
  };
  schedule();
  musicTimer = setInterval(schedule, 1000);
}

export function disposeAudio() {
  clearInterval(musicTimer);
  musicTimer = null;
  if (ctx) ctx.close();
  ctx = null;
}
