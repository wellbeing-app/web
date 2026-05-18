import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Github } from '@/components/icons';

/**
 * Footer Component - "Docked" Taskbar
 *
 * Minimalist design matching Navbar/Cards.
 * Reverted to "upper half pill" as per user request.
 * Positioned to be flush with the bottom edge.
 */
export function Footer() {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="w-[95%] max-w-[50rem] lg:max-w-[56rem] mx-auto absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-(--glass-bg) border-x border-t border-border/50 rounded-t-(--radius-card-lg) px-6 md:px-8 pt-4 pb-[calc(1rem+var(--safe-bottom))] md:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        <p className="text-[10px] md:text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <span className="leading-none">©</span>
          <span>2026 Lumi.</span>
        </p>
        <div className="flex items-center gap-4 text-[10px] md:text-xs">
          <Link
            href={`/${lang}/privacy`}
            className="text-muted-foreground hover:text-(--warmth-700) transition-colors duration-(--duration-soft)"
          >
            {dict.footer.privacy}
          </Link>
          <a
            href="https://github.com/lumi-nonprofit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-(--warmth-700) transition-colors duration-(--duration-soft)"
          >
            <Github className="w-3 h-3" />
            <span>{dict.footer.github}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
