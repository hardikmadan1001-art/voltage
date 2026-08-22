'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from '../Magnetic';
import GuitarCanvasLazy from '../three/GuitarCanvasLazy';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] min-h-[700px] w-full overflow-hidden"
    >
      {/* Background grid + atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,138,28,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(255,90,0,0.10),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
        {/* Horizontal lines */}
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-glow/30 to-transparent" />
      </div>

      {/* 3D Guitar Canvas */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 z-[1]"
      >
        {mounted && (
          <GuitarCanvasLazy className="h-full w-full" withEffects />
        )}
        {/* Spotlight cones */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[600px] -translate-x-1/2 opacity-60"
             style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,138,28,0.18) 0%, transparent 60%)' }} />
      </motion.div>

      {/* Floor reflection gradient */}
      <div className="reflection-floor pointer-events-none absolute bottom-0 left-0 right-0 h-40 z-[2]" />

      {/* Text content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex h-full flex-col justify-between p-6 md:p-12"
      >
        {/* Top metadata row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex items-start justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow/80">
              SERIES — 01
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              Calibrated in California
            </span>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              N° 0042 / ∞
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">
              Est. 2026
            </span>
          </div>
        </motion.div>

        {/* Center hero text — bottom aligned */}
        <div className="flex flex-col items-start gap-8 pb-8 md:pb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 1 }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-12 bg-amber-glow" />
            <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-glow">
              The AXIOM Standard
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 3.1, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-display text-[clamp(2.5rem,8vw,8.5rem)] font-light leading-[0.85] tracking-[-0.04em]"
            >
              Engineered
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 3.25, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-display text-[clamp(2.5rem,8vw,8.5rem)] font-light italic leading-[0.85] tracking-[-0.04em]"
            >
              <span className="gradient-text">for Legends.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.6, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="max-w-md text-balance text-sm leading-relaxed text-zinc-400 md:text-base"
          >
            Every note. Every vibration. Built with obsessive precision. AXIOM
            represents the convergence of aerospace engineering and luthiery — a
            new instrument for a new era.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-4 flex flex-wrap items-center gap-4"
          >
            <Magnetic strength={0.3}>
              <button data-cursor="hover" className="btn-primary">
                Explore Collection
                <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
            </Magnetic>
            <Magnetic strength={0.3}>
              <button data-cursor="hover" className="btn-ghost">
                Experience the Craft
              </button>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom metadata row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between md:bottom-12 md:left-12 md:right-12"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-zinc-700 p-1"
          >
            <div className="h-2 w-1 rounded-full bg-amber-glow" />
          </motion.div>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
            Scroll to experience
          </span>
        </div>

        <div className="hidden md:flex items-end gap-12 text-right">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">
              Body
            </div>
            <div className="font-display text-2xl tracking-tight text-zinc-300">
              Carbon<br />Composite
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">
              Neck
            </div>
            <div className="font-display text-2xl tracking-tight text-zinc-300">
              Roasted<br />Maple
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600">
              Tuned
            </div>
            <div className="font-display text-2xl tracking-tight text-amber-glow">
              432 Hz<br />Reference
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
