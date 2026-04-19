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

    const instance = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = instance;

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      lenisRef.current = null;
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
