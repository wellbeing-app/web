'use client';

import React, { useState } from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { motion } from 'framer-motion';

export function Hero() {
  const dict = useDictionary();
  const [mood, setMood] = useState(70);

  // Interpolate mouth path: Sad (0) -> Neutral (50) -> Happy (100)
  const mouthPath = `M 12 26 Q 20 ${22 + (mood / 100) * 10} 28 26`;
  
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

      <p className="text-(length:--text-base-fluid) md:text-lg text-muted-foreground max-w-xl text-center leading-relaxed transition-colors duration-300 animate-fade-in">
        {dict.home.description}
      </p>

      {/* Mood Slider Section */}
      <div className="w-full max-w-[320px] md:max-w-sm animate-fade-in pt-2">
        <div className="glass border border-border/50 rounded-3xl p-4 md:p-5 shadow-[0_0_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative flex items-center justify-center shrink-0">
              <svg width="80" height="80" viewBox="0 0 40 40" className="overflow-visible">
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
                    d: mood < 40 
                      ? "M20,10 C27,10 32,16 32,22 C32,28 27,34 20,34 C13,34 8,28 8,22 C8,16 13,10 20,10 Z" 
                      : mood > 70
                      ? "M20,2 C31,2 38,10 38,20 C38,30 31,38 20,38 C9,38 2,30 2,20 C2,10 9,2 20,2 Z" 
                      : "M20,4 C29,4 36,11 36,20 C36,29 29,36 20,36 C11,36 4,29 4,20 C4,11 11,4 20,4 Z" 
                  }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                />
                
                {/* Eyes - Black arcs */}
                <g fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round">
                  <motion.path 
                    d={mood < 40 ? "M12 20 Q 14.5 22 17 20" : "M12 17 Q 14.5 14.5 17 17"} 
                    animate={{ d: mood < 40 ? "M12 20 Q 14.5 22 17 20" : "M12 17 Q 14.5 14.5 17 17" }}
                  />
                  <motion.path 
                    d={mood < 40 ? "M23 20 Q 25.5 22 28 20" : "M23 17 Q 25.5 14.5 28 17"} 
                    animate={{ d: mood < 40 ? "M23 20 Q 25.5 22 28 20" : "M23 17 Q 25.5 14.5 28 17" }}
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

            <div className="w-full flex flex-col gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-1.5 bg-secondary border border-border rounded-full appearance-none cursor-pointer accent-primary focus:outline-hidden"
                aria-label={dict.home.mood_label || 'Mood slider'}
              />
              <div className="flex justify-between px-1 text-[9px] font-bold text-muted-foreground/50 tracking-tighter uppercase">
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
