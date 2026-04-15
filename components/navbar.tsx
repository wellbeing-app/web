"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function Navbar({ dict, lang }: { dict: { nav: Record<string, string> }; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.nav_home },
    { href: `/${lang}#vision`, label: dict.nav.nav_vision },
    { href: `/${lang}#features`, label: dict.nav.nav_features },
    { href: `/${lang}#team`, label: dict.nav.nav_team },
    { href: `/${lang}#contact`, label: dict.nav.nav_contact },
  ];

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[800px] mx-auto">
        <nav className="relative bg-card px-3 py-3 rounded-full flex items-center justify-between border border-border transition-colors duration-300 min-h-[64px]">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start pl-6">
            <Link href={`/${lang}`} className="text-xl font-bold tracking-tight transition-colors duration-300">
              Wellbeing.
            </Link>
          </div>

          {/* Center: Desktop Nav Links (Absolute Centered) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-full transition-colors duration-300 animate-fade-in z-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="h-9 inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 px-3 rounded-full hover:bg-secondary/50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Desktop Controls */}
          <div className="flex-1 flex justify-end pr-1">
            <div className="hidden md:flex items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-full transition-colors duration-300">
              <LanguageSwitcher lang={lang} />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-secondary/30 border border-border/50 backdrop-blur-sm rounded-full transition-colors duration-300">
              <LanguageSwitcher lang={lang} />
              <ThemeToggle />
            </div>
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[95%] z-40 md:hidden bg-card rounded-3xl p-6 border border-border flex flex-col items-center gap-4 animate-fade-in transition-colors duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg font-medium py-3 px-6 w-full text-center rounded-full bg-secondary/30 border border-border/50 backdrop-blur-sm hover:bg-secondary/50 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
