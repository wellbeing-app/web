'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Dictionary } from '@/lib/dictionary';

const DictionaryContext = createContext<Dictionary | null>(null);

interface DictionaryProviderProps {
  children: ReactNode;
  dictionary: Dictionary;
}

export function DictionaryProvider({ children, dictionary }: DictionaryProviderProps) {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>;
}

export function useDictionary() {
  const context = useContext(DictionaryContext);
  if (context === null) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
}
