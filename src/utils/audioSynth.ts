/**
 * Web Audio API synthesized sound engine for Roots & Pots Traditional Bistro.
 * Zero external mp3/wav files required, zero 404s, works offline, real-time procedural synthesis.
 */
class HearthAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private isAmbiencePlaying: boolean = false;
  private ambienceGain: GainNode | null = null;
  private fireCrackleInterval: number | null = null;
  private simmerInterval: number | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContext(): AudioContext | null {
    this.init();
    return this.ctx;
  }

  public getAmbienceState(): boolean {
    return this.isAmbiencePlaying && !this.isMuted;
  }

  /**
   * Sound of clay pottery resting on wooden table
   */
  playClayPotThud() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Start authentic ambient hearth sounds: crackling firewood embers + simmering pot bubbles
   */
  startHearthAmbience() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.isAmbiencePlaying) return;

      this.isAmbiencePlaying = true;
      const now = this.ctx.currentTime;

      // Master ambience gain node
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.001, now);
      this.ambienceGain.gain.exponentialRampToValueAtTime(0.25, now + 1.2);
      this.ambienceGain.connect(this.ctx.destination);

      // 1. Warm low hearth hum (rumble of wood fire)
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleFilter = this.ctx.createBiquadFilter();
      const rumbleGain = this.ctx.createGain();

      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(42, now);

      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(85, now);

      rumbleGain.gain.setValueAtTime(0.08, now);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.ambienceGain);
      rumbleOsc.start();

      // 2. Randomized firewood crackle & spark pops
      this.fireCrackleInterval = window.setInterval(() => {
        if (!this.ctx || !this.isAmbiencePlaying || this.isMuted) return;
        this.triggerFireCracklePop();
      }, 220);

      // 3. Gentle simmering stew bubbles
      this.simmerInterval = window.setInterval(() => {
        if (!this.ctx || !this.isAmbiencePlaying || this.isMuted) return;
        this.triggerSimmerBubble();
      }, 450);

    } catch (e) {
      console.warn('Audio autoplay blocked or unsupported:', e);
    }
  }

  /**
   * Stop ambient hearth soundscape
   */
  stopHearthAmbience() {
    this.isAmbiencePlaying = false;
    if (this.fireCrackleInterval) {
      clearInterval(this.fireCrackleInterval);
      this.fireCrackleInterval = null;
    }
    if (this.simmerInterval) {
      clearInterval(this.simmerInterval);
      this.simmerInterval = null;
    }
    if (this.ambienceGain && this.ctx) {
      try {
        this.ambienceGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      } catch {
        // ignore
      }
    }
  }

  public toggleAmbience(): boolean {
    if (this.isAmbiencePlaying) {
      this.stopHearthAmbience();
      return false;
    } else {
      this.isMuted = false;
      this.startHearthAmbience();
      return true;
    }
  }

  /**
   * Micro-pop of a burning acacia ember
   */
  private triggerFireCracklePop() {
    if (!this.ctx || !this.ambienceGain) return;
    try {
      const now = this.ctx.currentTime;
      // Probability burst
      if (Math.random() > 0.65) return;

      const dur = 0.02 + Math.random() * 0.04;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800 + Math.random() * 1500, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12 + Math.random() * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambienceGain);

      noise.start();
    } catch {
      // ignore
    }
  }

  /**
   * Plop/bubble sound of thick boiling stew in clay pot
   */
  private triggerSimmerBubble() {
    if (!this.ctx || !this.ambienceGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startFreq = 220 + Math.random() * 160;
      const endFreq = startFreq + 180 + Math.random() * 120;
      const dur = 0.08 + Math.random() * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + dur * 0.4);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.8, now + dur);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + dur * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.ambienceGain);

      osc.start(now);
      osc.stop(now + dur);
    } catch {
      // ignore
    }
  }

  /**
   * Sound of wooden spoon stirring stew
   */
  playStirSound() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Swish noise filtered through lowpass
      const dur = 0.35;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.linearRampToValueAtTime(750, now + dur * 0.5);
      filter.frequency.linearRampToValueAtTime(400, now + dur);
      filter.Q.setValueAtTime(4, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  /**
   * Sound of fresh herbs sprinkled into pot
   */
  playHerbSprinkle() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 3 delicate rustling bursts
      for (let j = 0; j < 3; j++) {
        const offset = now + j * 0.07;
        const dur = 0.08;
        const bufferSize = Math.floor(this.ctx.sampleRate * dur);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4000 + Math.random() * 1200, offset);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.1, offset);
        gain.gain.exponentialRampToValueAtTime(0.001, offset + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(offset);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Sizzle of hot meat or vegetables entering the pot
   */
  playSizzle() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.28;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3400, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // ignore
    }
  }

  /**
   * Celebratory chord when user orders or confirms
   */
  playAssemblySuccess() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.50];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.6);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Simulated telecom phone ring (400Hz + 450Hz standard ringback pair)
   */
  playPhoneRing() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(400, now);
      osc2.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.setValueAtTime(0.12, now + 0.9);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.1);
      osc2.stop(now + 1.1);
    } catch {
      // ignore
    }
  }

  /**
   * Sound when a rider picks up the call
   */
  playCallAnswered() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [587.33, 880]; // D5, A5
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.15, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Sound when a call is missed or rejected
   */
  playCallMissed() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.setValueAtTime(0, now + 0.25);
      gain.gain.setValueAtTime(0.12, now + 0.35);
      gain.gain.setValueAtTime(0, now + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // ignore
    }
  }

  /**
   * Escalation alert tone when dialing next rider
   */
  playEscalationAlert() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }
}

export const audioSynth = new HearthAudioEngine();
