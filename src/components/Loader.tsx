'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';

const ease = [0.2, 0.8, 0.2, 1] as const;
const word = 'AXIOM';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Stagger the AXIOM letters as soon as the loader mounts.
    const letters = document.querySelectorAll<HTMLElement>('.loader-letter');
    if (letters.length) {
      if (reduce) {
        gsap.set(letters, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          letters,
          { opacity: 0, y: 80, rotate: 8, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            filter: 'blur(0px)',
            duration: 1.1,
            stagger: 0.06,
            ease: 'expo.out',
            delay: 0.15,
          }
        );
      }
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        // Ease toward 100 so it slows as it gets close.
        const remaining = 100 - p;
        const next = p + remaining * (reduce ? 0.2 : 0.06) + (reduce ? 4 : 1.5);
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, reduce ? 80 : 90);

    const finishTimer = setTimeout(() => setDone(true), reduce ? 900 : 2200);
    const hideTimer = setTimeout(() => setShow(false), reduce ? 1100 : 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900"
        >
          {/* Top bar — sequence marker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute top-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500"
          >
            <span>AXIOM / California</span>
            <span className="hidden sm:inline">Loading sequence</span>
            <span className="text-amber-glow">{done ? 'READY' : 'CALIBRATING'}</span>
          </motion.div>

          {/* Decorative vertical guides */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-10"
          >
            {/* Pre-label */}
            <div className="loader-text text-[10px] uppercase tracking-[0.5em] text-zinc-500">
              Series 01 / Engineered for Legends
            </div>

            {/* Logo with character reveal */}
            <div className="relative">
              <h1
                className="font-display text-7xl md:text-[10rem] font-light tracking-[-0.04em]"
                style={{ perspective: '1000px' }}
              >
                <span className="sr-only">{word}</span>
                <span aria-hidden className="chrome-text flex">
                  {word.split('').map((ch, i) => (
                    <span
                      key={i}
                      className="loader-letter inline-block"
                      style={{ willChange: 'transform, opacity, filter' }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              </h1>
              {/* Underline progress */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
                className="absolute -bottom-3 left-0 h-px bg-gradient-to-r from-transparent via-amber-glow to-transparent"
              />
            </div>

            {/* Progress bar with percentage */}
            <div className="flex w-72 flex-col items-center gap-3">
              <div className="flex w-full items-center justify-between text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono">
                <span>{done ? 'READY' : 'CALIBRATING'}</span>
                <span>{Math.floor(Math.min(progress, 100)).toString().padStart(3, '0')}</span>
              </div>
              <div className="relative h-px w-full bg-zinc-900">
                <div
                  className="h-full bg-gradient-to-r from-amber-deep via-amber-glow to-amber-neon"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    boxShadow: '0 0 12px rgba(255,138,28,0.6)',
                  }}
                />
              </div>
              <div className="mt-2 flex w-full justify-between font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-700">
                <span>Calibrating materials</span>
                <span>{Math.min(progress, 100).toFixed(0)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Footer credits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600"
          >
            <span>N° 0042 / ∞</span>
            <span className="hidden sm:inline">Ojai · California</span>
            <span>Est. 2026</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
