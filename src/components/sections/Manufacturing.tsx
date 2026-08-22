'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    code: 'M-01',
    title: 'Design',
    duration: '6 weeks',
    description:
      'A single concept, refined across 400 iterations. The form is sculpted in CAD, validated through FEA, then physically modeled in foam.',
    detail: ['Concept sketches', 'CAD modeling', 'FEA validation', '1:1 foam model'],
  },
  {
    code: 'M-02',
    title: 'Prototyping',
    duration: '4 weeks',
    description:
      'First physical articles are 3D-printed, then machined from billet aluminum. Each prototype is played, broken, redesigned.',
    detail: ['SLA prototypes', 'Billet aluminum', 'Play testing', 'Failure analysis'],
  },
  {
    code: 'M-03',
    title: 'Testing',
    duration: '8 weeks',
    description:
      'Climate chambers. Drop tests. Stress cycles. 12,000 hours of accelerated play testing. Nothing ships until it survives.',
    detail: ['-30°C to +80°C', '10,000 drop cycles', '1M vibration cycles', 'Climate humidity'],
  },
  {
    code: 'M-04',
    title: 'Assembly',
    duration: '41 hours',
    description:
      'A single master luthier. A single instrument. 41 hours of focused hand-labor in the AXIOM atelier, with no interruption.',
    detail: ['1 luthier', 'No interruption', '41 hours', 'Hand voicing'],
  },
  {
    code: 'M-05',
    title: 'Inspection',
    duration: '6 hours',
    description:
      '250+ precision checks. From neck angle to intonation across all 22 frets, every variable is measured, recorded, and signed.',
    detail: ['250+ checkpoints', 'Signed by luthier', 'Spectrum analysis', 'Play test'],
  },
];

export default function Manufacturing() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.mfg-step');
      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
        gsap.fromTo(
          step.querySelector('.mfg-inner'),
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 75%' },
          }
        );
      });
      // Progress bar
      gsap.to('.mfg-progress-fill', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 1,
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="manufacturing"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-amber-deep/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            09 / Manufacturing
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">The atelier</span>
              <br />
              <span className="italic text-zinc-100">in 5 chapters.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              From first sketch to final inspection, every AXIOM passes through
              five chapters. Documented, signed, and recorded. The atelier in
              Ojai, California.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div ref={trackRef} className="relative z-10 mx-auto mt-20 max-w-[1600px] px-6 md:px-12">
        <div className="relative grid grid-cols-1 gap-0 md:grid-cols-12">
          {/* Progress rail */}
          <div className="absolute left-0 top-0 hidden h-full w-px bg-zinc-900 md:left-[8.33%] md:block">
            <div className="mfg-progress-fill h-0 w-px bg-gradient-to-b from-amber-glow via-amber-deep to-amber-glow" />
            {/* Step markers */}
            {steps.map((s, i) => (
              <div
                key={s.code}
                className="absolute -left-1.5 h-3 w-3 rounded-full border border-amber-glow/40 transition-all"
                style={{ top: `${(i / (steps.length - 1)) * 100}%` }}
              >
                <div
                  className={`h-full w-full rounded-full transition-all ${
                    i <= active ? 'bg-amber-glow scale-100' : 'bg-transparent scale-50'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Mobile progress */}
          <div className="absolute left-6 top-0 h-full w-px bg-zinc-900 md:hidden">
            <div className="mfg-progress-fill h-0 w-px bg-gradient-to-b from-amber-glow to-amber-deep" />
          </div>

          {steps.map((s, i) => (
            <div
              key={s.code}
              className={`mfg-step col-span-12 md:col-span-12 ${i % 2 === 1 ? 'md:ml-auto md:w-10/12' : 'md:mr-auto md:w-10/12'} pl-12 md:pl-0`}
            >
              <div className="mfg-inner grid grid-cols-1 gap-6 border-b border-white/5 py-12 md:grid-cols-12 md:gap-8 md:py-20">
                <div className="md:col-span-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                    {s.code}
                  </div>
                  <div className="mt-2 font-display text-6xl font-light text-zinc-100 md:text-8xl">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                    {s.duration}
                  </div>
                </div>
                <div className="md:col-span-6">
                  <h3 className="font-display text-4xl font-light text-zinc-100 md:text-6xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-pretty text-base leading-relaxed text-zinc-400">
                    {s.description}
                  </p>
                </div>
                <div className="md:col-span-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                    Detail
                  </div>
                  <ul className="mt-3 space-y-2">
                    {s.detail.map((d) => (
                      <li
                        key={d}
                        className="flex items-center gap-2 text-sm text-zinc-300"
                      >
                        <span className="h-1 w-1 rounded-full bg-amber-glow" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atelier stats */}
      <div className="relative z-10 mx-auto mt-32 max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[
            { v: '4,200', l: 'Sq. ft atelier' },
            { v: '12', l: 'Master luthiers' },
            { v: '180', l: 'Instruments / year' },
            { v: '98%', l: 'Hand-completed' },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-6">
              <div className="font-display text-5xl text-amber-glow">{s.v}</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-400">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
