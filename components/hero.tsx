import React from "react";
import { Dictionary } from "@/lib/dictionary";

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section id="home" className="space-y-8 flex flex-col items-center">
      <span className="inline-flex items-center bg-secondary/30 border border-border/50 backdrop-blur-sm text-secondary-foreground grayscale text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-300 animate-fade-in">
        {dict.home.badge}
      </span>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight transition-colors duration-300 animate-fade-in">
        {dict.home.title}
      </h1>

      <p className="text-lg text-muted-foreground max-w-lg leading-relaxed transition-colors duration-300 animate-fade-in">
        {dict.home.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto animate-fade-in">
        <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-primary/90">
          {dict.home.supportBtn}
        </button>
        <button className="bg-transparent border border-border px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-secondary/80">
          {dict.home.newsletterBtn}
        </button>
      </div>
    </section>
  );
}
