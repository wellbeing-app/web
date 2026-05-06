'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useLenis } from './providers/smooth-scroll';
import { useDictionary } from './providers/dictionary-provider';

const SECTION_IDS = [
  'home',
  'vision',
  'how',
  'features',
  'testimonials',
  'team',
  'developer',
  'faq',
  'trust',
  'contact',
] as const;

export function ScrollIndicator() {
  const dict = useDictionary();
  const [activeId, setActiveId] = useState<string>('home');
  const elementsCache = useRef<Record<string, HTMLElement>>({});
  const lenisRef = useLenis();

  const determineActiveSection = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Use the same logic as hash syncing for consistency
    const scroll = window.scrollY;
    const center = scroll + window.innerHeight / 2;

    let foundId: string = SECTION_IDS[0];
    for (const id of SECTION_IDS) {
      let element = elementsCache.current[id];
      if (!element) {
        const el = document.getElementById(id);
        if (el) {
          element = el;
          elementsCache.current[id] = el;
        }
      }

      if (element && element.offsetTop <= center) {
        foundId = id;
      }
    }

    setActiveId(foundId);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', determineActiveSection, { passive: true });
    // Run once on mount
    const timeoutId = setTimeout(determineActiveSection, 0);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', determineActiveSection);
    };
  }, [determineActiveSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(element, { offset: 0, duration: 1.4 });
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'home', label: dict.nav.nav_home },
    { id: 'vision', label: dict.nav.nav_vision },
    { id: 'how', label: dict.nav.nav_how },
    { id: 'features', label: dict.nav.nav_features },
    { id: 'testimonials', label: dict.nav.nav_testimonials },
    { id: 'team', label: dict.nav.nav_team },
    { id: 'developer', label: dict.nav.nav_developer },
    { id: 'faq', label: dict.nav.nav_faq },
    { id: 'trust', label: dict.trust.title },
    { id: 'contact', label: dict.nav.nav_contact },
  ];

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2 p-2 rounded-(--radius-pill) glass border border-border/50 shadow-(--shadow-pill)"
      aria-label="Progress navigation"
    >
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={`
            w-2 rounded-full transition-all duration-(--duration-soft) ease-(--ease-out-soft) cursor-pointer
            ${activeId === id ? 'h-5 bg-(--warmth-500)' : 'h-2 bg-foreground/20 hover:bg-(--warmth-500)/60'}
          `}
          title={label}
          aria-label={`Scroll to ${label}`}
          aria-current={activeId === id ? 'true' : undefined}
        />
      ))}
    </nav>
  );
}
