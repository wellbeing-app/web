'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AppleHello({ text }: { text: string }) {
  // Split into words to prevent awkward wrapping (e.g. dot on a new line)
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.5,
      },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      display: 'inline-block',
      transition: {
        duration: 0,
      },
    },
    hidden: {
      opacity: 0,
      display: 'none',
    },
  };

  return (
    <div className="relative inline-block overflow-visible px-1 py-1 md:py-2">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={container}
        className="font-sans text-(length:--text-hero-fluid) leading-tight font-bold text-center text-foreground"
      >
        {words.map((word, wordIndex) => {
          const wordChars = Array.from(word);
          return (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
              {wordChars.map((char, charIndex) => (
                <motion.span variants={child} key={charIndex}>
                  {char}
                </motion.span>
              ))}
              {/* Add space after word if not the last one */}
              {wordIndex < words.length - 1 && <motion.span variants={child}>&nbsp;</motion.span>}
            </span>
          );
        })}

        {/* Blinking typewriter cursor */}
        <span className="inline-block ml-0.5 w-[3px] h-[0.8em] bg-(--warmth-500) rounded-sm align-middle animate-cursor-blink" />
      </motion.h1>
    </div>
  );
}
