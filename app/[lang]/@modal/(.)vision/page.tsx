'use client';

import { Mission } from '@/components/mission';
import { ExpandedCard } from '@/components/expanded-card';

export default function InterceptedVisionPage() {
  return (
    <ExpandedCard layoutId="card-vision">
      <Mission isFullPage={true} />
    </ExpandedCard>
  );
}
