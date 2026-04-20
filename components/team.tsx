import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { OrgChart } from '@/components/org-chart';
import { team, flattenPeople } from '@/lib/team';

export function Team({ showChart = false }: { showChart?: boolean }) {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const people = flattenPeople(team).filter((p) => p.id !== 'daniel');

  return (
    <div className="relative space-y-4 md:space-y-6 flex flex-col items-center">
      <div className="space-y-2 md:space-y-4 text-center">
        <h2 className="text-2xl md:text-5xl font-bold tracking-tight">{dict.team.title}</h2>
        <p className="text-sm md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          {dict.team.description}
        </p>
      </div>

      {showChart ? (
        <OrgChart />
      ) : (
        <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-6 w-full">
            {people.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center gap-2 md:gap-3 p-3 md:p-6 rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs"
              >
                <div className="w-14 h-14 md:w-24 md:h-24 rounded-full bg-accent animate-pulse" />
                <div className="text-center">
                  <h3 className="font-bold text-sm md:text-lg">{member.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{dict.team.roles[member.id]}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={`/${lang}/team`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>{dict.team.moreLink}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
