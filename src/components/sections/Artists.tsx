'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArtistPlayer from '../audio/ArtistPlayer';

const artists = [
  {
    name: 'Mira Kawahara',
    role: 'Composer · Tokyo',
    quote: '"There is no distance between intention and tone. AXIOM is the first instrument that disappears."',
    image: 'kawahara',
    track: 'Concerto for Carbon',
  },
  {
    name: 'Idris Hale',
    role: 'Producer · London',
    quote: '"I have built records on lesser instruments. AXIOM does not require forgiveness."',
    image: 'hale',
    track: 'Storm / Sessions',
  },
  {
    name: 'Niko Salvador',
    role: 'Session · Los Angeles',
    quote: '"It is the only guitar I have touched that I do not need to tame. It is already tamed."',
    image: 'salvador',
    track: 'Blue Hour',
  },
];

export default function Artists() {
  const [activePlayer, setActivePlayer] = useState<{ track: string; artist: string } | null>(null);

  return (
    <section
      id="artists"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-deep/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            07 / Artists
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">Played by</span>{' '}
              <span className="italic text-zinc-100">the few.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              AXIOM is entrusted to a small circle of artists. They shape the
              instrument — and the instrument shapes the music. This is the
              AXIOM roster.
            </p>
          </div>
        </div>
      </div>

      {/* Featured artist — parallax hero */}
      <FeaturedArtist
        artist={artists[0]}
        onListen={() => setActivePlayer({ track: artists[0].track, artist: artists[0].name })}
      />

      {/* Grid of remaining artists */}
      <div className="relative z-10 mx-auto mt-12 max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {artists.slice(1).map((a, i) => (
            <ArtistCard
              key={a.name}
              artist={a}
              index={i}
              onListen={() => setActivePlayer({ track: a.track, artist: a.name })}
            />
          ))}
        </div>
      </div>

      {/* Roster strip */}
      <div className="relative z-10 mx-auto mt-24 max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            08 / Roster
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
            43 active artists
          </span>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[
            'Mira Kawahara', 'Idris Hale', 'Niko Salvador', 'Lena Voss',
            'Theo Marin', 'Ines Ortega', 'Kazuto Akiyama', 'Aria Soren',
            'Jules Beaumont', 'Saskia Bloom', 'Avery Quill', 'Ren Asuka',
          ].map((n, index) => (
            <div
              key={n}
              className="group flex flex-col items-start border-b border-white/5 py-3 transition-colors hover:border-amber-glow/50"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600 group-hover:text-amber-glow">
                A — {String(117 + index * 53).padStart(3, '0')}
              </span>
              <span className="mt-1 font-display text-base text-zinc-200 group-hover:text-zinc-100">
                {n}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Artist Player Dock */}
      <ArtistPlayer
        trackTitle={activePlayer?.track || ''}
        artistName={activePlayer?.artist || ''}
        visible={!!activePlayer}
        onClose={() => setActivePlayer(null)}
      />
    </section>
  );
}

function FeaturedArtist({
  artist,
  onListen,
}: {
  artist: (typeof artists)[number];
  onListen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div
      ref={ref}
      className="relative mt-24 h-[90vh] w-full overflow-hidden md:h-[100vh]"
    >
      <motion.div style={{ scale }} className="absolute inset-0">
        <ArtistPortrait variant={artist.image} parallax={y1} />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent"
      />

      <div className="relative z-10 flex h-full items-end p-6 md:p-12">
        <div className="max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            Featured artist
          </div>
          <h3 className="mt-3 font-display text-6xl font-light text-zinc-100 md:text-8xl">
            {artist.name}
          </h3>
          <div className="mt-2 font-display text-xl italic text-zinc-400">
            {artist.role}
          </div>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-200 md:text-xl">
            {artist.quote}
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button
              data-cursor="hover"
              className="btn-ghost"
              onClick={onListen}
            >
              Listen
            </button>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              ↳ {artist.track}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtistCard({
  artist,
  index,
  onListen,
}: {
  artist: (typeof artists)[number];
  index: number;
  onListen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.3 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-graphite-800 to-ink-900"
    >
      <ArtistPortrait variant={artist.image} />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
          A — 0{index + 2}
        </div>
        <h3 className="mt-2 font-display text-3xl text-zinc-100">{artist.name}</h3>
        <div className="mt-1 font-display text-sm italic text-zinc-400">
          {artist.role}
        </div>
        <p className="mt-4 line-clamp-3 text-sm text-zinc-300">
          {artist.quote}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            data-cursor="hover"
            className="rounded-full border border-white/10 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 transition-all hover:border-amber-glow/50 hover:text-amber-glow"
            onClick={onListen}
          >
            Listen
          </button>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
            ↳ {artist.track}
          </span>
        </div>
      </div>
      <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-amber-glow opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
}

function ArtistPortrait({ variant, parallax }: { variant: string; parallax?: any }) {
  const palettes: Record<string, { bg: string; skin: string; hair: string; accent: string }> = {
    kawahara: { bg: '#1a0a14', skin: '#e8c8a8', hair: '#0a0a0a', accent: '#ff5a00' },
    hale: { bg: '#0a141a', skin: '#8a6a4a', hair: '#1a1a1e', accent: '#5a8cff' },
    salvador: { bg: '#0a1a14', skin: '#c8a888', hair: '#2a1810', accent: '#d4af6a' },
  };
  const p = palettes[variant] || palettes.kawahara;
  return (
    <motion.div style={parallax} className="absolute inset-0">
      <svg viewBox="0 0 800 1000" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`bg-${variant}`} cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.35" />
            <stop offset="50%" stopColor={p.bg} />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
          <linearGradient id={`skin-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.skin} />
            <stop offset="100%" stopColor="#3a2a1a" />
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill={`url(#bg-${variant})`} />
        {[...Array(40)].map((_, i) => (
          <circle
            key={i}
            cx={(i * 73) % 800}
            cy={(i * 47) % 1000}
            r={0.5 + (i % 3) * 0.5}
            fill={p.accent}
            opacity={0.2 + (i % 3) * 0.2}
          />
        ))}
        <ellipse cx="400" cy="700" rx="180" ry="220" fill="#0a0a0a" opacity="0.95" />
        <ellipse cx="400" cy="380" rx="90" ry="120" fill={`url(#skin-${variant})`} opacity="0.85" />
        <path
          d="M 310 340 Q 400 240, 490 340 L 480 380 Q 400 320, 320 380 Z"
          fill={p.hair}
          opacity="0.9"
        />
        <path
          d="M 220 600 Q 400 500, 580 600 L 580 800 L 220 800 Z"
          fill="#0a0a0a"
          opacity="0.9"
        />
        <rect
          x="540"
          y="200"
          width="40"
          height="500"
          fill={p.hair}
          transform="rotate(15 560 450)"
          opacity="0.95"
        />
        <rect
          x="538"
          y="200"
          width="44"
          height="500"
          fill={p.accent}
          opacity="0.2"
          transform="rotate(15 560 450)"
        />
        <ellipse cx="600" cy="800" rx="120" ry="100" fill="#0a0a0a" transform="rotate(15 600 800)" />
        <ellipse cx="500" cy="320" rx="80" ry="120" fill={p.accent} opacity="0.15" />
      </svg>
    </motion.div>
  );
}
