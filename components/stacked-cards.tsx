'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionStyle } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Footer } from './footer';
import { useLenis } from './providers/smooth-scroll';
import { useDictionary } from './providers/dictionary-provider';

interface CardData {
  id: string;
  component: React.ReactNode;
}

interface StackedCardsProps {
  cards: CardData[];
}

function CardPill({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="w-full max-w-200 h-[70vh] bg-card border border-border rounded-4xl p-10 md:p-16 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar"
      style={style}
    >
      {children}
    </div>
  );
}

function NextSlideButton({
  targetId,
  label,
  style,
}: {
  targetId: string;
  label: string;
  style: MotionStyle;
}) {
  const lenisRef = useLenis();
  const onClick = () => {
    const el = document.getElementById(targetId);
    if (!el || !lenisRef.current) return;
    lenisRef.current.scrollTo(el, { duration: 0.9, lock: true, force: true });
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={style}
      className="flex-1 w-full flex items-center justify-center group will-change-transform cursor-pointer"
    >
      <span className="inline-flex items-center gap-2 rounded-full glass border border-border/50 bg-secondary/30 text-secondary-foreground px-4 py-1.5 text-sm font-medium leading-none transition group-hover:bg-secondary/50">
        <span className="leading-none">{label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 translate-y-px" aria-hidden="true" />
      </span>
    </motion.button>
  );
}

function StackingCard({
  card,
  index,
  nextId,
  label,
}: {
  card: CardData;
  index: number;
  nextId: string;
  label: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const filter = useTransform(scrollYProgress, (p) => `blur(${p * 6}px)`);

  return (
    <section
      ref={sectionRef}
      id={card.id}
      className="relative h-[200vh]"
      style={{ zIndex: index }}
    >
      <div className="sticky top-0 h-screen flex flex-col items-center px-4 will-change-transform">
        <div className="flex-1" />
        <motion.div
          className="w-full max-w-200 h-[70vh] flex items-center justify-center will-change-transform"
          style={{ scale, opacity, filter }}
        >
          <CardPill>{card.component}</CardPill>
        </motion.div>
        <NextSlideButton targetId={nextId} label={label} style={{ opacity, filter }} />
      </div>
    </section>
  );
}

function FinalCard({ card, index }: { card: CardData; index: number }) {
  return (
    <section
      id={card.id}
      className="relative h-dvh flex items-center justify-center px-4"
      style={{ zIndex: index }}
    >
      <CardPill>{card.component}</CardPill>
      <Footer />
    </section>
  );
}

/**
 * StackedCards — Apple-style showcase.
 *
 * Each non-final section is 200vh tall with a sticky h-screen stage inside.
 * Card N is pinned for the first 100vh of its section; during the second 100vh
 * Card N+1 (higher zIndex) slides up from below and covers it, while Card N
 * scales/blurs/fades to recede. Transforms are bound directly to scroll — the
 * smoothness comes from Lenis at the input layer, not from framer-motion spring
 * damping, so the animation tracks the scroll position exactly.
 */
export function StackedCards({ cards }: StackedCardsProps) {
  const dict = useDictionary();
  return (
    <div className="w-full">
      {cards.map((card, i) => {
        const isLast = i === cards.length - 1;
        if (isLast) {
          return <FinalCard key={card.id} card={card} index={i} />;
        }
        return (
          <StackingCard
            key={card.id}
            card={card}
            index={i}
            nextId={cards[i + 1].id}
            label={dict.stackedCards.nextSlide}
          />
        );
      })}
    </div>
  );
}
