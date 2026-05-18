'use client';

import React, { useState } from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { motion } from 'framer-motion';
import { AppleHello } from '@/components/apple-hello';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLenis } from '@/components/providers/smooth-scroll';
import { scrollToPageTarget } from '@/lib/scroll-to-section';

export function HeroIntro() {
  const dict = useDictionary();
  const lenisRef = useLenis();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    scrollToPageTarget(target, lenisRef.current, { duration: 0.9, lock: true, force: true });
  };

  return (
    <div className="relative gap-3 xs:gap-4 @sm/card:gap-5 @lg/card:gap-8 flex flex-col items-center py-1 @lg/card:py-0">
      {/* Soft accent/sage drift blobs behind hero - no layout impact */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden dark:hidden"
      >
        <div className="absolute -top-12 -left-10 w-56 h-56 rounded-full bg-(--warmth-100)/60 blur-3xl animate-blob-drift" />
        <div
          className="absolute -bottom-16 -right-12 w-64 h-64 rounded-full bg-(--sage-100)/50 blur-3xl animate-blob-drift"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <span className="inline-flex items-center gap-2 bg-secondary/30 border border-border/50 backdrop-blur-sm text-secondary-foreground text-xs @lg/card:text-sm font-medium px-3 @lg/card:px-4 py-1 @lg/card:py-1.5 rounded-pill transition-colors duration-(--duration-soft) animate-fade-in">
        <div className="relative w-1.5 h-1.5 shrink-0" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-warmth-500 animate-ping-ring" />
          <div className="absolute inset-0 rounded-full bg-warmth-500" />
        </div>
        {dict.home.badge}
      </span>

      <AppleHello text={dict.home.title} />

      <p className="text-base md:text-lg text-foreground/80 max-w-2xl text-center leading-relaxed md:leading-loose transition-colors duration-(--duration-soft) animate-fade-in px-4">
        {dict.home.description}
      </p>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in w-full">
        <Link 
          href="#how" 
          onClick={(e) => scrollToSection(e, 'how')}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-pill font-medium transition-all duration-(--duration-soft) ease-out-soft hover:-translate-y-0.5 hover:shadow-(--shadow-mood-glow) hover:bg-primary/90 min-w-[200px] w-full sm:w-auto"
        >
          {dict.home.supportBtn}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link 
          href="#contact" 
          onClick={(e) => scrollToSection(e, 'contact')}
          className="inline-flex items-center justify-center gap-2 bg-secondary/30 text-secondary-foreground border border-border/50 px-6 py-3 rounded-pill font-medium transition-all duration-(--duration-soft) ease-out-soft hover:-translate-y-0.5 hover:bg-secondary/50 min-w-[200px] w-full sm:w-auto"
        >
          {dict.home.newsletterBtn}
        </Link>
      </div>
    </div>
  );
}

export function HeroMood() {
  const dict = useDictionary();
  const [mood, setMood] = useState(70);

  const safeMood = typeof mood === 'number' && !isNaN(mood) ? mood : 70;
  const mouthPath = `M 12 26 Q 20 ${22 + (safeMood / 100) * 10} 28 26`;
  const color = 'var(--warmth-500)';

  return (
    <div className="relative gap-5 xs:gap-6 @sm/card:gap-7 @lg/card:gap-8 flex flex-col items-center py-0">
      {/* Soft accent/sage drift blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden dark:hidden"
      >
        <div className="absolute -top-12 -left-10 w-56 h-56 rounded-full bg-(--warmth-100)/60 blur-3xl animate-blob-drift" />
        <div
          className="absolute -bottom-16 -right-12 w-64 h-64 rounded-full bg-(--sage-100)/50 blur-3xl animate-blob-drift"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <p className="text-(length:--text-lg-fluid) @lg/card:text-(length:--text-xl-fluid) text-muted-foreground text-center leading-relaxed transition-colors duration-(--duration-soft) animate-fade-in">
        {dict.home.mood_label}
      </p>

      {/* Mood Slider Section */}
      <div className="w-full max-w-[320px] @sm/card:max-w-sm animate-fade-in">
        <div className="glass border border-border/50 rounded-3xl p-4 @lg/card:p-5 shadow-(--shadow-pill)">
          <div className="flex flex-col @sm/card:flex-row items-center gap-4 @lg/card:gap-6">
            <div className="relative flex items-center justify-center shrink-0">
              <svg
                className="w-16 h-16 xs:w-20 xs:h-20 @lg/card:w-24 @lg/card:h-24 overflow-visible"
                viewBox="0 0 40 40"
              >
                <defs>
                  <radialGradient id="moodGradient" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} />
                  </radialGradient>
                </defs>

                {/* Blob Face */}
                <motion.path
                  d="M20,4 C29,4 36,11 36,20 C36,29 29,36 20,36 C11,36 4,29 4,20 C4,11 11,4 20,4 Z"
                  fill="url(#moodGradient)"
                  className="drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                  animate={{
                    d:
                      safeMood < 40
                        ? 'M20,10 C27,10 32,16 32,22 C32,28 27,34 20,34 C13,34 8,28 8,22 C8,16 13,10 20,10 Z'
                        : safeMood > 70
                          ? 'M20,2 C31,2 38,10 38,20 C38,30 31,38 20,38 C9,38 2,30 2,20 C2,10 9,2 20,2 Z'
                          : 'M20,4 C29,4 36,11 36,20 C36,29 29,36 20,36 C11,36 4,29 4,20 C4,11 11,4 20,4 Z',
                  }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                />

                {/* Eyes */}
                <g fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round">
                  <motion.path
                    d={safeMood < 40 ? 'M12 20 Q 14.5 22 17 20' : 'M12 17 Q 14.5 14.5 17 17'}
                    animate={{
                      d: safeMood < 40 ? 'M12 20 Q 14.5 22 17 20' : 'M12 17 Q 14.5 14.5 17 17',
                    }}
                    initial={false}
                  />
                  <motion.path
                    d={safeMood < 40 ? 'M23 20 Q 25.5 22 28 20' : 'M23 17 Q 25.5 14.5 28 17'}
                    animate={{
                      d: safeMood < 40 ? 'M23 20 Q 25.5 22 28 20' : 'M23 17 Q 25.5 14.5 28 17',
                    }}
                    initial={false}
                  />
                </g>

                {/* Mouth */}
                <motion.path
                  d={mouthPath}
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ d: mouthPath }}
                  transition={{ duration: 0.2 }}
                />
              </svg>
            </div>

            <div className="w-full flex flex-col gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="mood-slider w-full h-1.5 bg-secondary border border-border rounded-full appearance-none cursor-pointer accent-warmth-500 focus:outline-hidden"
                aria-label={dict.home.mood_label || 'Mood slider'}
              />
              <div className="flex justify-between px-1 text-[9px] font-bold text-muted-foreground tracking-tighter uppercase">
                <span>{dict.home.mood_low}</span>
                <span>{dict.home.mood_neutral}</span>
                <span>{dict.home.mood_great}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use HeroIntro or HeroMood instead */
export function Hero() {
  return <HeroIntro />;
}
