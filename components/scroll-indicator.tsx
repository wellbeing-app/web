'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'vision', label: 'Vision' },
  { id: 'features', label: 'Features' },
  { id: 'team', label: 'Team' },
  { id: 'contact', label: 'Contact' },
];

/**
 * ScrollIndicator Component
 *
 * Uses position-based detection to handle sticky stacked cards.
 * Real-time tracking via scroll events ensures accuracy during transitions.
 */
export function ScrollIndicator() {
  const [activeId, setActiveId] = useState<string>('home');
  const elementsCache = useRef<Record<string, HTMLElement>>({});

  const determineActiveSection = useCallback(() => {
    // Safety check for server-side or early renders
    if (typeof window === 'undefined') return;

    // Force 'home' when at the very top
    if (window.scrollY < 50) {
      setActiveId('home');
      return;
    }

    // Trigger Point: We pick a point in the viewport where transitions feel most natural.
    // Using half the viewport height ensures the dot switches as the next card centers.
    const triggerPoint = window.innerHeight / 2;
    let foundId = sections[0].id;

    for (const section of sections) {
      let element = elementsCache.current[section.id];
      if (!element) {
        const el = document.getElementById(section.id);
        if (el) {
          element = el;
          elementsCache.current[section.id] = el;
        }
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        // The active section is the LAST section that has reached or passed the trigger point.
        if (rect.top <= triggerPoint) {
          foundId = section.id;
        }
      }
    }

    setActiveId(foundId);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', determineActiveSection, { passive: true });

    // Use requestAnimationFrame for the initial check to avoid synchronous setState inside useEffect,
    // which fixes the 'react-hooks/set-state-in-effect' ESLint warning.
    const rafId = requestAnimationFrame(determineActiveSection);

    // Secondary check after layout settles
    const timer = setTimeout(determineActiveSection, 100);

    return () => {
      window.removeEventListener('scroll', determineActiveSection);
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [determineActiveSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Use scrollTo for precise control over sticky offsets
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate position: We want the element's top to land at the top of the viewport
    // minus any scroll-margin or sticky padding.
    // For this design, roughly 50px-100px offset works well for centering the content.
    const targetY = rect.top + scrollTop - 100;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2 p-2 rounded-full glass border border-border/50"
      aria-label="Progress navigation"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={`
            w-2 rounded-full transition-all duration-300 ease-out cursor-pointer
            ${activeId === id ? 'h-5 bg-foreground' : 'h-2 bg-foreground/20 hover:bg-foreground/50'}
          `}
          title={label}
          aria-label={`Scroll to ${label}`}
          aria-current={activeId === id ? 'true' : undefined}
        />
      ))}
    </nav>
  );
}
