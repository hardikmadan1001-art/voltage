'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const materials = [
  {
    id: 'wood',
    code: 'M-01',
    name: 'Figured Maple',
    subtitle: 'Resonance Series',
    description:
      'Hand-selected, kiln-dried for 18 months, then compression-figured under 4 atmospheres. Each top is a singular acoustic fingerprint.',
    origin: 'Sourced — Bavarian Alps',
    accent: '#d4af6a',
  },
  {
    id: 'carbon',
    code: 'M-02',
    name: 'Forged Carbon',
    subtitle: 'Aero Composite',
    description:
      'Aerospace-grade forged carbon composite, 60% lighter than aluminum, with a damping coefficient tuned for harmonic clarity.',
    origin: 'Sourced — California',
    accent: '#2a2a30',
  },
  {
    id: 'aluminum',
    code: 'M-03',
    name: 'Aerospace Aluminum',
    subtitle: '7075-T6 Series',
    description:
      'The same alloy used in airframe construction. Hard-anodized matte finish, CNC machined to ±0.005mm tolerance.',
    origin: 'Sourced — Washington',
    accent: '#a8a8b0',
  },
  {
    id: 'titanium',
    code: 'M-04',
    name: 'Titanium Hardware',
    subtitle: 'Grade-5 Series',
    description:
      'Biocompatible grade-5 titanium, mirror-polished by hand. The hardware you feel becomes invisible; the tone becomes eternal.',
    origin: 'Sourced — Pacific Northwest',
    accent: '#e4e4e7',
  },
];

export default function Materials() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 20 });
  const sy = useSpring(y, { stiffness: 80, damping: 20 });
  const lightX = useTransform(sx, [-300, 300], ['20%', '80%']);
  const lightY = useTransform(sy, [-300, 300], ['20%', '80%']);

  useEffect(() => {
    if (!ref.current) return;
    const onMove = (e: MouseEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      x.set(e.clientX - rect.left - rect.width / 2);
      y.set(e.clientY - rect.top - rect.height / 2);
    };
    const el = ref.current;
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, [x, y]);

  return (
    <section
      id="materials"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            02 / Materials
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">The finest</span>
              <br />
              <span className="italic text-zinc-100">raw matter.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              We start with the matter itself. Sourced, traced, and verified.
              Then transformed under conditions that exceed aerospace tolerances.
              Every gram, every grain, every reflection tells a story of intent.
            </p>
          </div>
        </div>
      </div>

      {/* Material stage */}
      <div
        ref={ref}
        className="relative mx-auto mt-24 h-[70vh] min-h-[600px] w-full max-w-[1600px] overflow-hidden px-6 md:px-12"
      >
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-graphite-900 to-ink-900">
          {/* Material visuals — procedural SVG macro views */}
          <MaterialVisual material={materials[active]} />

          {/* Cursor light */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: `radial-gradient(circle 280px at ${lightX} ${lightY}, rgba(255,138,28,0.25), transparent 60%)`,
            }}
          />

          {/* Index + spec readout */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                  {materials[active].code}
                </div>
                <div className="mt-2 font-display text-5xl font-light text-zinc-100 md:text-7xl">
                  {materials[active].name}
                </div>
                <div className="mt-1 font-display text-lg italic text-zinc-400">
                  {materials[active].subtitle}
                </div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-2">
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-500">
                  Specimen
                </div>
                <div className="font-display text-3xl text-amber-glow">
                  {String(active + 1).padStart(2, '0')}/04
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-300">
                {materials[active].description}
              </p>
              <div className="flex flex-col gap-2 md:items-end">
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-500">
                  {materials[active].origin}
                </div>
                <div className="mt-2 flex gap-2">
                  {materials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1 transition-all ${
                        i === active ? 'w-12 bg-amber-glow' : 'w-6 bg-zinc-700'
                      }`}
                      data-cursor="hover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Material grid */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {materials.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              data-cursor="hover"
              className={`group relative aspect-square overflow-hidden rounded-2xl border transition-all duration-700 ${
                i === active
                  ? 'border-amber-glow/50'
                  : 'border-white/5 hover:border-white/20'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-graphite-800 to-ink-900" />
              <MaterialThumb material={m} active={i === active} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-glow">
                  {m.code}
                </div>
                <div className="mt-1 font-display text-base text-zinc-100">
                  {m.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MaterialVisual({ material }: { material: typeof materials[number] }) {
  if (material.id === 'wood')
    return (
      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a1f0a" />
            <stop offset="50%" stopColor="#6a3f1a" />
            <stop offset="100%" stopColor="#2a1208" />
          </linearGradient>
          <radialGradient id="woodHighlight" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d4af6a" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d4af6a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#woodGrad)" />
        {[...Array(40)].map((_, i) => (
          <path
            key={i}
            d={`M -50 ${i * 18} Q 200 ${i * 18 + Math.sin(i) * 30}, 400 ${i * 18} T 850 ${i * 18}`}
            stroke="#1a0a05"
            strokeWidth={0.5 + (i % 4) * 0.3}
            fill="none"
            opacity={0.4}
          />
        ))}
        <ellipse cx="400" cy="240" rx="350" ry="220" fill="url(#woodHighlight)" />
        {/* Grain knots */}
        <ellipse cx="220" cy="180" rx="40" ry="20" fill="#1a0a05" opacity="0.6" />
        <ellipse cx="580" cy="400" rx="50" ry="25" fill="#1a0a05" opacity="0.5" />
        <ellipse cx="450" cy="120" rx="25" ry="12" fill="#1a0a05" opacity="0.4" />
      </svg>
    );

  if (material.id === 'carbon')
    return (
      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="carbonPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#0a0a0a" />
            <path d="M 0 0 L 20 20 L 40 0 M 0 40 L 20 20 L 40 40" stroke="#2a2a30" strokeWidth="0.8" />
            <path d="M 0 20 L 20 0 M 20 40 L 40 20" stroke="#1a1a20" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="carbonLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5a5a60" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#carbonPattern)" />
        <ellipse cx="400" cy="300" rx="400" ry="300" fill="url(#carbonLight)" />
        {/* Highlight specks */}
        {[...Array(60)].map((_, i) => (
          <circle
            key={i}
            cx={(i * 73) % 800}
            cy={(i * 47) % 600}
            r="1"
            fill="#d4d4d8"
            opacity={0.12 + ((i * 37) % 48) / 100}
          />
        ))}
      </svg>
    );

  if (material.id === 'aluminum')
    return (
      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="aluGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a0a0a8" />
            <stop offset="40%" stopColor="#4a4a52" />
            <stop offset="60%" stopColor="#4a4a52" />
            <stop offset="100%" stopColor="#8a8a92" />
          </linearGradient>
          <radialGradient id="aluHighlight" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#aluGrad)" />
        {/* Brushed lines */}
        {[...Array(120)].map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={i * 5}
            x2="800"
            y2={i * 5 + Math.sin(i) * 2}
            stroke="#ffffff"
            strokeWidth="0.3"
            opacity={0.15 + (i % 3) * 0.1}
          />
        ))}
        <ellipse cx="400" cy="240" rx="380" ry="200" fill="url(#aluHighlight)" />
      </svg>
    );

  if (material.id === 'titanium')
    return (
      <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="tiGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#e4e4e7" />
            <stop offset="50%" stopColor="#a8a8b0" />
            <stop offset="100%" stopColor="#3a3a42" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#tiGrad)" />
        <ellipse cx="400" cy="300" rx="320" ry="240" fill="#ffffff" opacity="0.3" />
        <ellipse cx="320" cy="220" rx="80" ry="40" fill="#ffffff" opacity="0.5" />
        <ellipse cx="500" cy="400" rx="60" ry="30" fill="#ffffff" opacity="0.3" />
      </svg>
    );

  return null;
}

function MaterialThumb({ material, active }: { material: typeof materials[number]; active: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
      {material.id === 'wood' && (
        <>
          <rect width="200" height="200" fill="#3a1f0a" />
          {[...Array(15)].map((_, i) => (
            <path
              key={i}
              d={`M -10 ${i * 15} Q 50 ${i * 15 + Math.sin(i) * 5}, 100 ${i * 15} T 210 ${i * 15}`}
              stroke="#1a0a05"
              strokeWidth="0.5"
              fill="none"
              opacity={0.6}
            />
          ))}
        </>
      )}
      {material.id === 'carbon' && (
        <pattern id="cTh" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#0a0a0a" />
          <path d="M 0 0 L 10 10 L 20 0 M 0 20 L 10 10 L 20 20" stroke="#2a2a30" />
        </pattern>
      )}
      {material.id === 'carbon' && (
        <>
          <rect width="200" height="200" fill="url(#cTh)" />
          <ellipse cx="100" cy="100" rx="80" ry="80" fill="#ffffff" opacity="0.05" />
        </>
      )}
      {material.id === 'aluminum' && (
        <>
          <rect width="200" height="200" fill="#7a7a82" />
          {[...Array(60)].map((_, i) => (
            <line key={i} x1="0" y1={i * 3.5} x2="200" y2={i * 3.5} stroke="#ffffff" strokeWidth="0.3" opacity="0.2" />
          ))}
        </>
      )}
      {material.id === 'titanium' && (
        <>
          <defs>
            <radialGradient id="tiTh" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#4a4a52" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#tiTh)" />
        </>
      )}
    </svg>
  );
}
