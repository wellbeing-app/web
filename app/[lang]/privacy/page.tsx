'use client';

import { useDictionary } from '@/components/providers/dictionary-provider';
import Link from 'next/link';

export default function PrivacyPage() {
  const dict = useDictionary();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center py-16 px-4">
      <Link href="/" className="mb-8 text-primary hover:underline">
        ← {dict.nav.nav_home}
      </Link>

      <div className="max-w-3xl w-full space-y-8">
        <h1 className="text-4xl font-bold">{dict.contact.privacyLink}</h1>

        <div className="prose prose-sm max-w-none">
          <p>
            {dict.privacy.lastUpdated}: {new Date().toLocaleDateString()}
          </p>

          <h2>{dict.privacy.weCollect}</h2>
          <p>{dict.privacy.weCollectDesc}</p>

          <h2>{dict.privacy.howWeUse}</h2>
          <p>{dict.privacy.usageHeader}</p>
          <ul>
            <li>{dict.privacy.newsletterUpdates}</li>
            <li>{dict.privacy.subscriptionProcessing}</li>
            <li>{dict.privacy.inquiries}</li>
          </ul>

          <h2>{dict.privacy.legalBasis}</h2>
          <p>{dict.privacy.consent}</p>

          <h2>{dict.privacy.yourRights}</h2>
          <p>{dict.privacy.rightsHeader}</p>
          <ul>
            <li>{dict.privacy.access}</li>
            <li>{dict.privacy.correction}</li>
            <li>{dict.privacy.deletion}</li>
            <li>{dict.privacy.withdraw}</li>
            <li>{dict.privacy.portability}</li>
          </ul>

          <h2>{dict.privacy.retentionHeader}</h2>
          <p>{dict.privacy.retentionDesc}</p>

          <h2>{dict.privacy.processorHeader}</h2>
          <p>{dict.privacy.processorDesc}</p>

          <h2>{dict.privacy.controllerHeader}</h2>
          <p>{dict.privacy.controllerDesc}</p>

          <h2>{dict.privacy.contact}</h2>
          <p>{dict.privacy.questions}</p>
        </div>
      </div>
    </div>
  );
}
