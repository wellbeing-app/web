'use client';

import { ReactNode, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * SmoothScroll Provider
 * 
 * Initialized Lenis for inertial/momentum scrolling.
 * Follows Apple's cinematic presentation style.
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const rafHandle = useRef<number | null>(null);

  useLayoutEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      instance.raf(time);
      rafHandle.current = requestAnimationFrame(raf);
    }

    rafHandle.current = requestAnimationFrame(raf);

    return () => {
      if (rafHandle.current) cancelAnimationFrame(rafHandle.current);
      instance.destroy();
    };
  }, []);

  return <>{children}</>;
}
