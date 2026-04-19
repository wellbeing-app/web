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
    targetPlatforms: string;
  };
  vision: {
    title: string;
    description: string;
    marketAnalysisTitle: string;
    marketAnalysis: string;
    learnMoreLink: string;
  };
  features: {
    title: string;
    description: string;
    tryItLink: string;
    list: Array<{
      title: string;
      desc: string;
    }>;
    fullList: Array<{
      title: string;
      desc: string;
    }>;
  };
  team: {
    title: string;
    description: string;
    roles: Record<string, string>;
    groups: Record<string, string>;
    moreLink: string;
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
  stackedCards: {
    nextSlide: string;
  };
  screener: {
    heading: string;
    intro: string;
    cta: string;
    pickPrompt: string;
    instruments: {
      who5: ScreenerContent;
      phq9: ScreenerContent;
      gad7: ScreenerContent;
    };
    severityLabels: {
      who5_good: string;
      who5_low: string;
      who5_poor: string;
      minimal: string;
      mild: string;
      moderate: string;
      moderatelySevere: string;
      severe: string;
    };
    ui: {
      progress: string;
      back: string;
      next: string;
      finish: string;
      startOver: string;
      changeInstrument: string;
      scoreLabel: string;
      suggestedLabel: string;
      disclaimer: string;
      crisisTitle: string;
      crisisBody: string;
    };
  };
}

export interface ScreenerContent {
  name: string;
  blurb: string;
  timeframe: string;
  items: string[];
  scale: string[];
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
