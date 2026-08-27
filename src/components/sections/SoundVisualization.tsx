'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { getKarplusStrongEngine, STRING_NAMES, STRING_FREQUENCIES } from '@/lib/karplusStrong';

export default function SoundVisualization() {
  const [plucked, setPlucked] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(getKarplusStrongEngine());
  const engineInitRef = useRef(false);

  // Use refs for audio data so canvas effect doesn't re-run every frame
  const waveformDataRef = useRef<Float32Array | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);

  // Initialize audio engine on first user interaction
  const initAudio = useCallback(async () => {
    if (!engineInitRef.current) {
      engineInitRef.current = true;
      await engineRef.current.init();
    }
  }, []);

  // Main canvas animation — runs ONCE, reads data from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string };
    type Wave = { x: number; y: number; radius: number; alpha: number; speed: number; color: string };
    type VibrationRing = { x: number; y: number; scale: number; alpha: number; color: string; lineWidth: number };

    const particles: Particle[] = [];
    const waves: Wave[] = [];
    const vibrationRings: VibrationRing[] = [];
    const dpr = Math.min(window.devicePixelRatio, 2);

    // Track plucked string locally so we don't depend on state
    let currentPlucked: number | null = null;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const trigger = (idx: number) => {
      const rect = container.getBoundingClientRect();
      const x = (rect.width * (idx + 0.5)) / 6;
      const y = rect.height * 0.5;
      const hue = 20 + idx * 6;
      const color = `hsl(${hue}, 100%, 60%)`;

      // Expanding waves
      waves.push({ x, y, radius: 0, alpha: 1, speed: 2.5, color });

      // Vibration rings
      for (let r = 0; r < 3; r++) {
        vibrationRings.push({
          x, y, scale: 1,
          alpha: 0.8 - r * 0.2,
          color: `hsl(${hue}, 100%, ${70 - r * 10}%)`,
          lineWidth: 2 - r * 0.5,
        });
      }

      // Particles bursting from the string
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.3;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 50 + Math.random() * 50,
          color,
        });
      }
    };

    // Listen for pluck events via a custom event
    const onPluck = (e: Event) => {
      const idx = (e as CustomEvent).detail;
      currentPlucked = idx;
      trigger(idx);
    };
    container.addEventListener('axiom-pluck', onPluck);

    const draw = () => {
      t += 0.016;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Read latest audio data from refs
      const frequencyData = frequencyDataRef.current;
      const waveformData = waveformDataRef.current;

      // Draw frequency bars at the bottom
      if (frequencyData) {
        const barCount = 64;
        const barWidth = w / barCount;
        const maxHeight = h * 0.15;
        for (let i = 0; i < barCount; i++) {
          const val = frequencyData[i * 2] / 255;
          const barH = val * maxHeight;
          const hue = 20 + (i / barCount) * 30;
          ctx.fillStyle = `hsla(${hue}, 90%, 55%, ${0.3 + val * 0.4})`;
          ctx.fillRect(i * barWidth, h - barH, barWidth - 1, barH);
        }
      }

      // Draw waveform overlay
      if (waveformData) {
        ctx.beginPath();
        const sliceWidth = w / waveformData.length;
        let wx = 0;
        for (let i = 0; i < waveformData.length; i++) {
          const v = waveformData[i];
          const wy = h * 0.5 + (v - 0.5) * h * 0.3;
          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
          wx += sliceWidth;
        }
        ctx.strokeStyle = 'rgba(255, 138, 28, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw strings with vibration
      for (let i = 0; i < 6; i++) {
        const x = (w * (i + 0.5)) / 6;
        const isActive = currentPlucked === i;

        ctx.beginPath();
        if (isActive) {
          for (let y = h * 0.15; y <= h * 0.85; y += 2) {
            const progress = (y - h * 0.15) / (h * 0.7);
            const amplitude = Math.sin(progress * Math.PI) * (8 + Math.sin(t * 12) * 4);
            const vibX = x + Math.sin(progress * Math.PI * 3 + t * 8) * amplitude;
            if (y === h * 0.15) ctx.moveTo(vibX, y);
            else ctx.lineTo(vibX, y);
          }
          const hue = 20 + i * 6;
          ctx.strokeStyle = `hsla(${hue}, 100%, 70%, 0.9)`;
          ctx.lineWidth = 2;
          ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
          ctx.shadowBlur = 12;
        } else {
          ctx.moveTo(x, h * 0.15);
          ctx.lineTo(x, h * 0.85);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // String label
        ctx.fillStyle = isActive ? 'rgba(255, 138, 28, 0.9)' : 'rgba(255, 255, 255, 0.2)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(STRING_NAMES[i], x, h * 0.1);
      }

      // Waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const wv = waves[i];
        wv.radius += wv.speed;
        wv.alpha *= 0.982;
        if (wv.alpha < 0.01) { waves.splice(i, 1); continue; }
        for (let r = 0; r < 5; r++) {
          const radius = wv.radius - r * 16;
          if (radius <= 0) continue;
          const hue = parseInt(wv.color.match(/\d+/)?.[0] || '20');
          ctx.beginPath();
          ctx.arc(wv.x, wv.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${wv.alpha * (1 - r * 0.2)})`;
          ctx.lineWidth = 1.5 - r * 0.25;
          ctx.stroke();
        }
      }

      // Vibration rings
      for (let i = vibrationRings.length - 1; i >= 0; i--) {
        const ring = vibrationRings[i];
        ring.scale += 0.03;
        ring.alpha *= 0.96;
        if (ring.alpha < 0.01) { vibrationRings.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.ellipse(ring.x, ring.y, 40 * ring.scale, 25 * ring.scale, 0, 0, Math.PI * 2);
        // Extract hue from hsl string
        const hueMatch = ring.color.match(/hsl\((\d+)/);
        const hue = hueMatch ? parseInt(hueMatch[1]) : 20;
        ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${ring.alpha})`;
        ctx.lineWidth = ring.lineWidth;
        ctx.stroke();
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy += 0.02;
        p.life++;
        const alpha = 1 - p.life / p.max;
        if (p.life >= p.max) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * alpha, 0, Math.PI * 2);
        const hueMatch = p.color.match(/hsl\((\d+)/);
        const hue = hueMatch ? parseInt(hueMatch[1]) : 20;
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('axiom-pluck', onPluck);
    };
  }, []); // Empty deps — runs once

  // Poll audio data for visualization — writes to refs only
  useEffect(() => {
    let raf: number;
    const poll = () => {
      const engine = engineRef.current;
      const wf = engine.getWaveformData();
      const ff = engine.getFrequencyData();
      if (wf) {
        const float = new Float32Array(wf.length);
        for (let i = 0; i < wf.length; i++) float[i] = wf[i] / 255;
        waveformDataRef.current = float;
      }
      if (ff) frequencyDataRef.current = ff;
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handlePluck = async (idx: number) => {
    await initAudio();
    engineRef.current.pluckString(idx);
    setPlucked(idx);
    // Dispatch custom event so canvas can react
    containerRef.current?.dispatchEvent(new CustomEvent('axiom-pluck', { detail: idx }));
    setTimeout(() => setPlucked((p) => (p === idx ? null : idx)), 800);
  };

  const handleStrum = async (direction: 'up' | 'down') => {
    await initAudio();
    engineRef.current.strumStrings(direction);
    const indices = direction === 'up' ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
    indices.forEach((i, delay) => {
      setTimeout(() => {
        setPlucked(i);
        containerRef.current?.dispatchEvent(new CustomEvent('axiom-pluck', { detail: i }));
        setTimeout(() => setPlucked((p) => (p === i ? null : i)), 600);
      }, delay * 40);
    });
  };

  return (
    <section
      id="sound"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            03 / Sound
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">The</span>{' '}
              <span className="italic text-zinc-100">frequency</span>
              <br />
              <span className="gradient-text">of intent.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              Tap a string to hear Karplus-Strong physical synthesis in real time.
              Each vibration is a deterministic event — shaped by pickup position,
              damping coefficients, and a simulated walnut/carbon acoustic chamber.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive sound canvas */}
      <div
        ref={containerRef}
        className="relative mx-auto mt-16 h-[60vh] min-h-[480px] w-full max-w-[1600px] overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-graphite-900 to-ink-900 px-6 md:px-12"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* String interaction layer */}
        <div className="absolute inset-0 z-10 flex">
          {STRING_NAMES.map((name, i) => (
            <button
              key={name}
              onClick={() => handlePluck(i)}
              data-cursor="hover"
              className="group relative flex-1"
            >
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-glow/0 transition-all duration-500 group-hover:border-amber-glow/30 group-hover:scale-150" />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <div
                  className={`font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${
                    plucked === i ? 'text-amber-glow' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {name}
                </div>
                <div
                  className={`mt-1 font-display text-2xl transition-all ${
                    plucked === i ? 'text-amber-glow scale-110' : 'text-zinc-300'
                  }`}
                >
                  {STRING_FREQUENCIES[i].toFixed(0)}
                  <span className="text-xs text-zinc-600">Hz</span>
                </div>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                  S-0{i + 1}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Top scale */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          <span>WAVEFORM.SCOPE</span>
          <span>KARPLUS-STRONG</span>
          <span className="text-amber-glow">FFT 2048</span>
        </div>

        {/* Strum controls */}
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          <button
            onClick={() => handleStrum('down')}
            data-cursor="hover"
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 transition-all hover:border-amber-glow/50 hover:text-amber-glow"
          >
            ↓ Strum
          </button>
          <button
            onClick={() => handleStrum('up')}
            data-cursor="hover"
            className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 transition-all hover:border-amber-glow/50 hover:text-amber-glow"
          >
            ↑ Strum
          </button>
        </div>
      </div>

      {/* Frequency bars */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { label: 'Fundamental', value: '82–1318 Hz', desc: 'Crystal clear at any voicing' },
            { label: 'Harmonic range', value: '12 kHz', desc: 'Smooth, never brittle' },
            { label: 'Sustain', value: '8.2s', desc: 'Single-note decay' },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                {s.label}
              </div>
              <div className="mt-2 font-display text-4xl text-zinc-100">{s.value}</div>
              <div className="mt-2 text-sm text-zinc-500">{s.desc}</div>
              <div className="mt-4 flex h-1 w-full overflow-hidden rounded-full bg-zinc-900">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: ['40%', '90%', '60%', '85%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-amber-deep via-amber-glow to-amber-neon"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
