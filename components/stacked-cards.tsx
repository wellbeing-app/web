'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, useScroll, useTransform, type MotionStyle } from 'framer-motion';
import { ChevronDown, Maximize2 } from 'lucide-react';
import { Footer } from './footer';
import { useLenis } from './providers/smooth-scroll';
import { useDictionary } from './providers/dictionary-provider';
import { useRouter, useParams } from 'next/navigation';

interface CardData {
  id: string;
  component: React.ReactNode;
  href?: string;
}

interface StackedCardsProps {
  cards: CardData[];
}

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

function useIsDesktop(): boolean {
  const subscribe = useCallback((callback: () => void) => {
    const mq = window.matchMedia(DESKTOP_MEDIA_QUERY);
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  }, []);
  const getSnapshot = useCallback(() => window.matchMedia(DESKTOP_MEDIA_QUERY).matches, []);
  const getServerSnapshot = useCallback(() => true, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function FullscreenButton({ href }: { href: string }) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  return (
    <button
      type="button"
      onClick={() => router.push(`/${lang}${href}`)}
      className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 md:p-3 rounded-xl md:rounded-2xl glass border border-border/50 bg-secondary/20 text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer z-20"
      aria-label="Fullscreen"
    >
      <Maximize2 className="h-4 w-4 md:h-5 md:w-5" />
    </button>
  );
}

function CardPill({
  children,
  style,
  showFullscreen,
  href,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  showFullscreen?: boolean;
  href?: string;
}) {
  return (
    <div
      className="w-full max-w-200 h-[70vh] bg-card border border-border rounded-4xl p-10 md:p-16 flex flex-col items-center justify-center text-center overflow-y-auto no-scrollbar relative group/card"
      style={style}
    >
      {showFullscreen && href && <FullscreenButton href={href} />}
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
          <CardPill showFullscreen={index > 0} href={card.href}>
            {card.component}
          </CardPill>
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
      <CardPill href={card.href}>{card.component}</CardPill>
      <Footer />
    </section>
  );
}

function MobileSection({
  card,
  showFullscreen,
}: {
  card: CardData;
  showFullscreen: boolean;
}) {
  return (
    <section
      id={card.id}
      className="relative px-4 py-6 flex justify-center"
    >
      <div className="relative w-full bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
        {showFullscreen && card.href && <FullscreenButton href={card.href} />}
        {card.component}
      </div>
    </section>
  );
}

/**
 * StackedCards — Apple-style showcase on desktop, flat cards on mobile.
 *
 * Desktop (≥768px): each non-final section is 200vh tall with a sticky h-screen
 * stage. Card N is pinned for the first 100vh; during the second 100vh Card N+1
 * slides up and covers it while Card N scales/blurs/fades. Transforms are bound
 * directly to scroll — smoothness comes from Lenis at the input layer.
 *
 * Mobile (<768px): natural-height sections stacked vertically. No sticky cage,
 * no scale/blur animation. Fullscreen button still surfaces the dedicated page.
 */
export function StackedCards({ cards }: StackedCardsProps) {
  const dict = useDictionary();
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    const lastIndex = cards.length - 1;
    return (
      <div className="w-full flex flex-col">
        {cards.map((card, i) => (
          <MobileSection
            key={card.id}
            card={card}
            showFullscreen={i > 0 && i < lastIndex}
          />
        ))}
        <Footer />
      </div>
    );
  }

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
