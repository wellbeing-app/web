import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { OrgChart } from '@/components/org-chart';
import { team, flattenPeople } from '@/lib/team';

import Image from 'next/image';

export function Team({ showChart = false }: { showChart?: boolean }) {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as string;
  const people = flattenPeople(team).filter((p) => p.id !== 'daniel');

  return (
    <div className="relative space-y-4 md:space-y-6 flex flex-col items-center animate-fade-in">
      <div className="space-y-2 md:space-y-4 text-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.team.title}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          {dict.team.description}
        </p>
      </div>

      {showChart ? (
        <OrgChart />
      ) : (
        <div className="flex flex-col items-center gap-4 md:gap-6 w-full">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-6 w-full">
            {people.map((member) => {
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);
              return (
                <div
                  key={member.id}
                  className="flex flex-col items-center gap-2 md:gap-3 p-3 md:p-6 rounded-(--radius-card-inner) md:rounded-(--radius-card) bg-card border border-border/50 shadow-(--shadow-card)"
                >
                  {member.image ? (
                    <div className="relative w-14 h-14 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-(--warmth-100)/80 ring-offset-2 ring-offset-card">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 56px, 96px"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 md:w-24 md:h-24 rounded-full bg-(--warmth-100) text-(--warmth-700) flex items-center justify-center font-semibold text-sm md:text-xl">
                      {initials}
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="font-semibold text-sm md:text-lg">{member.name}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {dict.team.roles[member.id]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href={`/${lang}/team`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-(--warmth-700) transition-colors duration-(--duration-soft) group underline decoration-(--warmth-300) underline-offset-4 hover:decoration-(--warmth-700)"
          >
            <span>{dict.team.moreLink}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
