'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useAudio } from './AudioProvider';

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function AudioConsentModal() {
  const { promptOpen, accept, decline, status } = useAudio();

  return (
    <AnimatePresence>
      {promptOpen && status === 'pending' && (
        <motion.div
          key="audio-consent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease } }}
          transition={{ duration: 0.6, ease }}
          className="fixed inset-0 z-[120] flex items-center justify-center px-6"
          aria-modal="true"
          role="dialog"
          aria-labelledby="audio-consent-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={decline}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.97, filter: 'blur(8px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-900/90 p-8 shadow-[0_30px_120px_-20px_rgba(255,138,28,0.25)]"
          >
            {/* Decorative corners */}
            <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-amber-glow/60" />
            <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-amber-glow/60" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-amber-glow/60" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-amber-glow/60" />

            <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
              <span>AXIOM / Sound</span>
              <span className="flex items-center gap-2 text-amber-glow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-glow/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-glow" />
                </span>
                Live mix
              </span>
            </div>

            <h2
              id="audio-consent-title"
              className="font-display text-3xl font-light leading-tight tracking-[-0.03em] text-zinc-100"
            >
              Experience with sound?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              AXIOM plays an ambient loop to pair with the visuals. You can mute it any time from the top bar.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                onClick={decline}
                data-cursor="hover"
                className="btn-ghost w-full justify-center px-6 py-3 text-[11px] sm:w-auto"
              >
                Continue silently
              </button>
              <button
                onClick={accept}
                data-cursor="hover"
                data-cursor-label="Play"
                className="btn-primary w-full justify-center px-6 py-3 text-[11px] sm:w-auto"
              >
                Turn on sound
              </button>
            </div>

            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
              Your choice is saved on this device
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
