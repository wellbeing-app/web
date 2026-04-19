'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSmoothScrollControl } from '@/components/providers/smooth-scroll';

interface ExpandedCardProps {
  children: React.ReactNode;
  layoutId: string;
}

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 };

export function ExpandedCard({ children }: ExpandedCardProps) {
  const router = useRouter();
  const setLenisEnabled = useSmoothScrollControl();
  const [open, setOpen] = useState(true);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    setLenisEnabled(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      setLenisEnabled(true);
      window.removeEventListener('keydown', onKey);
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
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-xl cursor-zoom-out"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            data-scroll-lock
            style={{ overscrollBehavior: 'contain' }}
            className="relative w-full max-w-5xl h-[90vh] bg-card border border-border rounded-4xl shadow-2xl overflow-y-auto no-scrollbar"
            transition={SPRING}
          >
            <button
              onClick={handleClose}
              className="sticky top-6 right-6 ml-auto mr-6 flex items-center justify-center p-3 rounded-2xl glass border border-border/50 bg-secondary/20 text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary/40 transition-all duration-300 cursor-pointer z-50"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="px-6 pb-20 md:px-16 md:pb-32">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
