/**
 * Karplus-Strong physical string synthesis engine.
 *
 * Architecture:
 * 1. Seed a delay line with filtered noise (impulse excitation).
 * 2. Feed the delay line through a low-pass filter with feedback.
 * 3. Convolve with an impulse response simulating a walnut/carbon chamber.
 * 4. Apply pickup-position filtering for resonance character.
 */

export type StringParams = {
  frequency: number;       // fundamental Hz (e.g. 82.41 for E2)
  damping: number;         // 0–1, decay per sample (0.997 default)
  harmonicContent: number; // 0–1, brightness of impulse seed
  pickupPosition: number;  // 0–1, fractional position along the string
  excitationType: 'pluck' | 'strum' | 'harmonic';
};

// Standard tuning frequencies
export const STRING_FREQUENCIES = [82.41, 110, 146.83, 196, 246.94, 329.63]; // E2 A2 D3 G3 B3 E4
export const STRING_NAMES = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

/**
 * Generate an impulse response for a walnut/carbon acoustic chamber.
 */
function createChamberIR(ctx: BaseAudioContext, duration = 1.6, decay = 3.2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * duration);
  const buffer = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-decay * t);
      // Early reflections at ~20ms, ~38ms, ~55ms
      const e1 = i > sampleRate * 0.020 && i < sampleRate * 0.024 ? 0.25 : 0;
      const e2 = i > sampleRate * 0.038 && i < sampleRate * 0.042 ? 0.18 : 0;
      const e3 = i > sampleRate * 0.055 && i < sampleRate * 0.059 ? 0.12 : 0;
      data[i] = (Math.random() * 2 - 1) * envelope + e1 + e2 + e3;
      if (ch === 1) data[i] *= 0.96 + Math.random() * 0.04; // stereo width
    }
  }
  return buffer;
}

/**
 * Render a Karplus-Strong string into an AudioBuffer (synchronous DSP).
 */
function renderString(
  sampleRate: number,
  params: StringParams,
  duration = 4.0,
): AudioBuffer {
  const totalSamples = Math.ceil(sampleRate * duration);
  const period = Math.round(sampleRate / params.frequency);

  // Seed the delay line with noise
  const delayLine = new Float32Array(period + 1);
  for (let i = 0; i < period; i++) {
    delayLine[i] = (Math.random() * 2 - 1) * 0.8;
  }

  // Run the KS algorithm
  const output = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const idx = i % period;
    const sample = delayLine[idx];
    output[i] = sample;
    const next = (delayLine[(idx + 1) % period] + sample) * 0.5;
    delayLine[idx] = next * params.damping;
  }

  // Apply envelope + pickup resonance + harmonics
  const buffer = new AudioBuffer({ length: totalSamples, sampleRate, numberOfChannels: 1 });
  const data = buffer.getChannelData(0);
  const pickupDelay = Math.round(period * params.pickupPosition);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const attack = Math.min(1, t * 400);
    const sustain = Math.exp(-2.0 * t);
    let sample = output[i] * attack * sustain;

    // Pickup-position resonance (comb filter)
    const pickupSample = i >= pickupDelay ? output[i - pickupDelay] : 0;
    sample = sample * 0.65 + pickupSample * 0.35 * Math.sin(Math.PI * params.pickupPosition);

    // Harmonic overtone for strum mode
    if (params.excitationType === 'strum' || params.excitationType === 'harmonic') {
      const h2Idx = i >= Math.round(period * 0.5) ? (i - Math.round(period * 0.5)) % period : 0;
      sample += output[h2Idx] * 0.15 * Math.exp(-3.5 * t);
    }

    data[i] = Math.max(-1, Math.min(1, sample * 0.7));
  }

  return buffer;
}

export class KarplusStrongEngine {
  private ctx: AudioContext | null = null;
  // Fixed signal path: source → masterGain → analyser → destination
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  // Convolver reverb (set up once)
  private reverbSend: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private reverbReturn: GainNode | null = null;
  // Per-string tracking
  private activeStrings: Map<number, { source: AudioBufferSourceNode; gain: GainNode; finished: boolean }> = new Map();

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    // Master chain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.55;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Reverb send/return (set up once, shared by all strings)
    this.reverbSend = this.ctx.createGain();
    this.reverbSend.gain.value = 0.3;

    this.convolver = this.ctx.createConvolver();
    this.convolver.buffer = createChamberIR(this.ctx, 1.6, 3.2);

    this.reverbReturn = this.ctx.createGain();
    this.reverbReturn.gain.value = 0.35;

    this.reverbSend.connect(this.convolver);
    this.convolver.connect(this.reverbReturn);
    this.reverbReturn.connect(this.masterGain);

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  pluckString(stringIndex: number, params?: Partial<StringParams>): void {
    if (!this.ctx || !this.masterGain || !this.reverbSend) return;

    // Stop any existing note on this string
    const existing = this.activeStrings.get(stringIndex);
    if (existing && !existing.finished) {
      try {
        existing.gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        existing.source.stop(this.ctx.currentTime + 0.1);
      } catch { /* already stopped */ }
      existing.finished = true;
    }

    const frequency = STRING_FREQUENCIES[stringIndex];
    const fullParams: StringParams = {
      frequency,
      damping: 0.997,
      harmonicContent: 0.6,
      pickupPosition: 0.618,
      excitationType: 'pluck',
      ...params,
    };

    // Render the string DSP
    const buffer = renderString(this.ctx.sampleRate, fullParams, 4.0);

    // Per-string gain (envelope)
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = 0.8;
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.8);

    // Source
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Route: source → gainNode → masterGain (dry)
    //        source → gainNode → reverbSend → convolver → reverbReturn → masterGain (wet)
    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    gainNode.connect(this.reverbSend);

    source.start();
    source.onended = () => {
      const str = this.activeStrings.get(stringIndex);
      if (str) str.finished = true;
    };

    this.activeStrings.set(stringIndex, {
      source,
      gain: gainNode,
      finished: false,
    });
  }

  strumStrings(direction: 'up' | 'down' = 'up', velocity = 0.7): void {
    const delay = 40;
    const indices = direction === 'up' ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
    indices.forEach((i, idx) => {
      setTimeout(() => {
        this.pluckString(i, {
          excitationType: 'strum',
          damping: 0.996 + velocity * 0.002,
          harmonicContent: 0.4 + velocity * 0.4,
        });
      }, idx * delay);
    });
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  getWaveformData(): Uint8Array | null {
    if (!this.analyser) return null;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    return data;
  }

  setMasterVolume(vol: number): void {
    if (this.masterGain) this.masterGain.gain.value = vol;
  }

  dispose(): void {
    this.activeStrings.forEach((s) => {
      try { s.source.stop(); } catch {}
      s.source.disconnect();
      s.gain.disconnect();
    });
    this.activeStrings.clear();
    this.reverbSend?.disconnect();
    this.convolver?.disconnect();
    this.reverbReturn?.disconnect();
    this.masterGain?.disconnect();
    this.analyser?.disconnect();
    this.ctx?.close();
    this.ctx = null;
  }
}

// Singleton
let _engine: KarplusStrongEngine | null = null;
export function getKarplusStrongEngine(): KarplusStrongEngine {
  if (!_engine) _engine = new KarplusStrongEngine();
  return _engine;
}
