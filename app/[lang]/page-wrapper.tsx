'use client';

import { ScrollIndicator } from '@/components/scroll-indicator';
import { HeroIntro } from '@/components/hero';
import { Problem } from '@/components/problem';
import { HowItWorks } from '@/components/how-it-works';
import { Features } from '@/components/features';
import { WhatLumiIsNot } from '@/components/what-lumi-is-not';
import { TrustStripCard } from '@/components/trust-strip';
import { ForPartners } from '@/components/for-partners';
import { FAQ } from '@/components/faq';
import { WaitlistForm } from '@/components/waitlist-form';
import { Footer } from '@/components/footer';

import { useDictionary } from '@/components/providers/dictionary-provider';
import { ScrollContinueButton } from '@/components/scroll-continue-button';

export function PageWrapper() {
  const dict = useDictionary();
  const btns = dict.continueBtns;

  return (
    <main className="relative z-0 min-h-dvh animate-in fade-in duration-700 ease-in-out">
      <ScrollIndicator />
      
      <div className="w-[95%] max-w-200 lg:max-w-4xl mx-auto py-20 md:py-32 flex flex-col gap-24 md:gap-40">
        {/* 1. Hero & Problem Block */}
        <section id="home" className="flex flex-col items-center gap-16 md:gap-24 pt-10">
          <HeroIntro />
          <div id="problem" className="w-full max-w-3xl glass border border-border/50 rounded-3xl p-5 sm:p-8 md:p-12 shadow-(--shadow-card) flex flex-col items-center gap-6 md:gap-8">
            <Problem />
            <ScrollContinueButton targetId="how" label={btns.problem} />
          </div>
        </section>

        {/* 2. Core Journey & Features */}
        <section id="how" className="flex flex-col items-center gap-16 md:gap-24">
          <div className="flex flex-col items-center gap-8 w-full">
            <HowItWorks />
            <ScrollContinueButton targetId="features" label={btns.how} />
          </div>
          <div id="features" className="flex flex-col items-center gap-8 w-full">
            <Features />
            <ScrollContinueButton targetId="whatLumiIsNot" label={btns.features} />
          </div>
        </section>

        {/* 3. Safety Boundaries & Trust */}
        <section id="whatLumiIsNot" className="flex flex-col items-center gap-12 md:gap-16 relative">
          {/* Subtle background blob for the trust section */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-160 h-80 bg-warmth-100 rounded-full blur-[100px]" />
          </div>
          
          <div className="flex flex-col items-center gap-8 w-full">
            <WhatLumiIsNot />
            <ScrollContinueButton targetId="trust" label={btns.boundaries} />
          </div>
          <div id="trust" className="w-full max-w-4xl pt-8 border-t border-border/50 flex flex-col items-center gap-8">
            <TrustStripCard />
            <ScrollContinueButton targetId="forPartners" label={btns.trust} />
          </div>
        </section>

        {/* 4. Partners, FAQ & CTA */}
        <section id="forPartners" className="flex flex-col items-center gap-16 md:gap-24">
          <div className="w-full max-w-3xl glass border border-border/50 rounded-3xl p-5 sm:p-8 md:p-12 shadow-(--shadow-card) flex flex-col items-center gap-6 md:gap-8">
            <ForPartners />
            <ScrollContinueButton targetId="faq" label={btns.partners} />
          </div>
          <div id="faq" className="flex flex-col items-center gap-8 w-full">
            <FAQ />
            <ScrollContinueButton targetId="contact" label={btns.faq} />
          </div>
        </section>
        
        <section id="contact" className="min-h-[calc(100dvh-6.5rem)] pb-10">
          <WaitlistForm />
        </section>
      </div>
      
      <Footer />
    </main>
  );
}
