"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    if (!pathname) return;
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    router.push(segments.join('/'));
  };

  const isCz = lang === 'cs';
  const targetLang = isCz ? 'en' : 'cs';

  return (
    <button
      onClick={() => switchLanguage(targetLang)}
      className="w-9 h-9 rounded-full hover:bg-secondary/50 theme-transition-all flex items-center justify-center text-foreground/80 hover:text-foreground cursor-pointer font-medium text-xs tracking-wider"
      aria-label="Switch language"
    >
      <Globe className="w-5 h-5" />
    </button>
  );
}
