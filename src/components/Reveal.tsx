'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: ReactNode;
  /** Trigger start position. */
  start?: string;
  /** Distance the masked content travels from (in px). */
  distance?: number;
  /** Direction the content slides in from. */
  from?: 'bottom' | 'top' | 'left' | 'right';
  /** Duration in seconds. */
  duration?: number;
  /** Delay in seconds. */
  delay?: number;
  className?: string;
  /** Whether to wrap in a full-bleed mask (good for full-width sections). */
  fullBleed?: boolean;
};

/**
 * Reveal — wraps content in a mask that wipes it into view from a chosen
 * direction. Use for big surfaces (images, panels, sections) where
 * SplitText would be too granular.
 */
export default function Reveal({
  children,
  start = 'top 85%',
  distance = 60,
  from = 'bottom',
  duration = 1.2,
  delay = 0,
  className = '',
  fullBleed = false,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const inner = innerRef.current;
    if (!root || !inner) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(inner, { clearProps: 'all' });
      return;
    }

    const initial = {
      y: from === 'bottom' ? distance : from === 'top' ? -distance : 0,
      x: from === 'left' ? distance : from === 'right' ? -distance : 0,
    };

    gsap.set(inner, initial);
    const trigger = ScrollTrigger.create({
      trigger: root,
      start,
      once: true,
      onEnter: () => {
        gsap.to(inner, {
          y: 0,
          x: 0,
          duration,
          delay,
          ease: 'expo.out',
        });
      },
    });

    return () => trigger.kill();
  }, [start, distance, from, duration, delay]);

  const maskStyle: React.CSSProperties = fullBleed
    ? { display: 'block', overflow: 'hidden' }
    : { display: 'block', overflow: 'hidden' };

  return (
    <div ref={rootRef} className={className} style={maskStyle}>
      <div ref={innerRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
