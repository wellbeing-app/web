'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RefObject, useEffect, useRef } from 'react';
import { useSmoothScrollControl } from '@/components/providers/smooth-scroll';
import { useIsDesktop } from '@/lib/use-is-desktop';
import { trapFocus } from '@/lib/focus-trap';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
  labelledBy?: string;
  children: React.ReactNode;
}

const PANEL_TRANSITION = { type: 'spring' as const, stiffness: 320, damping: 32 };

/**
 * Mobile-only overlay sheet. Renders a backdrop + focus-trapped panel below
 * the fixed navbar. Scroll on the underlying document is locked while open
 * and restored on close; Lenis is paused via the smooth-scroll provider.
 * Returns null on ≥768px so desktop never pays the cost.
 */
export function MobileMenu({ open, onClose, triggerRef, labelledBy, children }: MobileMenuProps) {
  const isDesktop = useIsDesktop();
  const setLenisEnabled = useSmoothScrollControl();
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open || isDesktop) return;
    const panel = panelRef.current;
    if (!panel) return;

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    setLenisEnabled(false);

    const releaseTrap = trapFocus(panel, {
      onEscape: onClose,
      restoreFocusTo: triggerRef?.current ?? null,
    });

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      setLenisEnabled(true);
      releaseTrap();
    };
  }, [open, isDesktop, onClose, triggerRef, setLenisEnabled]);

  if (isDesktop) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: 'easeOut' }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            id="mobile-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={reduce ? { duration: 0 } : PANEL_TRANSITION}
            className="fixed left-1/2 -translate-x-1/2 w-[95%] max-w-200 z-50 md:hidden bg-card rounded-3xl p-6 border border-border flex flex-col items-center gap-3"
            style={{ top: 'calc(max(1rem, var(--safe-top)) + 4.5rem)' }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
