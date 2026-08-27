'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';
import AudioToggle from './audio/AudioToggle';

const links = [
  { label: 'Craft', href: '#craftsmanship' },
  { label: 'Materials', href: '#materials' },
  { label: 'Sound', href: '#sound' },
  { label: 'Collection', href: '#collection' },
  { label: 'Builder', href: '#builder' },
  { label: 'Artists', href: '#artists' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m} PT`);
    };
    tick();
    const i = setInterval(tick, 1000 * 30);
    return () => clearInterval(i);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.6, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between px-6 md:px-12 transition-all duration-700 ${
            scrolled ? 'max-w-6xl' : 'max-w-[1600px]'
          }`}
        >
          <Magnetic strength={0.2}>
            <a
              href="#top"
              className="group flex items-center gap-3"
              data-cursor="hover"
            >
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rotate-45 border border-amber-glow/60 transition-all duration-500 group-hover:rotate-[135deg] group-hover:border-amber-glow" />
                <div className="absolute inset-1.5 rotate-45 bg-gradient-to-br from-amber-glow to-amber-deep transition-all duration-500 group-hover:rotate-[135deg]" />
              </div>
              <span className="font-display text-lg tracking-[0.3em] text-zinc-100">
                AXIOM
              </span>
            </a>
          </Magnetic>

          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l, i) => (
              <Magnetic key={l.href} strength={0.25}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className="group relative text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-400 transition-colors hover:text-zinc-100"
                >
                  <span className="text-amber-glow/40 mr-2 font-mono text-[9px]">
                    0{i + 1}
                  </span>
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-glow transition-all duration-500 group-hover:w-full" />
                </a>
              </Magnetic>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <AudioToggle />
            <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
              {time}
            </span>
            <Magnetic strength={0.3}>
              <button
                data-cursor="hover"
                className="hidden md:flex btn-ghost py-2.5 px-5 text-[10px]"
              >
                Reserve
              </button>
            </Magnetic>
          </div>
        </div>
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
          )}
        </AnimatePresence>
      </motion.header>

      {/* Side rail indicators */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3, duration: 1 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-600 rotate-90 origin-right translate-y-3">
          scroll
        </span>
        <div className="mt-6 h-24 w-px bg-zinc-800" />
      </motion.div>
    </>
  );
}
