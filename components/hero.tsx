import React from 'react';
import { Globe } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { Apple, Android, Microsoft, Linux } from '@/components/icons';

export function Hero() {
  const dict = useDictionary();

  const platforms = [
    { name: 'iOS', icon: Apple, label: 'Download for iOS' },
    { name: 'Android', icon: Android, label: 'Download for Android' },
    { name: 'Windows', icon: Microsoft, label: 'Download for Windows' },
    { name: 'Linux', icon: Linux, label: 'Download for Linux' },
    { name: 'Web', icon: Globe, label: 'Open in browser' },
  ];

  return (
    <div className="relative gap-3 sm:gap-4 md:gap-6 flex flex-col items-center py-0 overflow-hidden">
      {/* Background Enrichment */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full max-h-2xl bg-primary/5 rounded-full blur-3xl -z-10 animate-breathe" />

      <span className="inline-flex items-center bg-secondary/30 border border-border/50 backdrop-blur-sm text-secondary-foreground grayscale text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-1.5 rounded-full transition-colors duration-300 animate-fade-in">
        {dict.home.badge}
      </span>

      <h1 className="text-[length:var(--text-hero-fluid)] md:text-6xl leading-[1.1] md:leading-tight font-bold tracking-tight text-center transition-colors duration-300 animate-fade-in">
        {dict.home.title}
      </h1>

      <p className="text-[length:var(--text-base-fluid)] md:text-lg text-muted-foreground max-w-lg text-center leading-relaxed transition-colors duration-300 animate-fade-in">
        {dict.home.description}
      </p>

      <div className="flex flex-col items-center gap-2 md:gap-3 pt-2 md:pt-4 animate-fade-in">
        <span className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">
          {dict.home.targetPlatforms}
        </span>
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="w-11 h-11 md:w-14 md:h-14 flex items-center justify-center bg-card/50 border border-border/50 backdrop-blur-md rounded-xl md:rounded-2xl transition-all duration-500 hover:bg-secondary/80 hover:scale-110 active:scale-95 touch-manipulation hover:shadow-[0_0_20px_rgba(var(--primary),0.1)] cursor-pointer group"
              aria-label={platform.label}
            >
              <platform.icon className="w-5 h-5 md:w-7 md:h-7 text-foreground/70 group-hover:text-foreground transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
