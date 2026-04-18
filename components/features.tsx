import { BookHeart, Wind, Users } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';

export function Features() {
  const dict = useDictionary();
  
  const featureIcons = [BookHeart, Wind, Users];

  return (
    <section id="features" className="space-y-12 flex flex-col items-center py-10">
      <div className="space-y-4 text-center max-w-2xl px-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground transition-colors duration-300">
          {dict.features.title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {dict.features.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
        {dict.features.list.map((feature, index) => {
          const Icon = featureIcons[index] || BookHeart;
          return (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-card border border-border/50 shadow-xs transition-all duration-500 hover:bg-secondary/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-card border border-border/50 text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2 text-foreground/90 group-hover:text-foreground transition-colors">
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
    </section>
  );
}
