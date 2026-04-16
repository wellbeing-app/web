'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useEffect, useTransition } from 'react';

export function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // Set cookie when locale changes (runs only on client after hydration)
  useEffect(() => {
    document.cookie = `locale=${lang}; path=/; max-age=31536000`;
  }, [lang]);

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    startTransition(() => {
      router.push(segments.join('/'));
    });
  };

  const isCz = lang === 'cs';
  const targetLang = isCz ? 'en' : 'cs';

  return (
    <button
      onClick={() => switchLanguage(targetLang)}
      disabled={isPending}
      className="w-9 h-9 rounded-full hover:bg-secondary/50 transition-all duration-300 flex items-center justify-center text-foreground/80 hover:text-foreground cursor-pointer font-medium text-xs tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Switch language"
    >
      <Globe className="w-5 h-5" />
    </button>
  );
}
