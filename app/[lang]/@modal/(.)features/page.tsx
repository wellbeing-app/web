'use client';

import { Features } from '@/components/features';
import { ExpandedCard } from '@/components/expanded-card';

export default function InterceptedFeaturesPage() {
  return (
    <ExpandedCard layoutId="card-features">
      <Features full={true} />
    </ExpandedCard>
  );
}
