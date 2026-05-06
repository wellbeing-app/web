'use client';

import React, { useState } from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { motion } from 'framer-motion';

export function Hero() {
  const dict = useDictionary();
  const [mood, setMood] = useState(70);

  const safeMood = typeof mood === 'number' && !isNaN(mood) ? mood : 70;
  const mouthPath = `M 12 26 Q 20 ${22 + (safeMood / 100) * 10} 28 26`;
  const color = `hsl(${(mood / 100) * 130}, 65%, 55%)`;

  return (
    <div className="relative gap-5 xs:gap-6 @sm/card:gap-7 @lg/card:gap-8 flex flex-col items-center py-0 overflow-hidden">
      {/* Soft warm/sage drift blobs behind hero — additive friendliness, no layout impact */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-12 -left-10 w-56 h-56 rounded-full bg-(--warmth-100)/60 blur-3xl animate-blob-drift" />
        <div
          className="absolute -bottom-16 -right-12 w-64 h-64 rounded-full bg-(--sage-100)/50 blur-3xl animate-blob-drift"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <span className="inline-flex items-center gap-2 bg-secondary/30 border border-border/50 backdrop-blur-sm text-secondary-foreground text-xs @lg/card:text-sm font-medium px-3 @lg/card:px-4 py-1 @lg/card:py-1.5 rounded-(--radius-pill) transition-colors duration-(--duration-soft) animate-fade-in">
        <div className="relative w-1.5 h-1.5 shrink-0" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-(--warmth-500) animate-ping-ring" />
          <div className="absolute inset-0 rounded-full bg-(--warmth-500)" />
        </div>
        {dict.home.badge}
      </span>

      <h1 className="text-(length:--text-hero-fluid) leading-[1.1] @lg/card:leading-tight font-bold tracking-tight text-center transition-colors duration-(--duration-soft) animate-fade-in">
        {dict.home.title}
      </h1>

      <p className="text-(length:--text-base-fluid) @lg/card:text-(length:--text-lg-fluid) text-muted-foreground max-w-xl text-center leading-relaxed transition-colors duration-(--duration-soft) animate-fade-in">
        {dict.home.description}
      </p>

      {/* Mood Slider Section */}
      <div className="w-full max-w-[320px] @sm/card:max-w-sm animate-fade-in pt-2">
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
                className="mood-slider w-full h-1.5 bg-secondary border border-border rounded-full appearance-none cursor-pointer accent-(--warmth-500) focus:outline-hidden"
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
