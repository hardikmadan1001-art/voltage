'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const notes = [
  { note: 'E2', freq: 82, intensity: 0.4 },
  { note: 'A2', freq: 110, intensity: 0.6 },
  { note: 'D3', freq: 147, intensity: 0.5 },
  { note: 'G3', freq: 196, intensity: 0.8 },
  { note: 'B3', freq: 247, intensity: 0.7 },
  { note: 'E4', freq: 330, intensity: 0.9 },
];

export default function SoundVisualization() {
  const [plucked, setPlucked] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    const particles: Particle[] = [];
    const waves: Wave[] = [];
    const dpr = Math.min(window.devicePixelRatio, 2);

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
      const color = `hsl(${20 + idx * 6}, 100%, 60%)`;
      waves.push({ x, y, radius: 0, alpha: 1, speed: 2, color });
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 * i) / 30;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * (2 + Math.random() * 2),
          vy: Math.sin(angle) * (2 + Math.random() * 2),
          life: 0,
          max: 60 + Math.random() * 40,
          color,
        });
      }
    };

    // Auto-trigger sequence
    let lastAuto = 0;
    const auto = (now: number) => {
      if (now - lastAuto > 1200) {
        lastAuto = now;
        const idx = Math.floor(Math.random() * 6);
        setPlucked(idx);
        trigger(idx);
        setTimeout(() => setPlucked((p) => (p === idx ? null : p)), 600);
      }
    };

    const draw = (now: number) => {
      t += 0.016;
      auto(now);
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // Strings
      const w = rect.width;
      const h = rect.height;
      for (let i = 0; i < 6; i++) {
        const x = (w * (i + 0.5)) / 6;
        const isActive = plucked === i;
        ctx.beginPath();
        ctx.moveTo(x, h * 0.2);
        ctx.lineTo(x, h * 0.8);
        ctx.strokeStyle = isActive ? `hsla(${20 + i * 6}, 100%, 70%, 0.9)` : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = isActive ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Waves
      for (let i = waves.length - 1; i >= 0; i--) {
        const wv = waves[i];
        wv.radius += wv.speed;
        wv.alpha *= 0.985;
        if (wv.alpha < 0.01) {
          waves.splice(i, 1);
          continue;
        }
        for (let r = 0; r < 4; r++) {
          const radius = wv.radius - r * 18;
          if (radius <= 0) continue;
          ctx.beginPath();
          ctx.arc(wv.x, wv.y, radius, 0, Math.PI * 2);
          ctx.strokeStyle = wv.color.replace('hsl', 'hsla').replace(')', `, ${wv.alpha * (1 - r * 0.25)})`);
          ctx.lineWidth = 1.5 - r * 0.3;
          ctx.stroke();
        }
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life++;
        const alpha = 1 - p.life / p.max;
        if (p.life >= p.max) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [plucked]);

  const handlePluck = (idx: number) => {
    setPlucked(idx);
    setTimeout(() => setPlucked((p) => (p === idx ? null : p)), 600);
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
              Tap a string. Each vibration is a deterministic event, captured in
              real-time. AXIOM instruments are voiced against a 432Hz reference
              and stress-tested across 1,200 frequency bands before delivery.
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
          {notes.map((n, i) => (
            <button
              key={n.note}
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
                  {n.note}
                </div>
                <div
                  className={`mt-1 font-display text-2xl transition-all ${
                    plucked === i ? 'text-amber-glow scale-110' : 'text-zinc-300'
                  }`}
                >
                  {n.freq}
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
          <span>FFT 4096</span>
          <span className="text-amber-glow">REC ●</span>
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
