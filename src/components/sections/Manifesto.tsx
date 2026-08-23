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
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%']);

  return (
    <section
      ref={ref}
      data-section="manifesto"
      className="relative h-[90vh] w-full overflow-hidden bg-ink-900"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-deep/12 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.04]"
             style={{
               backgroundImage:
                 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
               backgroundSize: '120px 120px',
               maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
               WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
             }}
        />
      </div>

      {/* Decorative side rail */}
      <div className="pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 md:block">
        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600 [writing-mode:vertical-rl]">
          Manifesto / 2026
        </div>
      </div>
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 md:block">
        <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600 [writing-mode:vertical-rl]">
          The AXIOM Doctrine
        </div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.5em] text-amber-glow"
        >
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: '48px' }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="block h-px bg-amber-glow"
          />
          The AXIOM Doctrine
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: '48px' }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="block h-px bg-amber-glow"
          />
        </motion.div>

        <h2 className="mt-10 max-w-5xl font-display text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-[-0.03em]">
          <span className="chrome-text">We do not</span>{' '}
          <span className="italic text-zinc-100">build guitars.</span>
          <br />
          <span className="gradient-text">We refine intent into resonance.</span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 }}
          style={{ transformOrigin: 'center' }}
          className="mt-12 h-px w-24 bg-gradient-to-r from-transparent via-amber-glow to-transparent"
        />

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

      {/* Bottom-corner scroll progress for this section */}
      <motion.div
        style={{ width: lineWidth }}
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-amber-deep via-amber-glow to-amber-neon"
      />
    </section>
  );
}
