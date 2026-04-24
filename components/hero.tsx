'use client';

import React, { useState } from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { motion } from 'framer-motion';

export function Hero() {
  const dict = useDictionary();
  const [mood, setMood] = useState(70);

  // Interpolate mouth path: Sad (0) -> Neutral (50) -> Happy (100)
  const mouthPath = `M 12 24 Q 20 ${16 + (mood / 100) * 16} 28 24`;
  
  // Interpolate color: Red (0) -> Yellow (50) -> Green (100)
  // Hue: 0 (red) to 130 (green)
  const color = `hsl(${(mood / 100) * 130}, 65%, 55%)`;

  return (
    <div className="relative gap-6 sm:gap-8 flex flex-col items-center py-0 overflow-hidden">
      <span className="inline-flex items-center gap-2 bg-secondary/30 border border-border/50 backdrop-blur-sm text-secondary-foreground text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-1.5 rounded-full transition-colors duration-300 animate-fade-in">
        <div className="relative w-1.5 h-1.5 shrink-0" aria-hidden="true">
          <div className="absolute inset-0 rounded-full bg-[#E09B5A] animate-ping-ring" />
          <div className="absolute inset-0 rounded-full bg-[#E09B5A]" />
        </div>
        {dict.home.badge}
      </span>

      <h1 className="text-(length:--text-hero-fluid) md:text-6xl leading-[1.1] md:leading-tight font-bold tracking-tight text-center transition-colors duration-300 animate-fade-in">
        {dict.home.title}
      </h1>

      <p className="text-(length:--text-base-fluid) md:text-lg text-muted-foreground max-w-lg text-center leading-relaxed transition-colors duration-300 animate-fade-in">
        {dict.home.description}
      </p>

      {/* Mood Slider Section */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 animate-fade-in pt-4">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            {dict.home.mood_label}
          </p>
          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" viewBox="0 0 40 40" className="drop-shadow-md overflow-visible">
              <defs>
                <radialGradient id="moodGradient" cx="30%" cy="30%" r="70%">
                  <motion.stop offset="0%" stopColor="white" stopOpacity="0.3" />
                  <motion.stop offset="100%" stopColor={color} animate={{ stopColor: color }} transition={{ duration: 0.2 }} />
                </radialGradient>
              </defs>
              
              {/* Blob Face */}
              <motion.path
                d="M20,4 C28,4 36,10 36,20 C36,30 28,36 20,36 C10,36 4,28 4,20 C4,10 12,4 20,4 Z"
                fill="url(#moodGradient)"
                animate={{ 
                  d: mood < 40 
                    ? "M20,5 C26,5 34,12 34,20 C34,28 26,35 20,35 C12,35 6,28 6,20 C6,12 14,5 20,5 Z" // Slightly droopy
                    : mood > 70
                    ? "M20,3 C30,3 37,12 37,20 C37,28 30,37 20,37 C10,37 3,28 3,20 C3,12 10,3 20,3 Z" // Bouncy/Full
                    : "M20,4 C28,4 36,10 36,20 C36,30 28,36 20,36 C10,36 4,28 4,20 C4,10 12,4 20,4 Z" 
                }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
              />
              
              {/* Eyes - Black arcs */}
              <g fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round">
                {/* Left Eye */}
                <motion.path 
                  d={mood < 40 ? "M13 18 L16 18" : "M12 17 Q 14.5 14.5 17 17"} 
                  animate={{ d: mood < 40 ? "M13 19 L16 19" : "M12 17 Q 14.5 14.5 17 17" }}
                />
                {/* Right Eye */}
                <motion.path 
                  d={mood < 40 ? "M24 18 L27 18" : "M23 17 Q 25.5 14.5 28 17"} 
                  animate={{ d: mood < 40 ? "M24 19 L27 19" : "M23 17 Q 25.5 14.5 28 17" }}
                />
              </g>
              
              {/* Mouth - Black arc */}
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
        </div>

        <div className="w-full px-4 flex flex-col gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-1.5 bg-secondary border border-border rounded-full appearance-none cursor-pointer accent-primary focus:outline-hidden"
            aria-label={dict.home.mood_label}
          />
          <div className="flex justify-between px-1 text-[10px] font-bold text-muted-foreground/60 tracking-tighter uppercase">
            <span>{dict.home.mood_low}</span>
            <span>{dict.home.mood_neutral}</span>
            <span>{dict.home.mood_great}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
