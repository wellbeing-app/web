import React from 'react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { OrgChart } from '@/components/org-chart';
import { team, flattenPeople } from '@/lib/team';

export function Team({ showChart = false }: { showChart?: boolean }) {
  const dict = useDictionary();
  const people = flattenPeople(team).filter((p) => p.id !== 'daniel');

  return (
    <div className="relative space-y-16 flex flex-col items-center">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{dict.team.title}</h2>
        <p className="text-lg text-muted-foreground">{dict.team.description}</p>
      </div>

      {showChart ? (
        <OrgChart />
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {people.map((member) => (
            <div key={member.id} className="flex flex-col items-center space-y-2">
              <div className="w-24 h-24 rounded-full bg-accent animate-pulse" />
              <div className="text-center">
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{dict.team.roles[member.id]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
