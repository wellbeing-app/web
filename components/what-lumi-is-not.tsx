'use client';

import { useDictionary } from '@/components/providers/dictionary-provider';
import { Info } from 'lucide-react';

export function WhatLumiIsNot() {
  const dict = useDictionary();
  const data = dict.whatLumiIsNot;

  if (!data) return null;

  return (
    <div className="relative space-y-8 md:space-y-12 flex flex-col items-center w-full animate-fade-in">
      <div className="space-y-2 md:space-y-4 text-center max-w-2xl px-4 flex flex-col items-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight text-foreground transition-colors duration-(--duration-soft)">
          {data.title}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      </div>

      <div className="w-full max-w-3xl space-y-3 md:space-y-4 px-2">
        {data.items.map((item: any, i: number) => (
          <div
            key={i}
            className="rounded-(--radius-card-inner) border border-border/50 bg-card p-5 md:p-6 space-y-2 md:space-y-3 hover:bg-(--warmth-50)/20 transition-colors duration-(--duration-soft)"
          >
            <div className="flex items-start gap-3 md:gap-4">
              <div className="shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full bg-secondary/50 flex items-center justify-center mt-0.5">
                <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base md:text-lg text-foreground/90">
                  {item.claim}
                </h3>
              </div>
            </div>
            <div className="pl-9 md:pl-11">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {item.clarification}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
