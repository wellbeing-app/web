'use client';

import { Team } from '@/components/team';
import { ExpandedCard } from '@/components/expanded-card';

export default function InterceptedTeamPage() {
  return (
    <ExpandedCard layoutId="card-team">
      <Team showChart={true} />
    </ExpandedCard>
  );
}
