'use client';

import { Features } from '@/components/features';
import { Screener } from '@/components/screener';

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-32 px-4 flex flex-col items-center min-h-[70vh] gap-20">
      <div className="w-full max-w-200">
        <Features full={true} />
      </div>
      <Screener />
    </div>
  );
}
