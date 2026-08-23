'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollProgress — thin, premium progress rail fixed at the top of the viewport.
 * Fills with an amber gradient driven by total page scroll. Includes a small
 * "label" that updates its percentage as you move down the page.
 */
export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fill = fillRef.current;
    const pct = pctRef.current;
    if (!fill || !pct) return;

    const obj = { v: 0 };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const target = self.progress;
        gsap.to(obj, {
          v: target,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: () => {
            fill.style.transform = `scaleX(${obj.v})`;
            pct.textContent = `${Math.round(obj.v * 100)
              .toString()
              .padStart(2, '0')}%`;
          },
        });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none select-none">
      <div className="relative h-[2px] w-full bg-white/[0.04]">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-left"
          style={{
            transform: 'scaleX(0)',
            background:
              'linear-gradient(90deg, #ff5a00 0%, #ff8a1c 50%, #d4af6a 100%)',
            boxShadow: '0 0 12px rgba(255,138,28,0.55)',
          }}
        />
      </div>
      <div className="absolute right-3 top-2 hidden md:flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
        <span ref={pctRef}>00%</span>
        <span className="text-amber-glow">/</span>
        <span>scroll</span>
      </div>
    </div>
  );
}
