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
    emailLabel: string;
    emailPlaceholder: string;
    emailError: string;
    successMessage: string;
    submitBtn: string;
    privacyText: string;
    privacyLink: string;
  };
  privacy: {
    lastUpdated: string;
    weCollect: string;
    howWeUse: string;
    legalBasis: string;
    yourRights: string;
    contact: string;
    weCollectDesc: string;
    newsletterUpdates: string;
    subscriptionProcessing: string;
    inquiries: string;
    consent: string;
    access: string;
    correction: string;
    deletion: string;
    withdraw: string;
    portability: string;
    questions: string;
  };
  accessibility: {
    skipToMain: string;
  };
}

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  cs: () => import('@/dictionaries/cs.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'cs'): Promise<Dictionary> => {
  return (dictionaries[locale]?.() ?? dictionaries.cs()) as Promise<Dictionary>;
};
