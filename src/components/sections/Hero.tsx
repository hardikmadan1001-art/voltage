'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../Magnetic';
import GuitarCanvasLazy from '../three/GuitarCanvasLazy';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -128]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.58], [1, 0]);
  const detailsOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  useEffect(() => {
    setMounted(true);
    const context = gsap.context(() => {
      if (!stageRef.current) return;
      gsap.to(stageRef.current, {
        scale: 1.14,
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.1 },
      });
    }, sectionRef);
    return () => context.revert();
  }, []);

  const jumpToCollection = () => document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth' });
  const jumpToCraft = () => document.querySelector('#craftsmanship')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section ref={sectionRef} id="top" className="relative min-h-[760px] h-[115svh] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_55%_45%,#27140b_0%,#0c0908_35%,#050505_72%)]" />
      <div className="hero-grid absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[65vh] w-[70vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,173,102,.2),transparent_67%)] blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 z-[2] h-[45%] bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />

      <motion.div ref={stageRef} className="absolute inset-0 z-[1] origin-[55%_50%]">
        {mounted && <GuitarCanvasLazy className="h-full w-full" withEffects />}
        <div className="pointer-events-none absolute inset-x-[12%] top-[43%] h-px bg-gradient-to-r from-transparent via-amber-glow/50 to-transparent blur-[1px]" />
      </motion.div>

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="relative z-10 mx-auto flex h-[100svh] max-w-[1800px] flex-col justify-between px-6 pb-9 pt-28 md:px-12 md:pb-12 md:pt-32">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.9, ease }} className="flex items-start justify-between">
          <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.35em] text-amber-glow/90 md:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-glow shadow-[0_0_15px_#ff8a1c]" />
            Series 01 / Live object
          </div>
          <div className="hidden text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.32em] text-zinc-500 md:block">
            Designed in California<br />Built without compromise
          </div>
        </motion.div>

        <div className="grid grid-cols-1 items-end gap-8 pb-6 lg:grid-cols-12">
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.36, duration: 1, ease }} className="mb-5 flex origin-left items-center gap-3 font-mono text-[9px] uppercase tracking-[0.38em] text-zinc-400">
              <span className="block h-px w-10 bg-amber-glow" />
              A new standard of feel
            </motion.div>
            <h1 className="font-display text-[clamp(4rem,10vw,10.5rem)] font-light leading-[0.76] tracking-[-0.065em] text-zinc-100">
              <span>Make it</span>
              <br />
              <span className="gradient-text">matter.</span>
            </h1>
          </div>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 1, ease }} className="max-w-[25rem] lg:col-start-9 lg:col-span-4 lg:pb-3">
            <p className="text-pretty text-sm leading-7 text-zinc-300 md:text-base">The instrument disappears. What remains is your intention — translated with absolute precision.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic strength={0.22}><button onClick={jumpToCollection} data-cursor="hover" data-cursor-label="Discover" className="btn-primary">Discover AXIOM <span className="ml-3 text-lg leading-none">↗</span></button></Magnetic>
              <Magnetic strength={0.2}><button onClick={jumpToCraft} data-cursor="hover" className="btn-ghost px-5">The craft</button></Magnetic>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ opacity: detailsOpacity }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-8 left-6 right-6 z-20 flex items-end justify-between md:bottom-12 md:left-12 md:right-12">
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1"><motion.i animate={{ y: [0, 13, 0] }} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }} className="block h-1.5 w-px bg-amber-glow" /></span>
            <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-zinc-500">Hover or drag the guitar / scroll to calibrate</span>
          </div>
        <div className="hidden grid-cols-3 gap-x-10 border-l border-white/10 pl-8 md:grid">
          {[['Body','Forged carbon'],['Profile','C / 0.83 in'],['Voice','AX-Custom A2']].map(([key, value]) => <div key={key}><p className="font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-600">{key}</p><p className="mt-1 font-display text-lg text-zinc-200">{value}</p></div>)}
        </div>
      </motion.div>
    </section>
  );
}
