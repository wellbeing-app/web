'use client';

import { useDictionary } from '@/components/providers/dictionary-provider';
import { CheckCircle2 } from 'lucide-react';

export function ForPartners() {
  const dict = useDictionary();
  const data = dict.forPartners as any;

  if (!data) return null;

  return (
    <div className="relative space-y-8 md:space-y-12 flex flex-col items-center w-full animate-fade-in">
      <div className="space-y-4 text-center max-w-2xl px-4">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight text-foreground">
          {data.title}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      </div>

      {data.benefits && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {data.benefits.map((benefit: { title: string; desc: string }, i: number) => (
            <div
              key={i}
              className="flex flex-col items-start gap-3 rounded-(--radius-card-inner) border border-border/50 bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-(--warmth-600) shrink-0" />
                <h3 className="text-base font-semibold text-foreground/90">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
