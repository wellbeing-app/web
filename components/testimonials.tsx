'use client';

import { motion } from 'framer-motion';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Quote } from 'lucide-react';

export function Testimonials() {
  const dict = useDictionary();
  const list = dict.testimonials.list;

  return (
    <div className="relative space-y-8 md:space-y-12 flex flex-col items-center w-full animate-fade-in">
      <div className="space-y-2 md:space-y-3 text-center max-w-xl px-4">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.testimonials.title}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
          {dict.testimonials.description}
        </p>
      </div>

      <div className="grid grid-cols-1 @lg/card:grid-cols-3 gap-4 md:gap-6 w-full px-2">
        {list.map((t, i) => {
          const initials = t.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2);
          return (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              className="relative flex flex-col gap-4 rounded-(--radius-card) bg-(--warmth-50)/40 border border-border/50 p-5 md:p-6 text-left"
            >
              <Quote className="w-6 h-6 text-(--warmth-300) fill-(--warmth-300)/20" />
              <blockquote className="text-base md:text-lg font-medium leading-relaxed text-foreground/85">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-auto">
                <div
                  className="w-9 h-9 rounded-full bg-(--warmth-100) text-(--warmth-700) flex items-center justify-center text-xs font-semibold ring-2 ring-(--warmth-100)/80 ring-offset-2 ring-offset-card"
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                </div>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}
