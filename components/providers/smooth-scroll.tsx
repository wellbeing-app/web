'use client';

import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Lenis from 'lenis';

type LenisRef = RefObject<Lenis | null>;

interface SmoothScrollContextValue {
  lenisRef: LenisRef;
  setEnabled: (enabled: boolean) => void;
}

const LenisContext = createContext<SmoothScrollContextValue>({
  lenisRef: { current: null },
  setEnabled: () => {},
});

export const useLenis = (): LenisRef => useContext(LenisContext).lenisRef;

export const useSmoothScrollControl = (): ((enabled: boolean) => void) =>
  useContext(LenisContext).setEnabled;

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [enabled, setEnabled] = useState(true);

  useLayoutEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;

    const desktopMq = window.matchMedia('(min-width: 768px)');
    const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    let instance: Lenis | null = null;
    let rafId = 0;

    const start = () => {
      if (instance) return;
      instance = new Lenis({
        duration: 0.9,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });
      lenisRef.current = instance;
      const raf = (time: number) => {
        instance?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      instance?.destroy();
      instance = null;
      lenisRef.current = null;
    };

    const sync = () => {
      if (desktopMq.matches && !reducedMotionMq.matches) start();
      else stop();
    };

    sync();
    desktopMq.addEventListener('change', sync);
    reducedMotionMq.addEventListener('change', sync);

    return () => {
      desktopMq.removeEventListener('change', sync);
      reducedMotionMq.removeEventListener('change', sync);
      stop();
    };
  }, [enabled]);

  const setEnabledCallback = useCallback((next: boolean) => {
    setEnabled(next);
  }, []);

  return (
    <LenisContext.Provider value={{ lenisRef, setEnabled: setEnabledCallback }}>
      {children}
    </LenisContext.Provider>
  );
}
