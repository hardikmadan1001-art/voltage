'use client';

import { motion } from 'framer-motion';
import { useAudio } from './AudioProvider';

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function AudioToggle() {
  const { status, playing, toggle, setPromptOpen } = useAudio();

  const handleClick = () => {
    if (status === 'pending') {
      setPromptOpen(true);
      return;
    }
    toggle();
  };

  const isLive = status === 'accepted' && playing;
  const label = status === 'pending' ? 'Sound off' : isLive ? 'Sound on' : 'Sound off';

  return (
    <button
      onClick={handleClick}
      data-cursor="hover"
      data-cursor-label={isLive ? 'Mute' : 'Play'}
      aria-label={label}
      aria-pressed={isLive}
      className="group relative flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.05]"
    >
      <span className="relative flex h-3 w-3 items-center justify-center">
        {/* Animated bars when playing */}
        <span className="flex items-end gap-[2px]">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={false}
              animate={
                isLive
                  ? { height: ['30%', '90%', '40%', '70%', '30%'] }
                  : { height: '30%' }
              }
              transition={
                isLive
                  ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }
                  : { duration: 0.4, ease }
              }
              className={`block w-[2px] rounded-full ${isLive ? 'bg-amber-glow' : 'bg-zinc-500'}`}
              style={{ height: '30%' }}
            />
          ))}
        </span>
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 transition-colors duration-500 group-hover:text-zinc-100">
        {label}
      </span>
    </button>
  );
}
