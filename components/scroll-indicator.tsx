'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useLenis } from './providers/smooth-scroll';
import { useDictionary } from './providers/dictionary-provider';
import { getHeaderScrollOffset, getSectionTop, scrollToPageTarget } from '@/lib/scroll-to-section';

const SECTION_IDS = [
  'home',
  'problem',
  'how',
  'features',
  'whatLumiIsNot',
  'trust',
  'forPartners',
  'faq',
  'contact',
] as const;

export function ScrollIndicator() {
  const dict = useDictionary();
  const [activeId, setActiveId] = useState<string>('home');
  const elementsCache = useRef<Record<string, HTMLElement>>({});
  const lenisRef = useLenis();

  const determineActiveSection = useCallback(() => {
    if (typeof window === 'undefined') return;

    const navOffset = getHeaderScrollOffset();
    const activationPoint = window.scrollY + navOffset + (window.innerHeight - navOffset) * 0.35;

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

      if (element && getSectionTop(element) <= activationPoint) {
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

    scrollToPageTarget(element, lenisRef.current, { duration: 1.4 });
  };

  const sections = [
    { id: 'home', label: dict.nav.nav_home },
    { id: 'problem', label: dict.problem.title },
    { id: 'how', label: dict.nav.nav_how },
    { id: 'features', label: dict.features.title },
    { id: 'whatLumiIsNot', label: dict.whatLumiIsNot.title },
    { id: 'trust', label: dict.trust.title },
    { id: 'forPartners', label: dict.forPartners.title },
    { id: 'faq', label: dict.nav.nav_faq },
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
