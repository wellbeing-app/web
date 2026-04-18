'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from './providers/smooth-scroll';

interface SectionSnapProps {
  sectionIds: readonly string[];
  duration?: number;
}

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const WHEEL_THRESHOLD = 4;
const WHEEL_COOLDOWN_MS = 400;
const KEY_COOLDOWN_MS = 80;
const TOUCH_THRESHOLD_PX = 40;
const CHAINED_DURATION = 0.55;

export function SectionSnap({ sectionIds, duration = 0.9 }: SectionSnapProps) {
  const lenisRef = useLenis();
  const targetIndexRef = useRef<number | null>(null);
  const lastAdvanceAtRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const getTops = () =>
      sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return el.getBoundingClientRect().top + window.scrollY;
        })
        .filter((top): top is number => top !== null)
        .sort((a, b) => a - b);

    const currentIndex = (tops: number[]) => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] <= y) idx = i;
      }
      return idx;
    };

    const scrollToIndex = (idx: number, tops: number[]) => {
      const lenis = lenisRef.current;
      if (!lenis) return;
      const chained = targetIndexRef.current !== null;
      targetIndexRef.current = idx;
      lastAdvanceAtRef.current = performance.now();
      lenis.scrollTo(tops[idx], {
        duration: chained ? CHAINED_DURATION : duration,
        lock: true,
        force: true,
        onComplete: () => {
          if (targetIndexRef.current === idx) targetIndexRef.current = null;
        },
      });
    };

    const advance = (direction: 1 | -1, cooldownMs: number) => {
      if (performance.now() - lastAdvanceAtRef.current < cooldownMs) return;
      const tops = getTops();
      if (tops.length === 0) return;
      const base = targetIndexRef.current ?? currentIndex(tops);
      const target = Math.max(0, Math.min(tops.length - 1, base + direction));
      if (target === base) return;
      scrollToIndex(target, tops);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      e.preventDefault();
      e.stopPropagation();
      advance(e.deltaY > 0 ? 1 : -1, WHEEL_COOLDOWN_MS);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        advance(1, KEY_COOLDOWN_MS);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        advance(-1, KEY_COOLDOWN_MS);
      } else if (e.key === 'Home') {
        e.preventDefault();
        const tops = getTops();
        if (tops.length > 0) scrollToIndex(0, tops);
      } else if (e.key === 'End') {
        e.preventDefault();
        const tops = getTops();
        if (tops.length > 0) scrollToIndex(tops.length - 1, tops);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      const dy = touchStartYRef.current - (e.touches[0]?.clientY ?? touchStartYRef.current);
      if (Math.abs(dy) < TOUCH_THRESHOLD_PX) return;
      touchStartYRef.current = null;
      e.preventDefault();
      advance(dy > 0 ? 1 : -1, 0);
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDesktop, sectionIds, duration, lenisRef]);

  return null;
}
