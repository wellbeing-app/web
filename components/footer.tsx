import React from 'react';

/**
 * Footer Component - "Docked" Taskbar
 *
 * Minimalist design matching Navbar/Cards.
 * Reverted to "upper half pill" as per user request.
 * Positioned to be flush with the bottom edge.
 */
export function Footer() {
  return (
    <div className="w-[95%] max-w-200 mx-auto absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-card border-x border-t border-border rounded-t-4xl md:rounded-t-[3rem] px-8 pt-4 pb-[calc(1rem+var(--safe-bottom))] md:py-6 flex items-center justify-center shadow-2xl">
        <p className="text-[10px] md:text-xs text-muted-foreground font-semibold flex items-center gap-2">
          <span className="text-base leading-none">©</span> 2026 Wellbeing.
        </p>
      </div>
    </div>
  );
}
