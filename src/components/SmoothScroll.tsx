'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const lenis = new Lenis({
      duration: reduce ? 0 : 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduce,
      wheelMultiplier: isMobile ? 0.9 : 1,
      touchMultiplier: 1.6,
      lerp: reduce ? 1 : 0.1,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    // Bridge Lenis → ScrollTrigger so all ScrollTriggers stay in sync.
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Re-measure triggers after fonts/images settle.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('load', onLoad);
      lenis.destroy();
      window.__lenis = undefined;
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

