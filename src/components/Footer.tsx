'use client';

import { useState } from 'react';
import Magnetic from './Magnetic';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="relative w-full overflow-hidden bg-ink-900 pt-32">
      {/* CTA */}
      <section className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-graphite-900 to-ink-900 p-12 md:p-20">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-deep/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-glow/20 blur-[120px]" />
          <div className="relative">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
              Reserve — Open
            </div>
            <h2 className="mt-4 font-display text-[clamp(3rem,9vw,9rem)] font-light leading-[0.85] tracking-[-0.04em]">
              <span className="chrome-text">The next</span>
              <br />
              <span className="italic text-zinc-100">180 instruments.</span>
            </h2>
            <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              Reserve your serial number. Each AXIOM is built once, then
              signed. Lead time is approximately 14 weeks.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              {!submitted ? (
                <>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-glow focus:outline-none"
                  />
                  <Magnetic strength={0.3}>
                    <button type="submit" data-cursor="hover" className="btn-primary">
                      Reserve
                    </button>
                  </Magnetic>
                </>
              ) : (
                <div className="flex items-center gap-3 text-amber-glow">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-amber-glow" />
                  <span className="font-mono text-xs uppercase tracking-[0.3em]">
                    Thank you. We will be in touch.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer main */}
      <div className="relative mx-auto mt-32 max-w-[1600px] px-6 md:px-12">
        <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-20 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rotate-45 border border-amber-glow/60" />
                <div className="absolute inset-1.5 rotate-45 bg-gradient-to-br from-amber-glow to-amber-deep" />
              </div>
              <span className="font-display text-xl tracking-[0.3em] text-zinc-100">
                AXIOM
              </span>
            </div>
            <p className="mt-6 max-w-xs text-sm text-zinc-500">
              AXIOM is engineered in California. Every instrument is
              hand-assembled in the Ojai atelier. ©2026 AXIOM Instruments LLC.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {['IG', 'YT', 'SP', 'TW'].map((s) => (
                <a
                  key={s}
                  href="#"
                  data-cursor="hover"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 font-mono text-[10px] uppercase text-zinc-400 transition-colors hover:border-amber-glow hover:text-amber-glow"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
              Series
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              {['AXIOM 01', 'AXIOM 02', 'AXIOM 03', 'Bespoke'].map((s) => (
                <li key={s}>
                  <a href="#" data-cursor="hover" className="hover:text-zinc-100">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
              Studio
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              {['Materials', 'Atelier', 'Luthiers', 'Press'].map((s) => (
                <li key={s}>
                  <a href="#" data-cursor="hover" className="hover:text-zinc-100">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
              Support
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              {['Care', 'Warranty', 'Service', 'Contact'].map((s) => (
                <li key={s}>
                  <a href="#" data-cursor="hover" className="hover:text-zinc-100">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
              Atelier
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              1209 Maricopa Highway
              <br />
              Ojai, California 93023
              <br />
              +1 (805) 555-0142
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/5 py-8 md:flex-row md:items-center">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">
            <span>© 2026 AXIOM</span>
            <span>·</span>
            <a href="#" data-cursor="hover" className="hover:text-zinc-200">
              Privacy
            </a>
            <span>·</span>
            <a href="#" data-cursor="hover" className="hover:text-zinc-200">
              Terms
            </a>
            <span>·</span>
            <a href="#" data-cursor="hover" className="hover:text-zinc-200">
              Imprint
            </a>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-glow" />
            <span>Atelier — Open</span>
            <span className="ml-4">/</span>
            <span className="ml-4 text-zinc-500">Designed in California</span>
          </div>
        </div>
      </div>

      {/* Massive wordmark */}
      <div className="relative mt-12 overflow-hidden">
        <div className="flex whitespace-nowrap pb-8 font-display text-[18vw] leading-none tracking-[-0.04em] text-zinc-900">
          <span className="px-4">AXIOM</span>
          <span className="px-4 text-zinc-900/40">·</span>
          <span className="px-4 gradient-text">AXIOM</span>
          <span className="px-4 text-zinc-900/40">·</span>
          <span className="px-4">AXIOM</span>
        </div>
      </div>
    </footer>
  );
}
