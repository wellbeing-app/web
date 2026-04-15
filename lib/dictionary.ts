export interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  nav: Record<string, string>;
  home: {
    badge: string;
    title: string;
    description: string;
    supportBtn: string;
    newsletterBtn: string;
  };
  vision: {
    title: string;
    description: string;
  };
  features: {
    title: string;
    description: string;
    list: Array<{
      title: string;
      desc: string;
    }>;
  };
  team: {
    title: string;
    description: string;
    members: Array<{
      name: string;
      role: string;
    }>;
  };
  contact: {
    title: string;
    description: string;
    emailPlaceholder: string;
    submitBtn: string;
  };
}

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  cs: () => import('@/dictionaries/cs.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'cs'): Promise<Dictionary> => {
  return (dictionaries[locale]?.() ?? dictionaries.cs()) as Promise<Dictionary>;
};
