/**
 * Web Audio API synthesizer for Perry the Platypus signature beak chatter.
 * Synthesizes the authentic rhythmic clicking rattle sound using resonant noise bursts
 * and bandpass-filtered impulses, synced with the animation loop.
 */

class ChatterAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private loopInterval: number | null = null;

  constructor() {
    // Lazy initialize upon user gesture
  }

  private initContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  /**
   * Generates a single crisp "tok/clack" click simulating a beak snap.
   */
  public playClick(pitchOffset: number = 0) {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Component 1: Resonant body impulse (simulating duck bill keratin hollow snap)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    // Random micro-variation in pitch gives organic lifelike chatter
    const baseFreq = 860 + pitchOffset + (Math.random() * 80 - 40);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.022);

    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.028);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.03);

    // Component 2: High-frequency snap transient (short noise click)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.015);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400 + Math.random() * 300, t);
    filter.Q.setValueAtTime(6, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.018);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(t);
  }

  /**
   * Starts a continuous clicking loop synchronized at specific frequency (Hz)
   */
  public startChatterLoop(frequencyHz: number = 8.5) {
    this.stopChatterLoop();
    if (this.isMuted) return;
    this.initContext();

    const intervalMs = Math.round(1000 / frequencyHz);
    this.playClick();
    this.loopInterval = window.setInterval(() => {
      this.playClick();
    }, intervalMs);
  }

  public stopChatterLoop() {
    if (this.loopInterval !== null) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  }

  /**
   * Agent P Fedora Sting: Iconic mini mystery/agent brass-jazz brass cue
   */
  public playAgentThemeCue() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 220, dur: 0.12, del: 0 },      // A3
      { f: 261.63, dur: 0.12, del: 0.14 },// C4
      { f: 329.63, dur: 0.14, del: 0.28 },// E4
      { f: 440, dur: 0.35, del: 0.44 }    // A4 (dramatic agent resolve)
    ];

    notes.forEach(({ f, dur, del }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t + del);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t + del);
      filter.frequency.exponentialRampToValueAtTime(400, t + del + dur);

      gain.gain.setValueAtTime(0.001, t + del);
      gain.gain.linearRampToValueAtTime(0.35, t + del + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + del + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + del);
      osc.stop(t + del + dur + 0.05);
    });
  }

  /**
   * Tail thump: playful beaver tail paddle slap sound
   */
  public playTailThump() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.08);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  /**
   * Hat tip sound: subtle fabric rustle + crisp click
   */
  public playHatTipSound() {
    if (this.isMuted) return;
    this.playClick(60);
  }

  /**
   * Secret agent watch check beep
   */
  public playWatchBeep() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    [1760, 2349.32].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.12);

      gain.gain.setValueAtTime(0.18, t + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.12);
      osc.stop(t + idx * 0.12 + 0.08);
    });
  }

  /**
   * Subtle steam whoosh / mist release sound for stealth and gadget actions
   */
  public playSteamWhoosh() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.42);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.12, t + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.41);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(t);
  }

  /**
   * Water drinking gulp sound
   */
  public playWaterGulp() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    [320, 260].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.28);
      osc.frequency.exponentialRampToValueAtTime(160, t + idx * 0.28 + 0.12);

      gain.gain.setValueAtTime(0.001, t + idx * 0.28);
      gain.gain.linearRampToValueAtTime(0.3, t + idx * 0.28 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.28 + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.28);
      osc.stop(t + idx * 0.28 + 0.15);
    });
  }

  /**
   * Meditate singing bowl / zen resonance
   */
  public playMeditateChime() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const partials = [440, 659.25, 880];
    partials.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const amp = 0.25 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 5.0);
    });
  }

  /**
   * Pencil sharpening sound: rhythmic friction rasp clicks
   */
  public playPencilSharpen() {
    if (this.isMuted) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        this.playClick(120 + i * 25);
      }, i * 220);
    }
  }

  /**
   * Break completion chime: soft resonant bell sound
   */
  public playBreakBell() {
    if (this.isMuted) return;
    if (!this.initContext() || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const partials = [523.25, 1046.5, 1567.98]; // C5, C6, G6
    partials.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      const amp = 0.3 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 2.5);
    });
  }
}

export const chatterAudio = new ChatterAudioEngine();


