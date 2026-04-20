import { BookHeart, Wind, Users, UserRound, Moon, Sparkles, Target, BarChart3, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDictionary } from '@/components/providers/dictionary-provider';

interface FeaturesProps {
  full?: boolean;
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
    <div className="relative space-y-6 md:space-y-12 flex flex-col items-center py-4 md:py-10">
      <div className="space-y-2 md:space-y-4 text-center max-w-2xl px-4 flex flex-col items-center">
        <h2 className="text-2xl md:text-5xl font-bold tracking-tight text-foreground transition-colors duration-300">
          {dict.features.title}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
          {dict.features.description}
        </p>
      </div>

      <div className={`grid grid-cols-1 ${full ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-3'} gap-4 md:gap-8 w-full px-4`}>
        {displayList.map((feature, index) => {
          const Icon = displayIcons[index] || BookHeart;
          return (
            <div
              key={index}
              className="group relative p-4 md:p-8 rounded-2xl md:rounded-3xl bg-card border border-border/50 shadow-xs transition-all duration-500 hover:bg-secondary/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="relative z-10 space-y-2 md:space-y-4">
                <div className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-card border border-border/50 text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-xl mb-1 md:mb-2 text-foreground/90 group-hover:text-foreground transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
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
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>{dict.features.tryItLink}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
