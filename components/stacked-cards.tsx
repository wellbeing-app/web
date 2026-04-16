'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Footer } from './footer';

interface CardData {
  id: string;
  component: React.ReactNode;
}

interface StackedCardsProps {
  cards: CardData[];
}

/**
 * Card Component
 * 
 * Handles individual card animations using Framer Motion.
 * Scales, blurs, and fades out based on its own scroll progress relative to the viewport.
 */
function Card({ 
  card, 
  index, 
  totalCards 
}: { 
  card: CardData; 
  index: number; 
  totalCards: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLast = index === totalCards - 1;

  // Track the card's own scroll progress
  // "start start": When the top of the container hits the top of the viewport
  // "end start": When the bottom of the container hits the top of the viewport
  // This interval corresponds exactly to the time this card is 'active' or being stacked upon.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80, // Slightly softer for better stability
    damping: 35,   // Higher damping to prevent oscillation/blinking
    restDelta: 0.0001
  });

  // Scale, blur, and opacity transformations
  // The first card (index 0) is already at the top, so we keep it solid longer (until 60%)
  // to prevent it from 'stalling' or hiding prematurely compared to cards that enter from below.
  const range = index === 0 ? [0, 0.6, 1] : [0, 0.1, 1];
  
  const scale = useTransform(smoothProgress, range, [1, 1, 0.95]);
  const blur = useTransform(smoothProgress, range, [0, 0, 4]);
  const opacity = useTransform(smoothProgress, range, [1, 1, 0.8]);

  // Define the string-based blur value at the top level to avoid conditional hook calls
  const blurFilter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <div
      ref={containerRef}
      id={card.id}
      className={`relative ${isLast ? 'h-dvh mb-0' : 'h-screen'}`}
      style={{ zIndex: index }}
    >
      <motion.div
        initial={false}
        className="sticky top-[15vh] h-[70vh] w-full max-w-200 mx-auto flex items-center justify-center will-change-transform rounded-4xl"
        style={{
          scale: isLast ? 1 : scale,
          filter: isLast ? 'none' : blurFilter,
          opacity: isLast ? 1 : opacity,
        }}
      >
        <div className="bg-card border border-border w-full h-full flex flex-col items-center justify-center p-10 md:p-16 rounded-4xl text-center shadow-none overflow-y-auto no-scrollbar">
          {card.component}
        </div>
      </motion.div>
      {isLast && <Footer />}
    </div>
  );
}

/**
 * StackedCards Component
 * 
 * Implements the Apple-style Rolodex stacking effect using Framer Motion.
 */
export function StackedCards({ cards }: StackedCardsProps) {
  return (
    <div className="w-full px-4">
      {cards.map((card, i) => (
        <Card 
          key={card.id} 
          card={card} 
          index={i} 
          totalCards={cards.length} 
        />
      ))}
    </div>
  );
}
