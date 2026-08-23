'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type SplitMode = 'chars' | 'words' | 'lines';

type Props = {
  text: string;
  mode?: SplitMode;
  className?: string;
  immediate?: boolean;
  start?: string;
  stagger?: number;
  from?: 'bottom' | 'top' | 'left' | 'right';
  duration?: number;
  delay?: number;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';
};

/**
 * SplitText — wraps text in spans per char/word/line and reveals them with a
 * masked slide-up animation triggered on scroll. Mirrors the cinematic
 * per-letter reveals used throughout the reference experience.
 */
export default function SplitText({
  text,
  mode = 'words',
  className = '',
  immediate = false,
  start = 'top 85%',
  stagger = 0.04,
  from = 'bottom',
  duration = 1.1,
  delay = 0,
  as: Tag = 'span',
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(root.querySelectorAll('.st-unit'), { clearProps: 'all', opacity: 1, y: 0, x: 0 });
      return;
    }

    const units = root.querySelectorAll<HTMLElement>('.st-unit');

    // Text must never depend on a scroll callback to become readable. This
    // keeps the page robust when a browser restores a deep scroll position.
    gsap.set(units, { y: 0, x: 0, opacity: 1 });

    const animConfig = {
      y: 0,
      x: 0,
      duration,
      stagger,
      ease: 'expo.out',
      delay,
    };

    if (immediate) {
      gsap.fromTo(
        units,
        {
          y: from === 'bottom' || from === 'top' ? '110%' : 0,
          x: from === 'left' || from === 'right' ? (from === 'left' ? -40 : 40) : 0,
          opacity: 0,
        },
        { ...animConfig, opacity: 1 }
      );
      return;
    }
    // Keep non-hero copy visible-first. Scroll animation is a progressive
    // enhancement, never a condition for seeing the content.
    return;
  }, [text, mode, immediate, start, stagger, from, duration, delay]);

  const renderUnits = () => {
    if (mode === 'chars') {
      return Array.from(text).map((ch, i) => (
        <span key={i} className="st-mask" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span className="st-unit" style={{ display: 'inline-block', willChange: 'transform' }}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        </span>
      ));
    }
    if (mode === 'words') {
      return text.split(' ').map((w, i) => (
        <span key={i} className="st-mask" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span className="st-unit" style={{ display: 'inline-block', willChange: 'transform' }}>
            {w}
            {i < text.split(' ').length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ));
    }
    return text.split('\n').map((line, i) => (
      <span key={i} className="st-mask" style={{ display: 'block', overflow: 'hidden' }}>
        <span className="st-unit" style={{ display: 'block', willChange: 'transform' }}>
          {line}
        </span>
      </span>
    ));
  };

  const TagAny = Tag as any;
  return (
    <TagAny ref={rootRef} className={className} aria-label={text}>
      {renderUnits()}
    </TagAny>
  );
}
