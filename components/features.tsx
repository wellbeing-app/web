import {
  BookHeart,
  Wind,
  Users,
  UserRound,
  Moon,
  Sparkles,
  Target,
  BarChart3,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/components/providers/dictionary-provider';

interface FeaturesProps {
  full?: boolean;
}

function CornerDoodle() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      className="absolute -top-4 -right-4 w-24 h-24 text-(--warmth-300) opacity-15 group-hover:opacity-35 transition-opacity duration-(--duration-soft) pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M10 60 Q 30 30 60 40 T 70 10" />
      <path d="M20 70 Q 40 50 70 50" opacity="0.6" />
    </svg>
  );
}

export function Features({ full = false }: FeaturesProps) {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  const featureIcons = [BookHeart, Wind, Users];
  const fullFeatureIcons = [UserRound, BookHeart, Moon, Sparkles, Target, BarChart3, ShieldAlert];

  const displayList = full ? dict.features.fullList : dict.features.list;
  const displayIcons = full ? fullFeatureIcons : featureIcons;

  return (
    <div className="relative space-y-6 md:space-y-12 flex flex-col items-center py-4 md:py-10 animate-fade-in">
      <div className="space-y-2 md:space-y-4 text-center max-w-2xl px-4 flex flex-col items-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight text-foreground transition-colors duration-(--duration-soft)">
          {dict.features.title}
        </h2>
      </div>

      <div
        className={`grid grid-cols-1 ${
          full
            ? 'md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4'
            : '@lg/card:grid-cols-3 md:grid-cols-3'
        } gap-4 md:gap-8 w-full px-4`}
      >
        {displayList.map((feature, index) => {
          const Icon = displayIcons[index] || BookHeart;
          return (
            <div
              key={index}
              className="group relative p-4 md:p-8 rounded-(--radius-card) bg-card border border-border/50 shadow-(--shadow-card) transition-all duration-(--duration-slow) ease-(--ease-out-soft) hover:bg-(--warmth-50)/40 hover:-translate-y-1.5 hover:shadow-(--shadow-card-hover) overflow-hidden"
            >
              <CornerDoodle />
              <div className="relative z-10 space-y-2 md:space-y-4">
                <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-card border border-border/50 text-foreground/80 shadow-sm group-hover:scale-110 group-hover:bg-(--warmth-100) group-hover:text-(--warmth-700) group-hover:border-(--warmth-300)/40 transition-all duration-(--duration-soft) ease-(--ease-out-soft)">
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-xl mb-1 md:mb-2 text-foreground/90 group-hover:text-foreground transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-muted-foreground/90 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!full && (
        <Link
          href={`/${lang}/features`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-(--warmth-700) transition-colors duration-(--duration-soft) group underline decoration-(--warmth-300) underline-offset-4 hover:decoration-(--warmth-700)"
        >
          <span>{dict.features.tryItLink}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
