'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { OrgChart } from '@/components/org-chart';
import { team, flattenPeople } from '@/lib/team';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function Team({ showChart = false }: { showChart?: boolean }) {
  const dict = useDictionary();
  const people = flattenPeople(team);

  const [currentIndex, setCurrentActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentActiveIndex(
        (prevIndex) => (prevIndex + newDirection + people.length) % people.length
      );
    },
    [people.length]
  );

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate]);

  if (showChart) {
    return <OrgChart />;
  }

  const currentMember = people[currentIndex];
  const initials = currentMember.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="relative space-y-4 md:space-y-6 flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in">
      <div className="space-y-1 text-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.team.title}
        </h2>
      </div>

      <div className="relative w-full flex items-center justify-center min-h-[240px] md:min-h-[320px]">
        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-0 z-20 p-2 rounded-full glass border border-border/50 hover:bg-secondary/40 transition-colors hidden sm:block"
          aria-label="Previous member"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="relative w-full overflow-hidden flex justify-center py-8 -my-8">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentMember.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="flex flex-col items-center gap-3 md:gap-5 p-4 md:p-8 rounded-(--radius-card) bg-card border border-border/50 shadow-(--shadow-card) w-[260px] md:w-[320px]"
            >
              {currentMember.image ? (
                <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-(--warmth-100)/80 ring-offset-4 ring-offset-card bg-white shadow-sm">
                  <Image
                    src={currentMember.image}
                    alt={currentMember.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80px, 112px"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-(--warmth-100) text-(--warmth-700) flex items-center justify-center font-bold text-xl md:text-2xl shadow-inner">
                  {initials}
                </div>
              )}

              <div className="text-center space-y-0.5">
                <h3 className="font-bold text-base md:text-xl text-foreground">
                  {currentMember.name}
                </h3>
                <p className="text-(--warmth-700) font-medium text-xs md:text-sm">
                  {dict.team.roles[currentMember.id]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={() => paginate(1)}
          className="absolute right-0 z-20 p-2 rounded-full glass border border-border/50 hover:bg-secondary/40 transition-colors hidden sm:block"
          aria-label="Next member"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots Indicator — Matching the site's vertical/horizontal pill navigation style */}
      <div className="flex items-center gap-2 p-1.5 rounded-full glass border border-border/40 shadow-sm">
        {people.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentActiveIndex(index);
            }}
            className={`
              h-2 rounded-full transition-all duration-(--duration-soft) ease-(--ease-out-soft) cursor-pointer
              ${
                index === currentIndex
                  ? 'w-6 bg-(--warmth-500)'
                  : 'w-2 bg-foreground/20 hover:bg-(--warmth-500)/60'
              }
            `}
            aria-label={`Go to member ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : undefined}
          />
        ))}
      </div>
    </div>
  );
}
