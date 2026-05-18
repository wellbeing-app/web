'use client';

import { ChevronDown } from 'lucide-react';
import { useLenis } from '@/components/providers/smooth-scroll';
import { scrollToPageTarget } from '@/lib/scroll-to-section';

interface ScrollContinueButtonProps {
  targetId: string;
  label: string;
}

export function ScrollContinueButton({ targetId, label }: ScrollContinueButtonProps) {
  const lenisRef = useLenis();
  
  const onClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    
    scrollToPageTarget(el, lenisRef.current, { duration: 0.9, lock: true, force: true });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center group cursor-pointer pt-4 pb-2"
    >
      <span className="inline-flex items-center gap-2 rounded-pill glass border border-border/50 bg-secondary/30 text-secondary-foreground px-5 py-2 text-sm font-medium leading-none transition-all duration-(--duration-soft) ease-out-soft group-hover:bg-warmth-100/60 group-hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
        <span className="leading-none">{label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
      </span>
    </button>
  );
}
