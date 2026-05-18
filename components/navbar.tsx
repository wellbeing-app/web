'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { MobileMenu } from '@/components/mobile-menu';
import { useLenis } from '@/components/providers/smooth-scroll';
import { scrollToPageTarget } from '@/lib/scroll-to-section';

export function Navbar({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dict = useDictionary();
  const lenisRef = useLenis();
  const pathname = usePathname();

  const closeMenu = useCallback(() => setIsOpen(false), []);

  const navLinks = [
    { href: `/${lang}#how`, label: dict.nav.nav_how },
    { href: `/${lang}#whatLumiIsNot`, label: dict.nav.nav_safety },
    { href: `/${lang}#forPartners`, label: dict.nav.nav_schools },
    { href: `/${lang}#faq`, label: dict.nav.nav_faq },
    { href: `/${lang}#contact`, label: dict.nav.nav_contact },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const [path, hash] = href.split('#');

    // Check if we're already on the path we're linking to
    if (pathname === path) {
      const target = hash ? document.getElementById(hash) : 0;
      if (target !== null) {
        e.preventDefault();
        scrollToPageTarget(target, lenisRef.current, {
          duration: 0.6,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          lock: true,
          force: true,
        });
      }
    }
  };

  return (
    <>
      <header className="fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-200 lg:max-w-4xl mx-auto top-safe">
        <nav className="relative bg-card border border-border/70 px-2 xs:px-3 py-3 rounded-pill flex items-center justify-between transition-colors duration-(--duration-soft) min-h-16 shadow-(--shadow-pill)">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start pl-3 xs:pl-5">
            <Link
              href={`/${lang}`}
              className="text-xl font-semibold tracking-tight transition-colors duration-(--duration-soft)"
              onClick={(e) => handleScroll(e, `/${lang}`)}
            >
              Lumi.
            </Link>
          </div>

          {/* Center: Desktop Nav Links (Absolute Centered) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-pill transition-colors duration-(--duration-soft) animate-fade-in z-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="h-9 inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-(--duration-soft) px-3 rounded-pill hover:bg-(--warmth-100)/40"
                onClick={(e) => handleScroll(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Desktop Controls */}
          <div className="flex-1 flex justify-end pr-1">
            <div className="hidden md:flex items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-pill transition-colors duration-(--duration-soft)">
              <LanguageSwitcher lang={lang} />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center gap-1.5 xs:gap-2">
            <div className="flex items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-pill transition-colors duration-(--duration-soft)">
              <LanguageSwitcher lang={lang} />
              <ThemeToggle />
            </div>
            <button
              ref={buttonRef}
              className="p-2 xs:p-2.5 rounded-pill hover:bg-(--warmth-100)/40 transition-colors duration-200"
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-haspopup="menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={isOpen}
        onClose={closeMenu}
        triggerRef={buttonRef}
        labelledBy="mobile-menu-label"
      >
        <h2 id="mobile-menu-label" className="sr-only">
          {dict.nav.nav_vision}
        </h2>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-lg font-medium py-3 px-6 w-full text-center rounded-full bg-secondary/30 border border-border/50 backdrop-blur-sm hover:bg-secondary/50 transition-colors duration-300"
            onClick={(e) => {
              handleScroll(e, link.href);
              closeMenu();
            }}
          >
            {link.label}
          </Link>
        ))}
      </MobileMenu>
    </>
  );
}
