'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  {
    code: '01',
    label: 'Tolerance',
    value: 0.002,
    suffix: 'mm',
    decimals: 3,
    description: 'Machining tolerance exceeds aerospace standards by 10x.',
    scale: 1,
  },
  {
    code: '02',
    label: 'Hand Tuned',
    value: 100,
    suffix: '%',
    decimals: 0,
    description: 'Every instrument is voiced by a single master luthier.',
    scale: 1,
  },
  {
    code: '03',
    label: 'Precision Checks',
    value: 250,
    suffix: '+',
    decimals: 0,
    description: 'Inspection points across the assembly process.',
    scale: 1,
  },
  {
    code: '04',
    label: 'Craftsmanship',
    value: 41,
    suffix: 'h',
    decimals: 0,
    description: 'Hours of focused hand-labor per instrument.',
    scale: 1,
  },
  {
    code: '05',
    label: 'Reference',
    value: 432,
    suffix: 'Hz',
    decimals: 0,
    description: 'All instruments voiced to 432Hz A-reference.',
    scale: 1,
  },
  {
    code: '06',
    label: 'Warranty',
    value: 100,
    suffix: 'yr',
    decimals: 0,
    description: 'Lifetime craftsmanship guarantee.',
    scale: 1,
  },
];

function CountUp({
  to,
  duration = 2000,
  decimals = 0,
  inView,
}: {
  to: number;
  duration?: number;
  decimals?: number;
  inView: boolean;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, inView]);
  return <>{val.toFixed(decimals)}</>;
}

function Stat({ s }: { s: (typeof stats)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="craft-step group relative border-t border-white/10 py-8 md:py-12">
      <div className="grid grid-cols-12 items-baseline gap-4">
        <div className="col-span-2 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
          {s.code}
        </div>
        <div className="col-span-10 md:col-span-3 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          {s.label}
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="font-display text-[clamp(3rem,8vw,7rem)] font-light leading-none tracking-[-0.04em]">
            <span className="chrome-text">
              <CountUp to={s.value} decimals={s.decimals} inView={inView} />
            </span>
            <span className="text-amber-glow">{s.suffix}</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-2 text-sm text-zinc-400 md:text-right">
          {s.description}
        </div>
      </div>
      {/* progress bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: 'left' }}
        className="mt-4 h-px bg-gradient-to-r from-amber-glow via-amber-deep to-transparent"
      />
    </div>
  );
}

export default function Performance() {
  return (
    <section
      id="performance"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-deep/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            04 / Performance
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-8">
            <h2 className="font-display text-[clamp(2.5rem,8vw,8rem)] font-light leading-[0.85] tracking-[-0.04em]">
              <span className="chrome-text">Performance</span>
              <br />
              <span className="italic text-zinc-100">is not a number.</span>
              <br />
              <span className="gradient-text">It is a discipline.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              AXIOM instruments are measured against 1,847 distinct
              performance criteria. Each is a refusal to compromise. Each is
              observed, recorded, and signed by the master luthier responsible.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1 w-12 bg-amber-glow" />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                Verified — Luthier 0042
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16">
          {stats.map((s) => (
            <Stat key={s.code} s={s} />
          ))}
        </div>

        {/* Marquee */}
        <div className="relative mt-32 -mx-6 overflow-hidden md:-mx-12">
          <div className="flex whitespace-nowrap">
            <div className="marquee flex shrink-0 items-center gap-12 px-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-12 font-display text-4xl text-zinc-700 md:text-6xl">
                  <span>Engineered for Legends</span>
                  <span className="text-amber-glow">✦</span>
                  <span>Made in California</span>
                  <span className="text-amber-glow">✦</span>
                </div>
              ))}
            </div>
            <div className="marquee flex shrink-0 items-center gap-12 px-6" aria-hidden>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-12 font-display text-4xl text-zinc-700 md:text-6xl">
                  <span>Engineered for Legends</span>
                  <span className="text-amber-glow">✦</span>
                  <span>Made in California</span>
                  <span className="text-amber-glow">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
