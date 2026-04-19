import React from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Apple, Android, Microsoft, Linux } from '@/components/icons';

export function Hero() {
  const dict = useDictionary();

  const platforms = [
    { name: 'iOS', icon: Apple, label: 'Download for iOS' },
    { name: 'Android', icon: Android, label: 'Download for Android' },
    { name: 'Windows', icon: Microsoft, label: 'Download for Windows' },
    { name: 'Linux', icon: Linux, label: 'Download for Linux' },
  ];

  return (
    <div className="relative gap-6 flex flex-col items-center py-0 overflow-hidden">
      {/* Background Enrichment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-2xl bg-primary/5 rounded-full blur-3xl -z-10 animate-breathe" />

      <span className="inline-flex items-center bg-secondary/30 border border-border/50 backdrop-blur-sm text-secondary-foreground grayscale text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-300 animate-fade-in">
        {dict.home.badge}
      </span>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center transition-colors duration-300 animate-fade-in">
        {dict.home.title}
      </h1>

      <p className="text-lg text-muted-foreground max-w-lg text-center leading-relaxed transition-colors duration-300 animate-fade-in">
        {dict.home.description}
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in">
        {platforms.map((platform) => (
          <div
            key={platform.name}
            className="w-14 h-14 flex items-center justify-center bg-card/50 border border-border/50 backdrop-blur-md rounded-2xl transition-all duration-500 hover:bg-secondary/80 hover:scale-110 hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] cursor-pointer group"
            aria-label={platform.label}
          >
            <platform.icon className="w-7 h-7 text-foreground/70 group-hover:text-foreground transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
