import React from "react";
import { Dictionary } from "@/lib/dictionary";

export function Features({ dict }: { dict: Dictionary }) {
  return (
    <section id="features" className="space-y-8 flex flex-col items-center">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          {dict.features.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {dict.features.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {dict.features.list.map((feature, index) => (
          <div key={index} className="p-6 rounded-2xl bg-secondary/20 border border-border/50 text-left">
            <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
