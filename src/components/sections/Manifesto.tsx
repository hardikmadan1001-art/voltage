'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[80vh] w-full overflow-hidden bg-ink-900"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-deep/10 blur-[150px]" />
      </div>
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-glow">
          The AXIOM Doctrine
        </div>
        <h2 className="mt-8 max-w-5xl font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-[-0.03em]">
          <span className="chrome-text">We do not</span>{' '}
          <span className="italic text-zinc-100">build guitars.</span>
          <br />
          <span className="gradient-text">We refine intent into resonance.</span>
        </h2>
        <p className="mt-10 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400">
          The decision to play is the decision to be heard. AXIOM instruments
          are the expression of that decision, refined until nothing remains
          but the music itself.
        </p>
        <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          <div className="h-px w-12 bg-amber-glow" />
          <span>Signed, AXIOM Atelier</span>
          <div className="h-px w-12 bg-amber-glow" />
        </div>
      </motion.div>
    </section>
  );
}
