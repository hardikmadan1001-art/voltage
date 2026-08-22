'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const components = [
  {
    id: 'body',
    label: 'Body',
    code: '01',
    title: 'Aerospace-Grade Body',
    description:
      'Compression-molded carbon composite shell with a hand-selected figured maple top. Resonance tuned across 14 frequencies.',
    specs: ['Carbon Composite', 'Figured Maple', '0.002mm tolerance', '14-band EQ tuned'],
    x: 0,
    y: 0,
  },
  {
    id: 'neck',
    label: 'Neck',
    code: '02',
    title: 'Roasted Maple Neck',
    description:
      'Quarter-sawn, roasted for 96 hours, then hand-shaped. Two-way adjustable truss rod with graphite reinforcement.',
    specs: ['Roasted Maple', 'Ebony Fretboard', 'Stainless Steel Frets', 'Graphite Reinforced'],
    x: 0,
    y: 0,
  },
  {
    id: 'pickups',
    label: 'Pickups',
    code: '03',
    title: 'Hand-Wound Pickups',
    description:
      'Each coil wound by a single artisan, potted in paraffin, then voiced with reference to 250+ pickup profiles.',
    specs: ['A2 Magnets', '42 AWG Wire', 'Vintage Paraffin', '250+ Profiles'],
    x: 0,
    y: 0,
  },
  {
    id: 'bridge',
    label: 'Bridge',
    code: '04',
    title: 'Titanium Hardware',
    description:
      'Grade-5 titanium bridge, machined to a mirror polish, then hand-fitted. String spacing held to ±0.05mm.',
    specs: ['Grade-5 Titanium', 'Mirror Polish', '±0.05mm', 'Hand-Fitted'],
    x: 0,
    y: 0,
  },
  {
    id: 'electronics',
    label: 'Electronics',
    code: '05',
    title: 'Active Circuitry',
    description:
      'Discrete Class-A preamp with custom-wound capacitors and military-spec resistors. Bypass-able to true passive mode.',
    specs: ['Class-A Discrete', 'Custom Caps', 'MIL-Spec Resistors', 'Bypass Mode'],
    x: 0,
    y: 0,
  },
];

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax component parts
      gsap.utils.toArray<HTMLElement>('.craft-part').forEach((part) => {
        gsap.to(part, {
          y: () => (parseFloat(part.dataset.speed ?? '0') * -120),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });

      // Step reveals
      gsap.utils.toArray<HTMLElement>('.craft-step').forEach((step) => {
        gsap.fromTo(
          step,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
            },
          }
        );
      });

      // Visual scale on scroll
      gsap.fromTo(
        visualRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="craftsmanship"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-amber-deep/5 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-amber-glow/5 blur-[100px]" />
      </div>

      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            01 / Craftsmanship
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">Engineered</span>
              <br />
              <span className="italic text-zinc-100">in layers.</span>
            </h2>
            <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              Five hundred and twelve individual components. One continuous
              gesture. Every AXIOM guitar is the convergence of aerospace
              engineering and three centuries of luthiery — disassembled,
              refined, and re-imagined.
            </p>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              Disassembly sequence
            </div>
            <div className="mt-2 font-display text-3xl text-zinc-200">
              512 components
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              Assembly time
            </div>
            <div className="mt-2 font-display text-3xl text-zinc-200">
              41 hours
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              Inspection checkpoints
            </div>
            <div className="mt-2 font-display text-3xl text-amber-glow">
              250+
            </div>
          </div>
        </div>
      </div>

      {/* Exploded visual */}
      <div className="relative z-0 mt-24 h-[600px] md:h-[800px]">
        <div ref={visualRef} className="relative mx-auto h-full w-full max-w-5xl">
          {/* Central vertical guideline */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          {/* The instrument itself — separated into its engineered layers */}
          <ExplodedGuitar />

          {/* Floating component parts */}
          {components.map((c, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <div
                key={c.id}
                className={`craft-part absolute top-0 ${
                  side === 'left' ? 'left-[10%]' : 'right-[10%]'
                }`}
                style={{
                  top: `${i * 18 + 5}%`,
                  ['speed' as never]: (i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.1),
                }}
              >
                <div className={`flex items-center gap-4 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`h-px w-12 md:w-32 bg-gradient-to-${
                      side === 'left' ? 'r' : 'l'
                    } from-amber-glow/60 to-transparent`}
                  />
                  <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-amber-glow">
                    {c.code}
                  </div>
                </div>
                <div
                  className={`glass mt-3 max-w-[200px] rounded-2xl p-4 ${
                    side === 'right' ? 'ml-auto text-right' : ''
                  }`}
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Component
                  </div>
                  <div className="mt-1 font-display text-lg text-zinc-100">
                    {c.label}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Center label */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 animate-spin-slow rounded-full border border-amber-glow/20" />
                <div className="absolute inset-4 animate-spin-slow rounded-full border border-amber-glow/40" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-8 animate-spin-slow rounded-full border border-amber-glow/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-amber-glow glow-amber-sm" />
                </div>
              </div>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-400">
                AXIOM / CORE
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Component detail rows */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1600px] px-6 md:px-12">
        <div className="space-y-32 md:space-y-48">
          {components.map((c, i) => (
            <div
              key={c.id}
              className="craft-step grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-graphite-800 to-ink-900">
                  {/* Procedural SVG illustration per component */}
                  <ComponentVisual id={c.id} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-glow">
                        {c.code}
                      </div>
                      <div className="font-display text-3xl text-zinc-100">
                        {c.label}
                      </div>
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                      AXIOM / {c.id}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`lg:col-span-7 lg:pt-12 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <h3 className="font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
                  {c.title}
                </h3>
                <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-zinc-400">
                  {c.description}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3">
                  {c.specs.map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-3 border-b border-white/5 pb-3"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-glow" />
                      <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExplodedGuitar() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] w-[min(58vw,520px)] -translate-x-1/2 opacity-100">
      <svg viewBox="0 0 700 900" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="exploded-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a2415" />
            <stop offset="45%" stopColor="#100e0d" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
          <linearGradient id="exploded-neck" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#31190c" />
            <stop offset="50%" stopColor="#c2772e" />
            <stop offset="100%" stopColor="#2b160b" />
          </linearGradient>
          <linearGradient id="exploded-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f4f4f5" />
            <stop offset="50%" stopColor="#696970" />
            <stop offset="100%" stopColor="#e4e4e7" />
          </linearGradient>
          <filter id="exploded-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Headstock, isolated from the neck */}
        <g transform="translate(286 28)">
          <path d="M 22 5 L 108 5 L 124 35 L 112 92 L 15 92 L 4 35 Z" fill="url(#exploded-body)" stroke="#ff8a1c" strokeOpacity=".8" strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx="8" cy={28 + i * 21} r="6" fill="url(#exploded-metal)" />
              <circle cx="120" cy={28 + i * 21} r="6" fill="url(#exploded-metal)" />
            </g>
          ))}
          <text x="64" y="58" textAnchor="middle" fill="#ff8a1c" fontSize="9" fontFamily="monospace" letterSpacing="3">AXIOM</text>
        </g>

        {/* Separation pulses */}
        {[142, 294, 438, 570].map((y) => (
          <g key={y} opacity=".7">
            <line x1="220" y1={y} x2="480" y2={y} stroke="#ff8a1c" strokeOpacity=".45" strokeDasharray="5 9" />
            <circle cx="350" cy={y} r="3" fill="#ff8a1c" filter="url(#exploded-glow)" />
          </g>
        ))}

        {/* Neck with fretboard */}
        <g transform="translate(309 162)">
          <rect x="0" y="0" width="82" height="120" rx="8" fill="url(#exploded-neck)" stroke="#d4af6a" strokeOpacity=".8" strokeWidth="2" />
          <rect x="12" y="0" width="58" height="120" rx="5" fill="#100d0b" />
          {[...Array(10)].map((_, i) => (
            <line key={i} x1="12" y1={10 + i * 10.5} x2="70" y2={10 + i * 10.5} stroke="#d4d4d8" strokeOpacity=".8" strokeWidth="1" />
          ))}
        </g>

        {/* Floating pickup plates */}
        {[{ y: 318, label: 'NECK' }, { y: 414, label: 'BRIDGE' }].map(({ y, label }) => (
          <g key={label} transform={`translate(244 ${y})`}>
            <rect width="212" height="48" rx="8" fill="#0a0a0c" stroke="#ff8a1c" strokeOpacity=".7" strokeWidth="2" />
            {[...Array(6)].map((_, i) => <circle key={i} cx={28 + i * 31} cy="24" r="5" fill="url(#exploded-metal)" />)}
            <text x="106" y="69" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace" letterSpacing="3">{label} PICKUP</text>
          </g>
        ))}

        {/* Carved body, visually separated from the electronics */}
        <g transform="translate(110 488)">
          <path
            d="M 228 4 C 165 -10, 105 18, 92 79 C 78 136, 104 174, 154 189 C 79 216, 62 284, 100 334 C 137 384, 205 380, 242 345 C 282 388, 361 391, 405 344 C 447 300, 433 232, 369 196 C 425 176, 444 119, 420 68 C 397 20, 331 -7, 274 12 L 274 0 Z"
            fill="url(#exploded-body)"
            stroke="#d4af6a"
            strokeOpacity=".85"
            strokeWidth="3"
          />
          <path d="M 252 25 L 268 25 L 268 188 L 252 188 Z" fill="#ff8a1c" fillOpacity=".75" />
          <path d="M 150 225 C 220 201, 320 201, 376 236" fill="none" stroke="#ff8a1c" strokeOpacity=".35" strokeWidth="2" />
          <path d="M 177 274 C 244 250, 319 256, 361 290" fill="none" stroke="#ff8a1c" strokeOpacity=".25" strokeWidth="2" />
        </g>

        {/* Bridge plate suspended in front of the body */}
        <g transform="translate(235 792)">
          <rect width="230" height="48" rx="6" fill="#141416" stroke="url(#exploded-metal)" strokeWidth="2" />
          {[...Array(6)].map((_, i) => <rect key={i} x={16 + i * 35} y="12" width="19" height="24" rx="2" fill="url(#exploded-metal)" />)}
          <text x="115" y="69" textAnchor="middle" fill="#a1a1aa" fontSize="9" fontFamily="monospace" letterSpacing="3">TITANIUM BRIDGE</text>
        </g>
      </svg>
    </div>
  );
}

function ComponentVisual({ id }: { id: string }) {
  // Procedural SVG illustrations per component
  const common = 'absolute inset-0 flex items-center justify-center';

  if (id === 'body') {
    return (
      <div className={common}>
        <svg viewBox="0 0 300 400" className="h-full w-full p-8">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a0f08" />
              <stop offset="100%" stopColor="#3a1f0a" />
            </linearGradient>
            <linearGradient id="bodySheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8a1c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff8a1c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 150 60 C 100 60, 60 120, 60 200 C 60 280, 100 340, 150 340 C 200 340, 240 280, 240 200 C 240 120, 200 60, 150 60 Z"
            fill="url(#bodyGrad)"
            stroke="#ff5a00"
            strokeWidth="1.5"
            opacity="0.95"
          />
          <path
            d="M 150 60 C 100 60, 60 120, 60 200 C 60 280, 100 340, 150 340 C 200 340, 240 280, 240 200 C 240 120, 200 60, 150 60 Z"
            fill="url(#bodySheen)"
            opacity="0.6"
          />
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="60"
              y1={100 + i * 30}
              x2="240"
              y2={100 + i * 30}
              stroke="#ff8a1c"
              strokeOpacity="0.15"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>
    );
  }
  if (id === 'neck') {
    return (
      <div className={common}>
        <svg viewBox="0 0 300 400" className="h-full w-full p-8">
          <defs>
            <linearGradient id="neckGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2a1810" />
              <stop offset="50%" stopColor="#4a2810" />
              <stop offset="100%" stopColor="#2a1810" />
            </linearGradient>
          </defs>
          <rect x="120" y="40" width="60" height="320" fill="url(#neckGrad)" rx="2" />
          {[...Array(20)].map((_, i) => (
            <line key={i} x1="120" y1={50 + i * 16} x2="180" y2={50 + i * 16} stroke="#e4e4e7" strokeWidth="1" />
          ))}
          {[3, 5, 7, 9, 12, 15, 17, 19].map((f, i) => (
            <circle key={i} cx="150" cy={50 + f * 16} r="3" fill="#f4f4f5" opacity="0.7" />
          ))}
        </svg>
      </div>
    );
  }
  if (id === 'pickups') {
    return (
      <div className={common}>
        <svg viewBox="0 0 300 400" className="h-full w-full p-8">
          {[80, 200, 320].map((y, idx) => (
            <g key={idx}>
              <rect x="80" y={y} width="140" height="40" rx="2" fill="#1a1a1e" stroke="#ff5a00" strokeWidth="1" />
              {[...Array(6)].map((_, i) => (
                <circle key={i} cx={110 + i * 16} cy={y + 20} r="6" fill="#3a3a42" stroke="#d4d4d8" strokeWidth="1" />
              ))}
            </g>
          ))}
        </svg>
      </div>
    );
  }
  if (id === 'bridge') {
    return (
      <div className={common}>
        <svg viewBox="0 0 300 400" className="h-full w-full p-8">
          <defs>
            <linearGradient id="brGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#8a8a90" />
            </linearGradient>
          </defs>
          <rect x="80" y="180" width="140" height="50" fill="url(#brGrad)" rx="3" />
          {[...Array(6)].map((_, i) => (
            <rect key={i} x={95 + i * 20} y="190" width="10" height="30" fill="#1a1a1e" />
          ))}
          {[...Array(6)].map((_, i) => (
            <circle key={i} cx={100 + i * 20} cy="160" r="8" fill="#d4d4d8" />
          ))}
          <line x1="60" y1="240" x2="240" y2="240" stroke="#ff8a1c" strokeWidth="0.5" opacity="0.5" />
        </svg>
      </div>
    );
  }
  if (id === 'electronics') {
    return (
      <div className={common}>
        <svg viewBox="0 0 300 400" className="h-full w-full p-8">
          <rect x="60" y="120" width="180" height="160" fill="#0a0a0a" stroke="#ff5a00" strokeWidth="1" rx="4" />
          <circle cx="100" cy="160" r="12" fill="#1a1a1e" stroke="#d4d4d8" />
          <circle cx="150" cy="160" r="12" fill="#1a1a1e" stroke="#d4d4d8" />
          <circle cx="200" cy="160" r="12" fill="#1a1a1e" stroke="#d4d4d8" />
          <rect x="80" y="200" width="40" height="60" fill="#3a1f0a" />
          <rect x="140" y="200" width="40" height="60" fill="#3a1f0a" />
          <rect x="200" y="200" width="20" height="60" fill="#1a1a1e" />
          {[...Array(8)].map((_, i) => (
            <line key={i} x1={70 + i * 5} y1="120" x2={70 + i * 5} y2="100" stroke="#d4d4d8" />
          ))}
        </svg>
      </div>
    );
  }
  return null;
}
