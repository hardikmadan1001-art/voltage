'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let labelX = mouseX;
    let labelY = mouseY;

    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        label.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      label.style.opacity = '0';
    };

    const animate = () => {
      // Dot — snappy, almost instant
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;
      dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

      // Ring — smooth follow
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

      // Label — even softer follow
      labelX += (mouseX - labelX) * 0.1;
      labelY += (mouseY - labelY) * 0.1;
      label.style.transform = `translate(${labelX}px, ${labelY}px) translate(28px, 28px)`;

      requestAnimationFrame(animate);
    };
    animate();

    const setLabel = (text: string | null) => {
      if (!text) {
        label.dataset.text = '';
        label.style.opacity = visible ? '0' : label.style.opacity;
        return;
      }
      label.dataset.text = text;
      label.textContent = text;
      label.style.opacity = '1';
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor="hover"], input, label, [role="button"]');
      if (interactive) {
        ring.classList.add('hover');
        const explicit = interactive.getAttribute('data-cursor-label');
        if (explicit) setLabel(explicit);
      }
      // Contextual variants
      const drag = target.closest('[data-cursor="drag"]');
      if (drag) ring.classList.add('drag');
      const view = target.closest('[data-cursor="view"]');
      if (view) {
        ring.classList.add('view');
        setLabel('View');
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"], input, label, [role="button"]')) {
        ring.classList.remove('hover');
        setLabel(null);
      }
      if (target.closest('[data-cursor="drag"]')) ring.classList.remove('drag');
      if (target.closest('[data-cursor="view"]')) {
        ring.classList.remove('view');
        setLabel(null);
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden style={{ opacity: 0 }} />
      <div ref={dotRef} className="cursor-dot" aria-hidden style={{ opacity: 0 }} />
      <span
        ref={labelRef}
        className="cursor-label"
        aria-hidden
        style={{ opacity: 0 }}
      />
    </>
  );
}
