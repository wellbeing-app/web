'use client';

import { ScrollIndicator } from '@/components/scroll-indicator';
import { SectionSnap } from '@/components/section-snap';
import { StackedCards } from '@/components/stacked-cards';
import { Hero } from '@/components/hero';
import { Mission } from '@/components/mission';
import { Features } from '@/components/features';
import { Team } from '@/components/team';
import { WaitlistForm } from '@/components/waitlist-form';
import { DeveloperFriendly } from '@/components/developer-friendly';
import { HowItWorks } from '@/components/how-it-works';
import { Testimonials } from '@/components/testimonials';
import { FAQ } from '@/components/faq';
import { TrustStripCard } from '@/components/trust-strip';

const SECTION_IDS = [
  'home',
  'vision',
  'how',
  'features',
  'testimonials',
  'team',
  'developer',
  'faq',
  'trust',
  'contact',
] as const;

export function PageWrapper() {
  return (
    <main className="relative z-0 min-h-dvh animate-in fade-in duration-700 ease-in-out">
      <ScrollIndicator />
      <SectionSnap sectionIds={SECTION_IDS} />
      <StackedCards
        cards={[
          { id: 'home', component: <Hero /> },
          { id: 'vision', component: <Mission />, href: '/vision' },
          { id: 'how', component: <HowItWorks /> },
          { id: 'features', component: <Features />, href: '/features' },
          { id: 'testimonials', component: <Testimonials /> },
          { id: 'team', component: <Team />, href: '/team' },
          { id: 'developer', component: <DeveloperFriendly />, href: '/developer' },
          { id: 'faq', component: <FAQ /> },
          { id: 'trust', component: <TrustStripCard /> },
          { id: 'contact', component: <WaitlistForm /> },
        ]}
      />
    </main>
  );
}
