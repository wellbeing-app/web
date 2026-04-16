import React from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';

export function Mission() {
  const dict = useDictionary();
  return (
    <section id="vision" className="space-y-6 flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{dict.vision.title}</h2>
      <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
        {dict.vision.description}
      </p>
    </section>
  );
}
