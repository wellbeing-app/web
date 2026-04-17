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
    usageHeader: string;
    rightsHeader: string;
    retentionHeader: string;
    retentionDesc: string;
    processorHeader: string;
    processorDesc: string;
    controllerHeader: string;
    controllerDesc: string;
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

const cache: Partial<Record<'en' | 'cs', Promise<Dictionary>>> = {};

export const getDictionary = async (locale: 'en' | 'cs'): Promise<Dictionary> => {
  const loader = dictionaries[locale] ?? dictionaries.cs;

  if (!cache[locale]) {
    cache[locale] = loader() as Promise<Dictionary>;
  }

  return cache[locale] as Promise<Dictionary>;
};
