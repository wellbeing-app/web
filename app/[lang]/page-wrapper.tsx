'use client';

import { ScrollIndicator } from '@/components/scroll-indicator';
import { StackedCards } from '@/components/stacked-cards';
import { Hero } from '@/components/hero';
import { Mission } from '@/components/mission';
import { Features } from '@/components/features';
import { Team } from '@/components/team';
import { WaitlistForm } from '@/components/waitlist-form';

export function PageWrapper() {
  return (
    <main className="relative min-h-screen animate-in fade-in duration-700 ease-in-out">
      <ScrollIndicator />
      <StackedCards
        cards={[
          { id: 'home', component: <Hero /> },
          { id: 'vision', component: <Mission /> },
          { id: 'features', component: <Features /> },
          { id: 'team', component: <Team /> },
          { id: 'contact', component: <WaitlistForm /> },
        ]}
      />
    </main>
  );
}
