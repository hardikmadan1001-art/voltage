'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  trackTitle: string;
  artistName: string;
  visible: boolean;
  onClose: () => void;
};

export default function ArtistPlayer({ trackTitle, artistName, visible, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [pickupMode, setPickupMode] = useState<'bridge' | 'neck'>('bridge');

  // Initialize audio on play
  const initAudio = useCallback(async () => {
    if (!audioRef.current) {
      const el = new Audio();
      el.crossOrigin = 'anonymous';
      el.preload = 'metadata';
      audioRef.current = el;

      // Create Web Audio context for visualization
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.82;
      }
    }

    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    // Connect source if not already
    if (audioRef.current && audioCtxRef.current && analyserRef.current && !sourceRef.current) {
      try {
        sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      } catch {
        // Source already connected
      }
    }
  }, []);

  // Radial frequency visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = Math.min(w, h) * 0.25;

      let frequencyData: Uint8Array | null = null;
      if (analyserRef.current) {
        frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(frequencyData as Uint8Array<ArrayBuffer>);
      }

      const time = performance.now() * 0.001;

      // Draw radial frequency bars
      if (frequencyData && playing) {
        const barCount = 128;
        const angleStep = (Math.PI * 2) / barCount;

        for (let i = 0; i < barCount; i++) {
          const dataIdx = Math.floor((i / barCount) * frequencyData.length * 0.5);
          const value = frequencyData[dataIdx] / 255;
          const barHeight = value * baseRadius * 1.2;
          const angle = i * angleStep - Math.PI / 2;

          const x1 = cx + Math.cos(angle) * baseRadius;
          const y1 = cy + Math.sin(angle) * baseRadius;
          const x2 = cx + Math.cos(angle) * (baseRadius + barHeight);
          const y2 = cy + Math.sin(angle) * (baseRadius + barHeight);

          const hue = 20 + (i / barCount) * 30;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `hsla(${hue}, 90%, 55%, ${0.4 + value * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Inner glow ring
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius - 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(cx, cy, baseRadius * 0.5, cx, cy, baseRadius);
        gradient.addColorStop(0, 'rgba(255, 138, 28, 0.08)');
        gradient.addColorStop(1, 'rgba(255, 138, 28, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Outer decorative ring
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = playing ? 'rgba(255, 138, 28, 0.3)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Rotating accent dot
      if (playing) {
        const dotAngle = time * 0.8;
        const dotX = cx + Math.cos(dotAngle) * baseRadius;
        const dotY = cy + Math.sin(dotAngle) * baseRadius;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff8a1c';
        ctx.fill();
        ctx.shadowColor = '#ff8a1c';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Center text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (!playing) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.font = '11px monospace';
        ctx.letterSpacing = '3px';
        ctx.fillText('TAP TO PLAY', cx, cy);
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Track progress
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      setProgress(el.currentTime);
      setDuration(el.duration || 0);
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onTime);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onTime);
    };
  }, []);

  const togglePlay = async () => {
    await initAudio();
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      // In demo mode, use oscillators to generate tones
      if (!audioRef.current.src || audioRef.current.src === window.location.href) {
        // Generate a simple tone for demo
        if (audioCtxRef.current && analyserRef.current) {
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          osc.type = pickupMode === 'bridge' ? 'sawtooth' : 'sine';
          osc.frequency.value = 220;
          gain.gain.value = 0.15;
          osc.connect(gain);
          gain.connect(analyserRef.current);

          if (pickupMode === 'bridge') {
            osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, audioCtxRef.current.currentTime + 3);
          } else {
            osc.frequency.setValueAtTime(220, audioCtxRef.current.currentTime);
            osc.frequency.exponentialRampToValueAtTime(165, audioCtxRef.current.currentTime + 4);
          }
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 4);
          osc.start();
          osc.stop(audioCtxRef.current.currentTime + 4);
        }
        setPlaying(true);
        setTimeout(() => setPlaying(false), 4000);
        return;
      }
      await audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="artist-player"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 z-[110] w-[calc(100%-3rem)] max-w-xl -translate-x-1/2"
        >
          <div className="glass-strong overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)]">
            {/* Visualizer + controls */}
            <div className="flex items-center gap-4 p-4">
              {/* Radial visualizer */}
              <div className="relative h-20 w-20 flex-shrink-0">
                <canvas ref={canvasRef} className="h-full w-full" />
              </div>

              {/* Track info + play */}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-amber-glow">
                  Now playing
                </div>
                <div className="mt-1 truncate font-display text-lg text-zinc-100">
                  {trackTitle}
                </div>
                <div className="mt-0.5 truncate text-xs text-zinc-500">
                  {artistName}
                </div>

                {/* Progress bar */}
                <div
                  className="mt-3 h-1 cursor-pointer overflow-hidden rounded-full bg-zinc-800"
                  onClick={handleScrub}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber-deep to-amber-glow transition-all"
                    style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[9px] text-zinc-600">
                  <span>{formatTime(progress)}</span>
                  <span>{duration ? formatTime(duration) : '0:00'}</span>
                </div>
              </div>

              {/* Play button */}
              <button
                onClick={togglePlay}
                data-cursor="hover"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-amber-glow/30 bg-amber-glow/10 text-amber-glow transition-all hover:bg-amber-glow/20"
              >
                {playing ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <rect x="3" y="2" width="4" height="12" rx="1" />
                    <rect x="9" y="2" width="4" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4 2.5v11l10-5.5z" />
                  </svg>
                )}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                data-cursor="hover"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-colors hover:border-white/30 hover:text-zinc-100"
              >
                ✕
              </button>
            </div>

            {/* A/B Pickup toggle */}
            <div className="flex items-center gap-3 border-t border-white/5 px-4 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                Pickup comparison
              </span>
              <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5">
                <button
                  onClick={() => setPickupMode('bridge')}
                  className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-all ${
                    pickupMode === 'bridge'
                      ? 'bg-amber-glow/15 text-amber-glow'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Bridge
                </button>
                <button
                  onClick={() => setPickupMode('neck')}
                  className={`rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] transition-all ${
                    pickupMode === 'neck'
                      ? 'bg-amber-glow/15 text-amber-glow'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Neck
                </button>
              </div>
              <span className="ml-auto font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-700">
                {pickupMode === 'bridge' ? 'AX-Custom A2 Bridge' : 'AX-Custom A2 Neck'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
