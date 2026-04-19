'use client';

import { Features } from '@/components/features';
import { Screener } from '@/components/screener';
import { ExpandedCard } from '@/components/expanded-card';

export default function InterceptedFeaturesPage() {
  return (
    <ExpandedCard layoutId="card-features">
      <div className="flex flex-col gap-20">
        <Features full={true} />
        <Screener />
      </div>
    </ExpandedCard>
  );
}
