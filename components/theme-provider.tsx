'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  useTheme,
  type ThemeProviderProps,
} from 'next-themes';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args);
  };
}

function ThemeCookieSync() {
  const { resolvedTheme } = useTheme();
  React.useEffect(() => {
    if (resolvedTheme !== 'dark' && resolvedTheme !== 'light') return;
    document.cookie = `theme=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [resolvedTheme]);
  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 10);
  }, []);

  return (
    <NextThemesProvider {...props}>
      <ThemeCookieSync />
      {children}
    </NextThemesProvider>
  );
}
