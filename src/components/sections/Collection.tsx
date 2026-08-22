'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Magnetic from '../Magnetic';

type Guitar = {
  id: string;
  series: string;
  name: string;
  tagline: string;
  price: string;
  edition: string;
  colors: { name: string; value: string; }[];
  specs: { label: string; value: string }[];
};

const guitars: Guitar[] = [
  {
    id: 'axiom-01',
    series: 'AXIOM 01',
    name: 'The Standard',
    tagline: 'Reference-grade form. Hand-built in California.',
    price: '$14,800',
    edition: 'Open Edition',
    colors: [
      { name: 'Onyx', value: '#0a0a0a' },
      { name: 'Cinder', value: '#3a1f0a' },
      { name: 'Ivory', value: '#e4e4e0' },
    ],
    specs: [
      { label: 'Body', value: 'Forged Carbon' },
      { label: 'Neck', value: 'Roasted Maple' },
      { label: 'Fretboard', value: 'Ebony' },
      { label: 'Pickups', value: 'AX-Custom A2' },
    ],
  },
  {
    id: 'axiom-02',
    series: 'AXIOM 02',
    name: 'The Sport',
    tagline: 'Lightweight. Built for the stage.',
    price: '$18,400',
    edition: 'Limited 250',
    colors: [
      { name: 'Magma', value: '#ff5a00' },
      { name: 'Storm', value: '#2a3a4a' },
      { name: 'Carbon', value: '#1a1a20' },
    ],
    specs: [
      { label: 'Body', value: 'Carbon / Maple' },
      { label: 'Neck', value: 'Roasted Maple' },
      { label: 'Fretboard', value: 'Richlite' },
      { label: 'Pickups', value: 'AX-Custom A2 Hot' },
    ],
  },
  {
    id: 'axiom-03',
    series: 'AXIOM 03',
    name: 'The Custom',
    tagline: 'Yours alone. Built once.',
    price: '$28,000',
    edition: 'Bespoke',
    colors: [
      { name: 'Burl Walnut', value: '#5a3a1a' },
      { name: 'Gold Leaf', value: '#d4af6a' },
      { name: 'Pearl', value: '#f4f0e4' },
    ],
    specs: [
      { label: 'Body', value: 'Figured Maple Top' },
      { label: 'Neck', value: 'One-piece Mahogany' },
      { label: 'Fretboard', value: 'Madagascar Ebony' },
      { label: 'Pickups', value: 'Bespoke Voice' },
    ],
  },
];

export default function Collection() {
  const [active, setActive] = useState(0);
  const g = guitars[active];

  return (
    <section
      id="collection"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-amber-glow/5 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            05 / Collection
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">The</span>{' '}
              <span className="italic text-zinc-100">Collection.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              Three flagship instruments. Each one is the most refined expression
              of a singular design philosophy. Choose your reference, or
              commission your own.
            </p>
          </div>
        </div>

        {/* Hero product */}
        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Image / visual */}
          <div className="lg:col-span-7">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-graphite-800 to-ink-900 md:aspect-[16/11]">
              {/* Background atmosphere */}
              <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                  background: `radial-gradient(ellipse at 50% 60%, ${g.colors[0].value}33, transparent 70%)`,
                }}
              />
              {/* Procedural guitar silhouette */}
              <GuitarSilhouette color={g.colors[0].value} accent={g.colors[1].value} />
              {/* Top label */}
              <div className="absolute left-6 top-6 md:left-10 md:top-10">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                  {g.series}
                </div>
                <div className="mt-2 font-display text-4xl font-light text-zinc-100 md:text-5xl">
                  {g.name}
                </div>
              </div>
              {/* Bottom specs */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between md:left-10 md:right-10">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                    Starting at
                  </div>
                  <div className="mt-1 font-display text-3xl text-zinc-100 md:text-4xl">
                    {g.price}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                    Edition
                  </div>
                  <div className="mt-1 font-display text-xl text-amber-glow">
                    {g.edition}
                  </div>
                </div>
              </div>
              {/* Reflection floor */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900 to-transparent" />
            </div>
          </div>

          {/* Selector + details */}
          <div className="lg:col-span-5 lg:pt-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              Series
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {guitars.map((gg, i) => (
                <button
                  key={gg.id}
                  onClick={() => setActive(i)}
                  data-cursor="hover"
                  className={`group relative flex items-center justify-between border-b py-4 text-left transition-colors ${
                    i === active
                      ? 'border-amber-glow/50'
                      : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                      {gg.series}
                    </div>
                    <div className="mt-1 font-display text-3xl text-zinc-100">
                      {gg.name}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">{gg.tagline}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl text-zinc-200">{gg.price}</div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                      {gg.edition}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                Specification
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3">
                {g.specs.map((s) => (
                  <div key={s.label} className="flex flex-col border-b border-white/5 pb-2">
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                      {s.label}
                    </span>
                    <span className="mt-1 text-sm text-zinc-200">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                Finishes
              </div>
              <div className="mt-3 flex gap-3">
                {g.colors.map((c) => (
                  <div key={c.name} className="group flex flex-col items-center gap-2">
                    <div
                      className="h-12 w-12 rounded-full border border-white/10 transition-transform group-hover:scale-110"
                      style={{ background: c.value, boxShadow: `0 0 20px ${c.value}80` }}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.3}>
                <button data-cursor="hover" className="btn-primary">
                  Reserve {g.series}
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button data-cursor="hover" className="btn-ghost">
                  Configure
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuitarSilhouette({ color, accent }: { color: string; accent: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      className="absolute inset-0 h-full w-full p-8 transition-all duration-1000"
    >
      <defs>
        <linearGradient id="bodyCol" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="accentCol" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <radialGradient id="bodyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Body */}
      <path
        d="M 280 180
           C 230 180, 200 220, 200 280
           C 200 340, 240 380, 290 380
           C 340 380, 380 340, 380 290
           L 400 100
           L 360 80
           C 340 130, 310 170, 280 180 Z"
        fill="url(#bodyCol)"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <ellipse cx="290" cy="290" rx="120" ry="80" fill="url(#bodyGlow)" />

      {/* Pickguard */}
      <path d="M 270 220 L 360 220 L 360 360 L 270 360 Z" fill={accent} opacity="0.2" />

      {/* Pickups */}
      <rect x="270" y="240" width="80" height="14" fill="#1a1a1e" />
      <rect x="270" y="280" width="80" height="14" fill="#1a1a1e" />
      <rect x="270" y="320" width="80" height="14" fill="#1a1a1e" />

      {/* Bridge */}
      <rect x="270" y="345" width="80" height="10" fill="#d4d4d8" />

      {/* Neck */}
      <rect x="320" y="60" width="40" height="160" fill="#2a1810" />
      <rect x="320" y="60" width="40" height="160" fill="url(#accentCol)" opacity="0.15" />

      {/* Frets */}
      {[...Array(14)].map((_, i) => (
        <line
          key={i}
          x1="320"
          y1={70 + i * 11}
          x2="360"
          y2={70 + i * 11}
          stroke="#e4e4e7"
          strokeWidth="0.8"
        />
      ))}

      {/* Headstock */}
      <rect x="318" y="30" width="44" height="30" fill="#2a1810" />
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={326 + i * 6} cy="42" r="2" fill="#d4d4d8" />
      ))}

      {/* Strings */}
      {[...Array(6)].map((_, i) => (
        <line
          key={i}
          x1={326 + i * 6}
          y1="44"
          x2={326 + i * 6}
          y2="350"
          stroke="#f4f4f5"
          strokeWidth="0.5"
          opacity="0.8"
        />
      ))}
    </svg>
  );
}
