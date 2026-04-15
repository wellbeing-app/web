import { getDictionary } from "@/lib/dictionary";

export default async function Home({ params } : { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const dict = await getDictionary(resolvedParams.lang as 'en' | 'cs');

  return (
    <main key={resolvedParams.lang} className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden pt-32">
      <div className="glass relative z-10 w-[95%] max-w-[800px] mx-auto flex flex-col items-center justify-center transition-colors duration-300 p-10 md:p-16 rounded-4xl text-center space-y-8">
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
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-primary/90 hover:shadow-md">
            {dict.home.supportBtn}
          </button>
          <button className="bg-transparent border border-border px-8 py-3 rounded-full font-medium transition-all duration-300 hover:bg-secondary/80 hover:shadow-md">
            {dict.home.newsletterBtn}
          </button>
        </div>
      </div>
    </main>
  );
}
