import React from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';

export function Team() {
  const dict = useDictionary();
  return (
    <section id="team" className="space-y-8 flex flex-col items-center">
      <div className="space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{dict.team.title}</h2>
        <p className="text-lg text-muted-foreground">{dict.team.description}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {dict.team.members.map((member, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 rounded-full bg-accent animate-pulse" />
            <div className="text-center">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
