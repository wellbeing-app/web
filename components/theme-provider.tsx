'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';

// Suppress the React 19 false positive warning from next-themes
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // React hydrated successfully. We can now remove the safety block
    // and re-enable smooth UI theme toggling for the entire session!
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 10);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
