"use client";

import { useEffect, useRef } from "react";
import { Footer } from "./footer";

interface Card {
  id: string;
  component: React.ReactNode;
}

interface StackedCardsProps {
  cards: Card[];
}

/**
 * StackedCards Component - Static Footer Version
 * 
 * Implements the Rolodex stacking effect and integrates a static 
 * footer into the viewport-height space of the final section.
 */
export function StackedCards({ cards }: StackedCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const vh = window.innerHeight;
      const stickyTop = vh * 0.15;
      const isAtTop = window.scrollY < 10;

      cards.forEach((card, i) => {
        const currentCardEl = document.getElementById(card.id);
        if (!currentCardEl) return;

        if (isAtTop) {
          currentCardEl.style.transform = `scale(1)`;
          currentCardEl.style.filter = `none`;
          currentCardEl.style.opacity = `1`;
          return;
        }

        if (i < cards.length - 1) {
          const nextCardEl = document.getElementById(cards[i + 1].id);
          
          if (nextCardEl) {
            const nextRect = nextCardEl.getBoundingClientRect();
            
            const startPoint = vh * 0.6; 
            const endPoint = stickyTop;
            
            const progress = Math.max(0, Math.min(1, (startPoint - nextRect.top) / (startPoint - endPoint)));
            
            const scale = 1 - (progress * 0.05);
            const blur = progress * 2;
            
            currentCardEl.style.transform = `scale(${scale})`;
            currentCardEl.style.filter = `blur(${blur}px)`;
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const timer = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [cards]);

  return (
    <div ref={containerRef} className="w-full px-4">
      {cards.map((card, i) => {
        const isLast = i === cards.length - 1;
        return (
          <div
            key={card.id}
            /* 
               The last card uses h-screen to ensure that when centered (15vh top), 
               the bottom gap (15vh) is fully visible, containing the static footer.
            */
            className={`relative ${isLast ? "h-dvh mb-0" : "h-[120vh] mb-32"}`}
            style={{ zIndex: i }}
          >
            <div
              id={card.id}
              className="sticky top-[15vh] h-[70vh] w-full max-w-[800px] mx-auto flex items-center justify-center will-change-transform rounded-4xl"
            >
              <div className="bg-card border border-border w-full h-full flex flex-col items-center justify-center p-10 md:p-16 rounded-4xl text-center theme-transition overflow-y-auto no-scrollbar">
                {card.component}
              </div>
            </div>
            {/* The Footer is now part of the last section's ending state */}
            {isLast && <Footer />}
          </div>
        );
      })}
    </div>
  );
}
