'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSmoothScrollControl } from '@/components/providers/smooth-scroll';
import { trapFocus } from '@/lib/focus-trap';

interface ExpandedCardProps {
  children: React.ReactNode;
  layoutId: string;
  label?: string;
}

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 };

export function ExpandedCard({ children, label = 'Expanded view' }: ExpandedCardProps) {
  const router = useRouter();
  const setLenisEnabled = useSmoothScrollControl();
  const [open, setOpen] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    setLenisEnabled(false);

    const releaseTrap = trapFocus(panel, { onEscape: handleClose });

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      setLenisEnabled(true);
      releaseTrap();
    };
  }, [setLenisEnabled, handleClose]);

  return (
    <AnimatePresence onExitComplete={() => router.back()}>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: 'easeOut' }}
            onClick={handleClose}
            aria-hidden="true"
            className="absolute inset-0 bg-background/80 backdrop-blur-xl cursor-zoom-out"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.88 }}
            className="relative w-full max-w-5xl h-auto max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-4rem)] bg-card border border-border rounded-4xl shadow-2xl overflow-y-auto no-scrollbar overscroll-contain"
            transition={reduce ? { duration: 0 } : SPRING}
          >
            {/* Desktop close — sticky top-right inside the scrolling panel */}
            <button
              onClick={handleClose}
              className="hidden md:flex sticky top-6 right-6 ml-auto mr-6 items-center justify-center p-3 rounded-2xl glass border border-border/50 bg-secondary/20 text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary/40 transition-all duration-300 cursor-pointer z-50"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="px-6 pb-24 md:px-16 md:pb-32">{children}</div>
          </motion.div>

          {/* Mobile close — thumb-reachable, safe-area aware */}
          <button
            onClick={handleClose}
            className="md:hidden fixed right-4 z-60 flex items-center justify-center p-3 rounded-full glass border border-border/50 bg-secondary/30 text-secondary-foreground shadow-xl hover:bg-secondary/50 transition-all duration-200 cursor-pointer bottom-safe"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </AnimatePresence>
  );
}
