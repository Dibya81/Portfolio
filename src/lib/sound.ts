/**
 * Site sound: every effect and the gallery's ambient score are synthesised live
 * with the Web Audio API — no audio files to download, no licences, tiny bundle.
 *
 * Browsers only allow audio after a user gesture, so nothing is created until
 * `unlockSound()` runs from a pointerdown/keydown (SoundLayer wires that up).
 * One shared bus chain: voices -> sfx/music -> master -> compressor -> out,
 * with a generated-impulse reverb for the "hall" feel.
 */

type Engine = {
  ac: AudioContext;
  master: GainNode;
  sfx: GainNode;
  music: GainNode;
  bells: GainNode;
  verbIn: GainNode;
  noise: AudioBuffer;
};

let E: Engine | null = null;
let muted = false;
let prefLoaded = false;
const subs = new Set<() => void>();

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

function loadPref() {
  if (prefLoaded || typeof window === "undefined") return;
  prefLoaded = true;
  try {
    muted = localStorage.getItem("sound") === "off";
  } catch {}
}

export function isMuted() {
  loadPref();
  return muted;
}

export function subscribeSound(cb: () => void) {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function setMuted(m: boolean) {
  loadPref();
  muted = m;
  try {
    localStorage.setItem("sound", m ? "off" : "on");
  } catch {}
  if (E) {
    const t = E.ac.currentTime;
    E.master.gain.cancelScheduledValues(t);
    E.master.gain.setTargetAtTime(m ? 0 : 1, t, 0.08);
  }
  subs.forEach((f) => f());
}

function impulse(ac: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function build(): Engine | null {
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  const ac = new AC({ latencyHint: "interactive" });

  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 12;
  comp.ratio.value = 4;
  comp.attack.value = 0.004;
  comp.release.value = 0.25;
  comp.connect(ac.destination);

  const master = ac.createGain();
  master.gain.value = muted ? 0 : 1;
  master.connect(comp);

  const sfx = ac.createGain();
  sfx.gain.value = 0.9;
  sfx.connect(master);

  const music = ac.createGain();
  music.gain.value = 0;
  music.connect(master);

  const verb = ac.createConvolver();
  verb.buffer = impulse(ac, 2.8, 2.4);
  const verbIn = ac.createGain();
  const verbOut = ac.createGain();
  verbOut.gain.value = 0.55;
  verbIn.connect(verb).connect(verbOut).connect(master);

  // Bells in the score get a soft dotted echo on top of the reverb.
  const bells = ac.createGain();
  bells.connect(music);
  const delay = ac.createDelay(2);
  delay.delayTime.value = 0.48;
  const fb = ac.createGain();
  fb.gain.value = 0.38;
  const tone = ac.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2600;
  bells.connect(delay);
  delay.connect(tone).connect(fb).connect(delay);
  tone.connect(music);

  const noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  // Background tabs: stop the clock entirely (saves CPU, keeps music in step).
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) void ac.suspend();
    else void ac.resume();
  });

  return { ac, master, sfx, music, bells, verbIn, noise };
}

/** Call from a user gesture. Creates/resumes the audio context. */
export function unlockSound() {
  if (typeof window === "undefined") return;
  loadPref();
  if (!E) E = build();
  if (!E) return;
  if (E.ac.state !== "running") {
    void E.ac.resume().then(() => {
      if (musicWanted) startMusicNow();
    });
  } else if (musicWanted) startMusicNow();
}

function live(): Engine | null {
  return E && !muted && E.ac.state === "running" ? E : null;
}

// ───────── voices ─────────

type Route = { pan?: number; verb?: number; bus?: AudioNode };

function route(e: Engine, node: AudioNode, { pan = 0, verb = 0, bus }: Route) {
  let out: AudioNode = node;
  if (pan) {
    const p = e.ac.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    node.connect(p);
    out = p;
  }
  out.connect(bus ?? e.sfx);
  if (verb) {
    const s = e.ac.createGain();
    s.gain.value = verb;
    out.connect(s);
    s.connect(e.verbIn);
  }
}

type ToneOpt = Route & {
  f: number;
  f2?: number;
  glide?: number;
  type?: OscillatorType;
  t?: number; // offset from now
  at?: number; // absolute start (music)
  dur: number;
  g: number;
  a?: number;
};

function tone(e: Engine, o: ToneOpt) {
  const t0 = o.at ?? e.ac.currentTime + (o.t ?? 0);
  const osc = e.ac.createOscillator();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.f, t0);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t0 + (o.glide ?? o.dur));
  const g = e.ac.createGain();
  const a = o.a ?? 0.004;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(o.g, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g);
  route(e, g, o);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.05);
}

type NoiseOpt = Route & {
  t?: number;
  dur: number;
  g: number;
  a?: number;
  type?: BiquadFilterType;
  f: number;
  f2?: number;
  q?: number;
  swell?: boolean; // linear rise over `a`, instead of a click attack
};

function noise(e: Engine, o: NoiseOpt) {
  const t0 = e.ac.currentTime + (o.t ?? 0);
  const src = e.ac.createBufferSource();
  src.buffer = e.noise;
  src.loop = true;
  const flt = e.ac.createBiquadFilter();
  flt.type = o.type ?? "bandpass";
  flt.Q.value = o.q ?? 1;
  flt.frequency.setValueAtTime(o.f, t0);
  if (o.f2) flt.frequency.exponentialRampToValueAtTime(o.f2, t0 + o.dur);
  const g = e.ac.createGain();
  const a = o.a ?? 0.003;
  g.gain.setValueAtTime(0.0001, t0);
  if (o.swell) g.gain.linearRampToValueAtTime(o.g, t0 + a);
  else g.gain.exponentialRampToValueAtTime(o.g, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(flt).connect(g);
  route(e, g, o);
  src.start(t0, Math.random() * 1.5);
  src.stop(t0 + o.dur + 0.05);
}

// ───────── effects ─────────

let lastHover = 0;
let lastCreak = 0;

export const sfx = {
  /** Buttons and links: a short glassy tick. */
  tap() {
    const e = live();
    if (!e) return;
    const p = rnd(0.95, 1.05);
    tone(e, { f: 1700 * p, f2: 1000 * p, glide: 0.04, dur: 0.07, g: 0.11 });
    tone(e, { f: 3400 * p, dur: 0.025, g: 0.025 });
    noise(e, { dur: 0.016, g: 0.04, type: "highpass", f: 5200 });
  },
  /** Mouse over something clickable: barely there. */
  hover() {
    const e = live();
    if (!e) return;
    const now = performance.now();
    if (now - lastHover < 60) return;
    lastHover = now;
    tone(e, { f: 2900 * rnd(0.97, 1.03), dur: 0.035, g: 0.018 });
  },
  open() {
    const e = live();
    if (!e) return;
    noise(e, { dur: 0.32, g: 0.06, f: 400, f2: 2800, q: 0.8, a: 0.14, swell: true, verb: 0.2 });
    tone(e, { f: mtof(74), type: "triangle", dur: 0.45, g: 0.06, verb: 0.35 });
    tone(e, { t: 0.07, f: mtof(81), type: "triangle", dur: 0.6, g: 0.06, verb: 0.4 });
  },
  close() {
    const e = live();
    if (!e) return;
    noise(e, { dur: 0.26, g: 0.05, f: 2400, f2: 380, q: 0.8, a: 0.08, swell: true });
    tone(e, { f: mtof(81), type: "triangle", dur: 0.3, g: 0.05, verb: 0.25 });
    tone(e, { t: 0.06, f: mtof(74), type: "triangle", dur: 0.45, g: 0.05, verb: 0.3 });
  },
  swoosh(dir: 1 | -1 = 1) {
    const e = live();
    if (!e) return;
    noise(e, { dur: 0.34, g: 0.08, f: dir > 0 ? 500 : 3200, f2: dir > 0 ? 3200 : 500, q: 1.1, a: 0.16, swell: true, pan: dir * 0.4, verb: 0.15 });
    tone(e, { t: 0.12, f: mtof(dir > 0 ? 86 : 81), dur: 0.5, g: 0.035, verb: 0.4 });
  },
  /** Reached a frame's circle. */
  chime() {
    const e = live();
    if (!e) return;
    tone(e, { f: mtof(88), dur: 1.4, g: 0.045, verb: 0.55 });
    tone(e, { t: 0.09, f: mtof(95), dur: 1.6, g: 0.035, verb: 0.6 });
  },
  /** Entering the 3D gallery. */
  enter() {
    const e = live();
    if (!e) return;
    noise(e, { dur: 1.1, g: 0.1, f: 220, f2: 2600, q: 0.9, a: 0.5, swell: true, verb: 0.5 });
    tone(e, { f: 80, f2: 38, glide: 0.7, dur: 0.9, g: 0.28 });
    [62, 66, 69, 76].forEach((m, i) => tone(e, { t: 0.15 + i * 0.05, f: mtof(m), type: "triangle", a: 0.25, dur: 2.2, g: 0.03, verb: 0.6 }));
  },
  /** One footstep on the gallery floor; foot = -1 left / 1 right. */
  step(foot: number, level = 1) {
    const e = live();
    if (!e) return;
    const p = rnd(0.9, 1.1);
    const v = Math.max(0.15, Math.min(1, level));
    tone(e, { f: 130 * p, f2: 55 * p, glide: 0.06, dur: 0.09, g: 0.2 * v, pan: foot * 0.15, verb: 0.07 });
    noise(e, { dur: 0.075, g: 0.09 * v, type: "lowpass", f: 1200 * p, q: 0.7, pan: foot * 0.15, verb: 0.12 });
    noise(e, { dur: 0.014, g: 0.02 * v, type: "highpass", f: 4800, pan: foot * 0.2 });
  },

  // ── theme rope ──
  ropeSwing() {
    const e = live();
    if (!e) return;
    noise(e, { dur: 0.16, g: 0.02, f: 900, f2: 600, q: 2, a: 0.06, swell: true });
  },
  ropeGrab() {
    const e = live();
    if (!e) return;
    tone(e, { f: 190, f2: 120, dur: 0.08, g: 0.1 });
    noise(e, { dur: 0.03, g: 0.035, f: 1500, q: 3 });
  },
  /** Fibre creak while stretching; tension 0..1. */
  ropeCreak(tension: number) {
    const e = live();
    if (!e) return;
    const now = performance.now();
    if (now - lastCreak < 45) return;
    lastCreak = now;
    noise(e, { dur: 0.05, g: 0.025 + tension * 0.04, f: 520 + tension * 1500, q: 9 });
    tone(e, { f: 200 + tension * 280, type: "triangle", dur: 0.045, g: 0.012 + tension * 0.012 });
  },
  /** Pull-chain switch: click … clack. */
  ropeSnap() {
    const e = live();
    if (!e) return;
    noise(e, { dur: 0.014, g: 0.16, f: 3300, q: 2 });
    tone(e, { f: 1250, f2: 700, dur: 0.05, g: 0.09 });
    noise(e, { t: 0.075, dur: 0.016, g: 0.12, f: 2300, q: 2 });
    tone(e, { t: 0.075, f: 840, f2: 480, dur: 0.06, g: 0.07 });
  },
  ropeLetGo() {
    const e = live();
    if (!e) return;
    tone(e, { f: 150, f2: 90, dur: 0.12, g: 0.06 });
  },
  /** The ink spill: thump, splash, sweeping wash, bubbles and a shimmer chord. */
  ink(toLight: boolean) {
    const e = live();
    if (!e) return;
    tone(e, { f: 92, f2: 36, glide: 0.5, dur: 0.75, g: 0.34 });
    noise(e, { dur: 0.5, g: 0.16, type: "lowpass", f: 2000, f2: 260, q: 0.7 });
    noise(e, { t: 0.02, dur: 1.4, g: 0.1, f: 260, f2: 3400, q: 0.9, a: 0.6, swell: true, verb: 0.45 });
    for (let i = 0; i < 10; i++) {
      const f = rnd(360, 950);
      tone(e, { t: rnd(0.04, 0.95), f, f2: f * rnd(1.8, 2.7), glide: 0.05, dur: 0.1, g: rnd(0.025, 0.055), pan: rnd(-0.75, 0.75), verb: 0.25 });
    }
    const root = toLight ? 74 : 62; // D5 to light, D4 to dark
    [0, 4, 7, 11, 14].forEach((s, i) =>
      tone(e, { t: 0.22 + i * 0.06, f: mtof(root + s), type: "triangle", a: 0.08, dur: 1.7, g: 0.022, pan: (i - 2) * 0.2, verb: 0.65 }),
    );
  },
};

// ───────── gallery score: slow generative ambient in D (lydian colour) ─────────

const CHORDS = [
  [50, 57, 64, 66, 73], // Dmaj9
  [47, 54, 57, 62, 64], // Bm11
  [43, 50, 54, 59, 61], // Gmaj7#11
  [45, 52, 59, 61, 64], // A add9
];
const BELLS = [74, 76, 78, 81, 83, 86, 88, 90, 93];
const CHORD_LEN = 9;

let musicWanted = false;
let musicTimer = 0;
let nextChord = 0;
let nextBell = 0;
let chordIdx = 0;
let air: AudioBufferSourceNode | null = null;

function pad(e: Engine, notes: number[], t0: number) {
  const end = t0 + CHORD_LEN;
  const flt = e.ac.createBiquadFilter();
  flt.type = "lowpass";
  flt.frequency.value = 760;
  flt.Q.value = 0.6;
  const lfo = e.ac.createOscillator();
  lfo.frequency.value = rnd(0.05, 0.09);
  const depth = e.ac.createGain();
  depth.gain.value = 280;
  lfo.connect(depth).connect(flt.frequency);

  const env = e.ac.createGain();
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(0.15, t0 + 3.2);
  env.gain.setValueAtTime(0.15, end);
  env.gain.linearRampToValueAtTime(0, end + 4);
  flt.connect(env);
  route(e, env, { bus: e.music, verb: 0.55 });

  const stopAt = end + 4.2;
  for (const m of notes) {
    for (const det of [-7, 7]) {
      const o = e.ac.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = mtof(m);
      o.detune.value = det;
      const g = e.ac.createGain();
      g.gain.value = 0.034;
      o.connect(g).connect(flt);
      o.start(t0);
      o.stop(stopAt);
    }
  }
  tone(e, { at: t0, f: mtof(notes[0] - 12), dur: CHORD_LEN + 3.5, a: 2.5, g: 0.09, bus: e.music });
  lfo.start(t0);
  lfo.stop(stopAt);
}

function bell(e: Engine, t: number) {
  const m = BELLS[Math.floor(Math.random() * BELLS.length)];
  const pan = rnd(-0.6, 0.6);
  tone(e, { at: t, f: mtof(m), dur: 3.2, a: 0.008, g: 0.045, pan, verb: 0.7, bus: e.bells });
  tone(e, { at: t, f: mtof(m + 12), dur: 1.2, a: 0.004, g: 0.008, pan, bus: e.bells });
}

function tick() {
  const e = E;
  if (!e) return;
  const now = e.ac.currentTime;
  while (nextChord < now + 1.5) {
    if (!muted) pad(e, CHORDS[chordIdx % CHORDS.length], nextChord);
    chordIdx++;
    nextChord += CHORD_LEN;
  }
  while (nextBell < now + 1.5) {
    if (!muted) bell(e, nextBell);
    nextBell += Math.random() < 0.25 ? 0.24 : rnd(1.4, 3.6); // occasional pairs
  }
}

function startMusicNow() {
  const e = E;
  if (!e || e.ac.state !== "running" || musicTimer) return;
  const t = e.ac.currentTime;
  e.music.gain.cancelScheduledValues(t);
  e.music.gain.setValueAtTime(e.music.gain.value, t);
  e.music.gain.linearRampToValueAtTime(0.55, t + 4);
  nextChord = t + 0.05;
  nextBell = t + 2.2;
  chordIdx = 0;

  // Room tone: the faint air of a big hall.
  const src = e.ac.createBufferSource();
  src.buffer = e.noise;
  src.loop = true;
  const flt = e.ac.createBiquadFilter();
  flt.type = "lowpass";
  flt.frequency.value = 380;
  const g = e.ac.createGain();
  g.gain.value = 0.05;
  src.connect(flt).connect(g).connect(e.music);
  src.start();
  air = src;

  tick();
  musicTimer = window.setInterval(tick, 300);
}

/** Start the gallery score (plays as soon as audio is unlocked). */
export function startMusic() {
  musicWanted = true;
  if (E && E.ac.state === "running") startMusicNow();
}

export function stopMusic() {
  musicWanted = false;
  if (musicTimer) window.clearInterval(musicTimer);
  musicTimer = 0;
  const e = E;
  if (!e) return;
  const t = e.ac.currentTime;
  e.music.gain.cancelScheduledValues(t);
  e.music.gain.setValueAtTime(e.music.gain.value, t);
  e.music.gain.linearRampToValueAtTime(0, t + 1.2);
  air?.stop(t + 1.3);
  air = null;
}
