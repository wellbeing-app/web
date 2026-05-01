'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useLenis } from './providers/smooth-scroll';
import { useDictionary } from './providers/dictionary-provider';

const SECTION_IDS = ['home', 'vision', 'features', 'team', 'developer', 'contact'] as const;

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
    { id: 'features', label: dict.nav.nav_features },
    { id: 'team', label: dict.nav.nav_team },
    { id: 'developer', label: dict.nav.nav_developer },
    { id: 'contact', label: dict.nav.nav_contact },
  ];

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
