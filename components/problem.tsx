'use client';

import { useDictionary } from '@/components/providers/dictionary-provider';
import { ShieldAlert } from 'lucide-react';

export function Problem() {
  const dict = useDictionary();
  const data = dict.problem;

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

      {data.points && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {data.points.map((point: { title: string; desc: string }, i: number) => (
            <div
              key={i}
              className="flex flex-col items-start gap-3 rounded-card-inner border border-border/50 bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-8 h-8 rounded-full bg-warmth-50 border border-warmth-100 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-warmth-700" />
                </div>
                <h3 className="text-base font-semibold text-foreground/90">
                  {point.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
