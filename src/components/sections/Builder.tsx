'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '../Magnetic';

type Config = {
  body: string;
  finish: string;
  hardware: string;
  pickups: string;
  neck: string;
  inlay: string;
};

const options = {
  body: [
    { id: 'carbon', name: 'Forged Carbon', price: 0, color: '#1a1a20' },
    { id: 'maple', name: 'Figured Maple', price: 2400, color: '#5a3a1a' },
    { id: 'walnut', name: 'Claro Walnut', price: 3200, color: '#3a1f0a' },
  ],
  finish: [
    { id: 'matte', name: 'Stealth Matte', price: 0, color: '#0a0a0a' },
    { id: 'satin', name: 'Burnt Satin', price: 600, color: '#3a1f0a' },
    { id: 'gloss', name: 'Mirror Gloss', price: 1400, color: '#f4f4f5' },
    { id: 'pearl', name: 'Aurora Pearl', price: 2200, color: '#e4d4b8' },
  ],
  hardware: [
    { id: 'chrome', name: 'Mirror Chrome', price: 0, color: '#e4e4e7' },
    { id: 'gold', name: 'Champagne Gold', price: 1800, color: '#d4af6a' },
    { id: 'black', name: 'Stealth Black', price: 800, color: '#1a1a1e' },
    { id: 'titanium', name: 'Brushed Titanium', price: 2400, color: '#a0a0a8' },
  ],
  pickups: [
    { id: 'a2', name: 'AX-Custom A2', price: 0, desc: 'Vintage voicing' },
    { id: 'a2hot', name: 'AX-Custom A2 Hot', price: 600, desc: 'High output' },
    { id: 'p90', name: 'AX-P90', price: 900, desc: 'Single coil warmth' },
    { id: 'bespoke', name: 'Bespoke Voice', price: 3200, desc: 'Hand-tuned to you' },
  ],
  neck: [
    { id: 'maple', name: 'Roasted Maple', price: 0, color: '#6a4a2a' },
    { id: 'mahogany', name: 'Honduran Mahogany', price: 800, color: '#3a1f1a' },
    { id: 'wenge', name: 'Wenge', price: 1400, color: '#2a1a10' },
  ],
  inlay: [
    { id: 'pearl', name: 'Mother of Pearl', price: 0, color: '#f4f4f5' },
    { id: 'gold', name: 'Solid Gold', price: 4800, color: '#d4af6a' },
    { id: 'diamond', name: 'Black Diamond', price: 12400, color: '#1a1a1e' },
  ],
};

const basePrice = 14800;

export default function Builder() {
  const [config, setConfig] = useState<Config>({
    body: 'carbon',
    finish: 'matte',
    hardware: 'chrome',
    pickups: 'a2',
    neck: 'maple',
    inlay: 'pearl',
  });

  const total = useMemo(() => {
    return (
      basePrice +
      options.body.find((o) => o.id === config.body)!.price +
      options.finish.find((o) => o.id === config.finish)!.price +
      options.hardware.find((o) => o.id === config.hardware)!.price +
      options.pickups.find((o) => o.id === config.pickups)!.price +
      options.neck.find((o) => o.id === config.neck)!.price +
      options.inlay.find((o) => o.id === config.inlay)!.price
    );
  }, [config]);

  const get = <K extends keyof Config>(k: K) =>
    (options[k] as { id: string; name: string; color?: string; price: number }[]).find(
      (o) => o.id === config[k]
    )!;

  return (
    <section
      id="builder"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-amber-deep/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            06 / Custom
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">Make it</span>{' '}
              <span className="italic gradient-text">yours.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              Every AXIOM can be configured to your spec — or commissioned
              bespoke. Configure your instrument below and reserve your
              serial number.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Preview */}
          <div className="lg:col-span-7">
            <div className="sticky top-32 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-graphite-800 to-ink-900">
              <div className="relative aspect-[4/5] md:aspect-[16/12]">
                <BuilderPreview config={config} />
                {/* Top labels */}
                <div className="absolute left-6 top-6 md:left-10 md:top-10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                    Live preview
                  </div>
                  <div className="mt-2 font-display text-3xl text-zinc-100">
                    AXIOM 01 — Bespoke
                  </div>
                </div>
                {/* Price tag */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between md:left-10 md:right-10">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                      Configured total
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={total}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1 font-display text-5xl text-amber-glow md:text-6xl"
                      >
                        ${total.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                      Lead time
                    </div>
                    <div className="mt-1 font-display text-2xl text-zinc-100">
                      14 weeks
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8 lg:col-span-5">
            {(
              [
                { key: 'body' as const, label: 'Body' },
                { key: 'finish' as const, label: 'Finish' },
                { key: 'hardware' as const, label: 'Hardware' },
                { key: 'pickups' as const, label: 'Pickups' },
                { key: 'neck' as const, label: 'Neck' },
                { key: 'inlay' as const, label: 'Inlay' },
              ]
            ).map(({ key, label }) => (
              <div key={key} className="rounded-2xl border border-white/5 p-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                    {label}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    {get(key).name}
                    {(get(key) as { price: number }).price > 0
                      ? ` +$${(get(key) as { price: number }).price.toLocaleString()}`
                      : ''}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {options[key].map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setConfig((c) => ({ ...c, [key]: o.id }))}
                      data-cursor="hover"
                      className={`group flex items-center gap-3 rounded-full border px-4 py-2 text-xs transition-all ${
                        config[key] === o.id
                          ? 'border-amber-glow bg-amber-glow/10 text-amber-glow'
                          : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-100'
                      }`}
                    >
                      {(o as { color?: string }).color && (
                        <span
                          className="h-3 w-3 rounded-full border border-white/20"
                          style={{ background: (o as { color?: string }).color }}
                        />
                      )}
                      <span className="uppercase tracking-wider">{o.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Magnetic strength={0.3}>
                <button data-cursor="hover" className="btn-primary">
                  Reserve Serial
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button data-cursor="hover" className="btn-ghost">
                  Save configuration
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BuilderPreview({ config }: { config: Config }) {
  const body = options.body.find((o) => o.id === config.body)!;
  const finish = options.finish.find((o) => o.id === config.finish)!;
  const hardware = options.hardware.find((o) => o.id === config.hardware)!;
  const neck = options.neck.find((o) => o.id === config.neck)!;
  const inlay = options.inlay.find((o) => o.id === config.inlay)!;
  const pickup = options.pickups.find((o) => o.id === config.pickups)!;
  const bodyColor = (body as { color?: string }).color || '#1a1a20';
  const finishColor = (finish as { color?: string }).color || '#0a0a0a';
  const hardwareColor = (hardware as { color?: string }).color || '#e4e4e7';
  const neckColor = (neck as { color?: string }).color || '#6a4a2a';
  const inlayColor = (inlay as { color?: string }).color || '#f4f4f5';
  const finishOpacity = config.finish === 'matte' ? 0.18 : config.finish === 'gloss' ? 0.42 : 0.3;
  const bodyPath = `M 365 202
    L 350 172 L 332 172 L 326 203
    C 279 179 224 196 204 243
    C 181 298 205 338 255 357
    C 203 386 190 444 226 487
    C 262 531 329 530 372 485
    C 416 532 486 527 523 480
    C 559 434 544 378 488 353
    C 539 326 557 270 527 223
    C 497 179 434 180 400 205
    L 396 172 L 378 172 L 365 202 Z`;

  return (
    <svg viewBox="0 0 760 560" className="absolute inset-0 h-full w-full p-5 md:p-8">
      <defs>
        <linearGradient id="bBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bodyColor} />
          <stop offset="45%" stopColor="#121215" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id="bFinish" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={finishColor} stopOpacity={finishOpacity} />
          <stop offset="52%" stopColor="#ffffff" stopOpacity={config.finish === 'gloss' ? 0.16 : 0.03} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="bHardware" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="28%" stopColor={hardwareColor} />
          <stop offset="100%" stopColor="#25252a" />
        </linearGradient>
        <linearGradient id="bNeck" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={neckColor} />
          <stop offset="50%" stopColor="#8a6a4a" />
          <stop offset="100%" stopColor={neckColor} />
        </linearGradient>
        <pattern id="carbon-weave" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="11" height="11" fill="transparent" />
          <path d="M0 2 H11 M0 8 H11" stroke="#c4c4cc" strokeOpacity=".14" strokeWidth="1.2" />
        </pattern>
        <filter id="builder-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <ellipse cx="370" cy="352" rx="265" ry="190" fill="#ff5a00" opacity="0.08" />
      <ellipse cx="370" cy="350" rx="190" ry="145" fill={bodyColor} opacity="0.13" filter="url(#builder-glow)" />

      {/* Full double-cut electric body */}
      <g style={{ transition: 'all 0.5s ease' }}>
        <path d={bodyPath} fill="url(#bBody)" stroke="#ff8a1c" strokeOpacity=".85" strokeWidth="2.2" />
        <path d={bodyPath} fill="url(#bFinish)" />
        {config.body === 'carbon' && <path d={bodyPath} fill="url(#carbon-weave)" opacity=".65" />}
        <path d="M 255 357 C 300 326 450 325 488 353" fill="none" stroke="#ffffff" strokeOpacity=".1" strokeWidth="2" />
      </g>

      {/* Neck, ebony fretboard and a distinct headstock */}
      <path d="M 350 205 L 350 55 L 398 55 L 400 205 Z" fill="url(#bNeck)" stroke="#d4af6a" strokeOpacity=".55" />
      <rect x="358" y="55" width="32" height="150" rx="3" fill="#100d0b" />
      {[...Array(13)].map((_, i) => <line key={i} x1="358" y1={68 + i * 10} x2="390" y2={68 + i * 10} stroke="#d4d4d8" strokeOpacity=".8" strokeWidth="1" />)}
      {[3, 5, 7, 9, 12].map((f) => <circle key={f} cx="374" cy={68 + f * 10} r={f === 12 ? 3.5 : 2.6} fill={inlayColor} />)}
      <path d="M 345 16 L 404 16 L 416 34 L 404 60 L 345 60 L 334 34 Z" fill="url(#bNeck)" stroke="#d4af6a" strokeOpacity=".65" />
      {[0, 1, 2].map((i) => <g key={i}><circle cx="338" cy={28 + i * 10} r="3" fill="url(#bHardware)" /><circle cx="412" cy={28 + i * 10} r="3" fill="url(#bHardware)" /></g>)}

      {/* Strings from nut to bridge */}
      {[...Array(6)].map((_, i) => <line key={i} x1={360 + i * 6} y1="42" x2={360 + i * 6} y2="451" stroke="#f4f4f5" strokeOpacity=".6" strokeWidth={i === 0 ? 0.8 : 0.5} />)}

      {/* Contoured pickguard and two real humbuckers */}
      <path d="M 354 220 C 403 203 453 223 467 258 C 474 284 453 324 441 355 L 420 424 L 360 414 L 347 272 Z" fill="#111217" fillOpacity=".92" stroke="#ff8a1c" strokeOpacity=".4" />
      {[286, 356].map((y) => (
        <g key={y} transform={`translate(330 ${y})`}>
          <rect width="90" height="28" rx="4" fill="#08080a" stroke="url(#bHardware)" strokeOpacity=".75" />
          {[...Array(6)].map((_, i) => <circle key={i} cx={14 + i * 12.2} cy="14" r="2.6" fill="url(#bHardware)" />)}
        </g>
      ))}

      {/* Selector, machined controls, and six-saddle bridge */}
      <circle cx="446" cy="273" r="10" fill="url(#bHardware)" /><path d="M 446 267 L 454 278" stroke="#ff8a1c" strokeWidth="2" />
      {[{ x: 445, y: 337 }, { x: 467, y: 364 }, { x: 456, y: 394 }].map(({ x, y }) => <circle key={`${x}-${y}`} cx={x} cy={y} r="12" fill="url(#bHardware)" stroke="#ffffff" strokeOpacity=".35" />)}
      <g transform="translate(327 430)">
        <rect width="102" height="23" rx="3" fill="#151519" stroke="url(#bHardware)" strokeOpacity=".9" />
        {[...Array(6)].map((_, i) => <rect key={i} x={9 + i * 15} y="5" width="10" height="13" rx="1" fill="url(#bHardware)" />)}
      </g>

      <text x="528" y="475" fill="#ff8a1c" fontFamily="monospace" fontSize="10" letterSpacing="3">{pickup.name.toUpperCase()}</text>
    </svg>
  );
}
