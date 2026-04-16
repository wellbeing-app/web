'use client';

import { useDictionary } from '@/components/providers/dictionary-provider';
import Link from 'next/link';

export default function PrivacyPage() {
  const dict = useDictionary();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <Link href="/" className="mb-8 text-primary hover:underline">
        ← {dict.nav.nav_home}
      </Link>

      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-bold">{dict.contact.privacyLink}</h1>

        <div className="prose prose-sm max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>{dict.privacy.weCollect}</h2>
          <p>{dict.privacy.weCollectDesc}</p>

          <h2>{dict.privacy.howWeUse}</h2>
          <p>Váš e-mail bude používán výhradně pro:</p>
          <ul>
            <li>{dict.privacy.newsletterUpdates}</li>
            <li>{dict.privacy.subscriptionProcessing}</li>
            <li>{dict.privacy.inquiries}</li>
          </ul>

          <h2>{dict.privacy.legalBasis}</h2>
          <p>{dict.privacy.consent}</p>

          <h2>{dict.privacy.yourRights}</h2>
          <p>V souladu s GDPR máte právo na:</p>
          <ul>
            <li>{dict.privacy.access}</li>
            <li>{dict.privacy.correction}</li>
            <li>{dict.privacy.deletion}</li>
            <li>{dict.privacy.withdraw}</li>
            <li>{dict.privacy.portability}</li>
          </ul>

          <h2>{dict.privacy.contact}</h2>
          <p>{dict.privacy.questions}</p>
        </div>
      </div>
    </div>
  );
}
