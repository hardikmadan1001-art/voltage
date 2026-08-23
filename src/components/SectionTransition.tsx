'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  /** CSS selector for the sections that should trigger the transition. */
  sectionSelector?: string;
};

/**
 * SectionTransition — renders a fixed, full-viewport overlay that wipes across
 * the screen each time a top-level section comes into view. The wipe uses a
 * curved mask for a cinematic, "ribbon" feel rather than a hard rectangle.
 *
 * This is subtle on purpose: it's a punctuation mark, not the main attraction.
 */
export default function SectionTransition({
  sectionSelector = 'main > section',
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const overlay = overlayRef.current;
    const accent = accentRef.current;
    if (!overlay || !accent) return;

    const sections = gsap.utils.toArray<HTMLElement>(sectionSelector);
    if (!sections.length) return;

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section, i) => {
      if (i === 0) return; // skip hero on first paint

      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        overlay,
        { yPercent: 101 },
        { yPercent: 0, duration: 0.5, ease: 'expo.inOut' }
      ).to(overlay, {
        yPercent: -101,
        duration: 0.6,
        ease: 'expo.inOut',
        delay: 0.05,
      });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 90%',
        once: true,
        onEnter: () => tl.play(0),
      });
      triggers.push(trigger);

      // Accent flash — a brief amber glow that pulses at the moment of reveal.
      const accentTl = gsap.timeline({ paused: true });
      accentTl.fromTo(
        accent,
        { opacity: 0, scaleY: 0 },
        {
          opacity: 0.6,
          scaleY: 1,
          duration: 0.25,
          ease: 'expo.out',
          yoyo: true,
          repeat: 1,
        }
      );
      const accentTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => accentTl.play(0),
      });
      triggers.push(accentTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [sectionSelector]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[55]"
        style={{
          transform: 'translateY(101%)',
          background:
            'linear-gradient(180deg, #050505 0%, #0a0a0a 60%, #050505 100%)',
        }}
      >
        {/* Ribbed vertical accent */}
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-glow/30 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 mx-auto h-px w-1/3 -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-glow/40 to-transparent" />
        {/* Section label placeholder — set via data attr by each section */}
      </div>
      <div
        ref={accentRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-1/2 z-[56] mx-auto h-24 w-px"
        style={{
          transformOrigin: 'center',
          background:
            'linear-gradient(180deg, transparent, #ff8a1c 30%, #ff5a00 50%, #ff8a1c 70%, transparent)',
          boxShadow: '0 0 30px rgba(255,138,28,0.45)',
        }}
      />
    </>
  );
}
