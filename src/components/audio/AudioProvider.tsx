'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = 'axiom.audio.consent.v1';

type ConsentStatus = 'pending' | 'accepted' | 'declined';

type AudioContextValue = {
  status: ConsentStatus;
  playing: boolean;
  promptOpen: boolean;
  setPromptOpen: (open: boolean) => void;
  accept: () => void;
  decline: () => void;
  toggle: () => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

const TRACK_SRC = '/audio/let-it-happen.mp3';
const TARGET_VOLUME = 0.35;
const FADE_MS = 900;

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [playing, setPlaying] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Read prior consent once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'accepted' || saved === 'declined') {
        setStatus(saved);
        if (saved === 'declined') setPromptOpen(false);
      } else {
        // First-time visitor: ask after the loader has had a moment to finish.
        const t = setTimeout(() => setPromptOpen(true), 3000);
        return () => clearTimeout(t);
      }
    } catch {
      setPromptOpen(true);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Lazily create the audio element. Created only when needed so SSR is safe.
  const ensureAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioRef.current) {
      const el = new Audio(TRACK_SRC);
      el.loop = true;
      el.preload = 'auto';
      el.crossOrigin = 'anonymous';
      el.volume = 0;
      audioRef.current = el;
    }
    return audioRef.current;
  }, []);

  const clearFade = () => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const fadeTo = useCallback(
    (target: number, onDone?: () => void) => {
      const el = ensureAudio();
      if (!el) return;
      clearFade();
      const startVolume = el.volume;
      const startedAt = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - startedAt) / FADE_MS);
        const eased = 1 - Math.pow(1 - t, 3);
        el.volume = startVolume + (target - startVolume) * eased;
        if (t >= 1) {
          clearFade();
          onDone?.();
        }
      };
      tick();
      fadeRef.current = window.setInterval(tick, 40);
    },
    [ensureAudio]
  );

  const startPlayback = useCallback(async () => {
    const el = ensureAudio();
    if (!el) return;
    try {
      el.muted = false;
      await el.play();
      setPlaying(true);
      fadeTo(TARGET_VOLUME);
    } catch {
      el.muted = true;
      setPlaying(false);
    }
  }, [ensureAudio, fadeTo]);

  const stopPlayback = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    fadeTo(0, () => {
      el.pause();
      setPlaying(false);
    });
  }, [fadeTo]);

  const accept = useCallback(() => {
    setStatus('accepted');
    setPromptOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    void startPlayback();
  }, [startPlayback]);

  const decline = useCallback(() => {
    setStatus('declined');
    setPromptOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  // If the user previously accepted, resume playback automatically.
  useEffect(() => {
    if (!hydrated) return;
    if (status === 'accepted' && !playing) {
      void startPlayback();
    }
  }, [hydrated, status, playing, startPlayback]);

  // Mute toggle from anywhere (e.g. nav button).
  const toggle = useCallback(() => {
    if (status === 'pending') {
      setPromptOpen(true);
      return;
    }
    if (status === 'accepted') {
      if (playing) stopPlayback();
      else void startPlayback();
    } else {
      // Declined — give them a second chance without re-asking permanently.
      setStatus('accepted');
      try {
        window.localStorage.setItem(STORAGE_KEY, 'accepted');
      } catch {}
      void startPlayback();
    }
  }, [status, playing, stopPlayback, startPlayback]);

  // Pause when the tab is hidden to be polite.
  useEffect(() => {
    const onVis = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) {
        if (!el.paused) {
          el.dataset.wasPlaying = '1';
          el.pause();
        }
      } else if (el.dataset.wasPlaying === '1' && status === 'accepted') {
        delete el.dataset.wasPlaying;
        void el.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [status]);

  const value = useMemo<AudioContextValue>(
    () => ({ status, playing, promptOpen, setPromptOpen, accept, decline, toggle }),
    [status, playing, promptOpen, accept, decline, toggle]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>');
  return ctx;
}
