'use client';

import { Plus } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';

export function FAQ() {
  const dict = useDictionary();
  const items = dict.faq.items;

  return (
    <div className="relative space-y-6 md:space-y-10 flex flex-col items-center w-full animate-fade-in">
      <div className="space-y-2 md:space-y-3 text-center max-w-xl px-4">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.faq.title}
        </h2>
      </div>

      <ul role="list" className="w-full max-w-2xl flex flex-col gap-3 px-2 text-left">
        {items.map((item, i) => (
          <li key={i}>
            <details className="group rounded-(--radius-card-inner) border border-border/60 bg-card open:bg-(--warmth-50)/30 open:border-(--warmth-300)/40 transition-colors duration-(--duration-soft) [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-medium text-sm md:text-base">
                <span>{item.q}</span>
                <Plus
                  className="w-4 h-4 shrink-0 text-(--warmth-700) transition-transform duration-(--duration-soft) group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
