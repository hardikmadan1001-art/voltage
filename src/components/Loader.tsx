'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 6 + 1.5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 70);

    const finish = setTimeout(() => setDone(true), 2300);
    const hide = setTimeout(() => setShow(false), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(finish);
      clearTimeout(hide);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-900"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="loader-text text-[10px] uppercase tracking-[0.5em] text-zinc-500">
              AXIOM / California
            </div>

            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="font-display text-7xl md:text-9xl font-light tracking-tighter"
              >
                <span className="chrome-text">AXIOM</span>
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
                className="absolute -bottom-2 left-0 h-px bg-gradient-to-r from-transparent via-amber-glow to-transparent"
              />
            </div>

            <div className="flex w-64 flex-col items-center gap-2">
              <div className="flex w-full items-center justify-between text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono">
                <span>{done ? 'READY' : 'CALIBRATING'}</span>
                <span>{Math.floor(Math.min(progress, 100))}</span>
              </div>
              <div className="h-px w-full bg-zinc-900">
                <div
                  className="h-full bg-gradient-to-r from-amber-deep to-amber-glow transition-all duration-100"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
