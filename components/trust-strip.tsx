'use client';

import { ShieldCheck, Heart, GraduationCap } from 'lucide-react';
import { Github } from '@/components/icons';
import { useDictionary } from '@/components/providers/dictionary-provider';
import type { ComponentType, SVGProps } from 'react';

const TILES: {
  key: 'local' | 'oss' | 'free' | 'experts';
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { key: 'local', icon: ShieldCheck },
  { key: 'oss', icon: Github },
  { key: 'free', icon: Heart },
  { key: 'experts', icon: GraduationCap },
];

export function TrustStrip() {
  const dict = useDictionary();

  return (
    <ul role="list" className="grid grid-cols-2 @md/card:grid-cols-4 gap-3 w-full">
      {TILES.map(({ key, icon: Icon }) => {
        const t = dict.trust.items[key];
        return (
          <li
            key={key}
            className="flex flex-col items-center gap-2 rounded-(--radius-card-inner) border border-border/60 bg-(--warmth-50)/40 p-4 text-center"
          >
            <Icon className="w-5 h-5 text-(--warmth-700)" aria-hidden="true" />
            <div className="font-semibold text-sm text-foreground">{t.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{t.desc}</div>
          </li>
        );
      })}
    </ul>
  );
}

export function TrustStripCard() {
  const dict = useDictionary();

  return (
    <div className="relative w-full max-w-3xl mx-auto flex flex-col items-center gap-6 md:gap-8 animate-fade-in">
      <div className="space-y-2 md:space-y-3 text-center max-w-xl">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.trust.title}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
          {dict.trust.description}
        </p>
      </div>
      <TrustStrip />
    </div>
  );
}
