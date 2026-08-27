'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '../Magnetic';
import BuilderCanvasLazy from '../three/BuilderCanvasLazy';

type Config = {
  body: string;
  finish: string;
  hardware: string;
  pickups: string;
  neck: string;
  inlay: string;
};

const options = {
  body: [
    { id: 'carbon', name: 'Forged Carbon', price: 0, color: '#1a1a20' },
    { id: 'maple', name: 'Figured Maple', price: 2400, color: '#5a3a1a' },
    { id: 'walnut', name: 'Claro Walnut', price: 3200, color: '#3a1f0a' },
  ],
  finish: [
    { id: 'matte', name: 'Stealth Matte', price: 0, color: '#0a0a0a' },
    { id: 'satin', name: 'Burnt Satin', price: 600, color: '#3a1f0a' },
    { id: 'gloss', name: 'Mirror Gloss', price: 1400, color: '#f4f4f5' },
    { id: 'pearl', name: 'Aurora Pearl', price: 2200, color: '#e4d4b8' },
  ],
  hardware: [
    { id: 'chrome', name: 'Mirror Chrome', price: 0, color: '#e4e4e7' },
    { id: 'gold', name: 'Champagne Gold', price: 1800, color: '#d4af6a' },
    { id: 'black', name: 'Stealth Black', price: 800, color: '#1a1a1e' },
    { id: 'titanium', name: 'Brushed Titanium', price: 2400, color: '#a0a0a8' },
  ],
  pickups: [
    { id: 'a2', name: 'AX-Custom A2', price: 0, desc: 'Vintage voicing' },
    { id: 'a2hot', name: 'AX-Custom A2 Hot', price: 600, desc: 'High output' },
    { id: 'p90', name: 'AX-P90', price: 900, desc: 'Single coil warmth' },
    { id: 'bespoke', name: 'Bespoke Voice', price: 3200, desc: 'Hand-tuned to you' },
  ],
  neck: [
    { id: 'maple', name: 'Roasted Maple', price: 0, color: '#6a4a2a' },
    { id: 'mahogany', name: 'Honduran Mahogany', price: 800, color: '#3a1f1a' },
    { id: 'wenge', name: 'Wenge', price: 1400, color: '#2a1a10' },
  ],
  inlay: [
    { id: 'pearl', name: 'Mother of Pearl', price: 0, color: '#f4f4f5' },
    { id: 'gold', name: 'Solid Gold', price: 4800, color: '#d4af6a' },
    { id: 'diamond', name: 'Black Diamond', price: 12400, color: '#1a1a1e' },
  ],
};

const basePrice = 14800;

// Available serial numbers for reservation
const serialNumbers = Array.from({ length: 10 }, (_, i) => ({
  number: i + 42,
  total: 180,
  available: i !== 3 && i !== 7, // some are reserved
}));

export default function Builder() {
  const [config, setConfig] = useState<Config>({
    body: 'carbon',
    finish: 'matte',
    hardware: 'chrome',
    pickups: 'a2',
    neck: 'maple',
    inlay: 'pearl',
  });
  const [wiping, setWiping] = useState(false);
  const [wipeColor, setWipeColor] = useState('#0a0a0a');
  const [reservationOpen, setReservationOpen] = useState(false);
  const [selectedSerial, setSelectedSerial] = useState<number | null>(null);

  const total = useMemo(() => {
    return (
      basePrice +
      options.body.find((o) => o.id === config.body)!.price +
      options.finish.find((o) => o.id === config.finish)!.price +
      options.hardware.find((o) => o.id === config.hardware)!.price +
      options.pickups.find((o) => o.id === config.pickups)!.price +
      options.neck.find((o) => o.id === config.neck)!.price +
      options.inlay.find((o) => o.id === config.inlay)!.price
    );
  }, [config]);

  const get = <K extends keyof Config>(k: K) =>
    (options[k] as { id: string; name: string; color?: string; price: number }[]).find(
      (o) => o.id === config[k]
    )!;

  // Laser wipe transition when changing finish
  const handleOptionChange = useCallback((key: keyof Config, value: string) => {
    if (key === 'finish') {
      const newFinish = options.finish.find((o) => o.id === value);
      setWipeColor(newFinish?.color || '#0a0a0a');
      setWiping(true);
      setTimeout(() => {
        setConfig((c) => ({ ...c, [key]: value }));
        setTimeout(() => setWiping(false), 600);
      }, 100);
    } else {
      setConfig((c) => ({ ...c, [key]: value }));
    }
  }, []);

  return (
    <section
      id="builder"
      className="relative w-full overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] rounded-full bg-amber-deep/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="flex items-baseline gap-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
            06 / Custom
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-amber-glow/30 to-transparent" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.9] tracking-[-0.03em]">
              <span className="chrome-text">Make it</span>{' '}
              <span className="italic gradient-text">yours.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-12">
            <p className="max-w-md text-pretty text-base leading-relaxed text-zinc-400">
              Every AXIOM can be configured to your spec — or commissioned
              bespoke. Configure your instrument below and reserve your
              serial number.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Preview */}
          <div className="lg:col-span-7">
            <div className="sticky top-32 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-graphite-800 to-ink-900">
              <div className="relative aspect-[4/5] md:aspect-[16/12]">
                {/* 3D Canvas */}
                <div className="absolute inset-0">
                  <BuilderCanvasLazy
                    className="h-full w-full"
                    materialConfig={{
                      bodyMaterial: config.body,
                      bodyFinish: config.finish,
                      hardwareFinish: config.hardware,
                    }}
                  />
                </div>

                {/* Laser wipe overlay */}
                <AnimatePresence>
                  {wiping && (
                    <motion.div
                      initial={{ clipPath: 'inset(0 100% 0 0)' }}
                      animate={{ clipPath: 'inset(0 0% 0 0)' }}
                      exit={{ clipPath: 'inset(0 0% 0 100%)' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 z-20"
                    >
                      {/* Laser line leading the wipe */}
                      <motion.div
                        initial={{ left: '100%' }}
                        animate={{ left: '0%' }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-0 bottom-0 w-1 bg-amber-glow shadow-[0_0_20px_#ff8a1c,0_0_60px_#ff8a1c]"
                        style={{ zIndex: 30 }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: wipeColor }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top labels */}
                <div className="absolute left-6 top-6 z-10 md:left-10 md:top-10">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                    Live 3D preview
                  </div>
                  <div className="mt-2 font-display text-3xl text-zinc-100">
                    AXIOM 01 — Bespoke
                  </div>
                </div>

                {/* Price tag */}
                <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between md:left-10 md:right-10">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                      Configured total
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={total}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1 font-display text-5xl text-amber-glow md:text-6xl"
                      >
                        ${total.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                      Lead time
                    </div>
                    <div className="mt-1 font-display text-2xl text-zinc-100">
                      14 weeks
                    </div>
                  </div>
                </div>

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-t from-ink-900/80 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8 lg:col-span-5">
            {(
              [
                { key: 'body' as const, label: 'Body' },
                { key: 'finish' as const, label: 'Finish' },
                { key: 'hardware' as const, label: 'Hardware' },
                { key: 'pickups' as const, label: 'Pickups' },
                { key: 'neck' as const, label: 'Neck' },
                { key: 'inlay' as const, label: 'Inlay' },
              ]
            ).map(({ key, label }) => (
              <div key={key} className="rounded-2xl border border-white/5 p-5">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                    {label}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                    {get(key).name}
                    {(get(key) as { price: number }).price > 0
                      ? ` +$${(get(key) as { price: number }).price.toLocaleString()}`
                      : ''}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {options[key].map((o) => (
                    <button
                      key={o.id}
                      onClick={() => handleOptionChange(key, o.id)}
                      data-cursor="hover"
                      className={`group flex items-center gap-3 rounded-full border px-4 py-2 text-xs transition-all ${
                        config[key] === o.id
                          ? 'border-amber-glow bg-amber-glow/10 text-amber-glow'
                          : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-100'
                      }`}
                    >
                      {(o as { color?: string }).color && (
                        <span
                          className="h-3 w-3 rounded-full border border-white/20"
                          style={{ background: (o as { color?: string }).color }}
                        />
                      )}
                      <span className="uppercase tracking-wider">{o.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Magnetic strength={0.3}>
                <button
                  data-cursor="hover"
                  className="btn-primary"
                  onClick={() => setReservationOpen(true)}
                >
                  Reserve Serial
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button data-cursor="hover" className="btn-ghost">
                  Save configuration
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {reservationOpen && (
          <motion.div
            key="reservation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] flex items-center justify-center px-4"
            onClick={() => setReservationOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0a0a0c]/95 p-8 shadow-[0_40px_160px_-20px_rgba(255,138,28,0.2)]"
            >
              {/* Decorative corners */}
              <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-amber-glow/40" />
              <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-amber-glow/40" />
              <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-amber-glow/40" />
              <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-amber-glow/40" />

              {/* Close button */}
              <button
                onClick={() => setReservationOpen(false)}
                className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-colors hover:border-amber-glow/50 hover:text-amber-glow"
              >
                ✕
              </button>

              {/* Header */}
              <div className="mb-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                  Limited Edition — 180 Instruments
                </div>
                <h3 className="mt-3 font-display text-4xl font-light tracking-[-0.03em] text-zinc-100 md:text-5xl">
                  Reserve Your Serial
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Each AXIOM bears a unique serial number, engraved into the headstock and registered on the certificate of authenticity.
                </p>
              </div>

              {/* Serial number grid */}
              <div className="mb-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-4">
                  Available Serial Numbers
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {serialNumbers.map((s) => (
                    <button
                      key={s.number}
                      disabled={!s.available}
                      onClick={() => setSelectedSerial(s.number)}
                      data-cursor={s.available ? 'hover' : undefined}
                      className={`group relative overflow-hidden rounded-xl border p-4 text-center transition-all ${
                        !s.available
                          ? 'border-white/5 bg-white/[0.02] opacity-30 cursor-not-allowed'
                          : selectedSerial === s.number
                          ? 'border-amber-glow bg-amber-glow/10 shadow-[0_0_30px_rgba(255,138,28,0.15)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                      }`}
                    >
                      <div className="font-display text-lg text-zinc-100">
                        N° {String(s.number).padStart(4, '0')}
                      </div>
                      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-600">
                        / 0{s.total}
                      </div>
                      {!s.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-ink-900/80">
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                            Reserved
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Certificate preview */}
              <div className="mb-8 rounded-2xl border border-white/5 bg-gradient-to-br from-graphite-800 to-ink-900 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                      Certificate of Authenticity
                    </div>
                    <div className="mt-3 font-display text-2xl text-zinc-100">
                      AXIOM Series 01
                    </div>
                    {selectedSerial && (
                      <div className="mt-1 font-display text-3xl text-amber-glow">
                        N° {String(selectedSerial).padStart(4, '0')} / 0180
                      </div>
                    )}
                  </div>
                  <div className="h-16 w-16 rounded-full border border-amber-glow/30 bg-gradient-to-br from-amber-glow/20 to-amber-deep/10 flex items-center justify-center">
                    <span className="font-display text-lg text-amber-glow">✦</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Configuration</div>
                    <div className="mt-1 text-sm text-zinc-300">{get('body').name} / {get('finish').name}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Hardware</div>
                    <div className="mt-1 text-sm text-zinc-300">{get('hardware').name}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Pickups</div>
                    <div className="mt-1 text-sm text-zinc-300">{get('pickups').name}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">Neck / Inlay</div>
                    <div className="mt-1 text-sm text-zinc-300">{get('neck').name} / {get('inlay').name}</div>
                  </div>
                </div>
              </div>

              {/* Deposit checkout */}
              <div className="rounded-2xl border border-amber-glow/20 bg-gradient-to-br from-amber-glow/5 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-glow">
                      Reservation Deposit
                    </div>
                    <div className="mt-2 font-display text-4xl text-zinc-100">
                      $2,500
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Fully refundable · Applied to final price
                    </div>
                  </div>
                  <Magnetic strength={0.2}>
                    <button
                      data-cursor="hover"
                      disabled={!selectedSerial}
                      className={`btn-primary ${!selectedSerial ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {selectedSerial ? 'Checkout' : 'Select a serial'}
                      <span className="ml-3 text-lg leading-none">↗</span>
                    </button>
                  </Magnetic>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
