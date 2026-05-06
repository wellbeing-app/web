'use client';

import { motion } from 'framer-motion';
import { useDictionary } from '@/components/providers/dictionary-provider';

const STEP_FACES = [
  // Step 1 — neutral, slight smile
  {
    color: 'hsl(40, 50%, 70%)',
    mouthD: 'M 12 26 Q 20 27 28 26',
    eyesUp: true,
  },
  // Step 2 — engaged, soft smile
  {
    color: 'hsl(80, 50%, 65%)',
    mouthD: 'M 12 26 Q 20 30 28 26',
    eyesUp: true,
  },
  // Step 3 — happy, big smile
  {
    color: 'hsl(130, 65%, 55%)',
    mouthD: 'M 12 26 Q 20 33 28 26',
    eyesUp: true,
  },
] as const;

function StepBlob({ index }: { index: number }) {
  const f = STEP_FACES[index];
  return (
    <svg viewBox="0 0 40 40" className="w-20 h-20" aria-hidden="true">
      <defs>
        <radialGradient id={`stepBlob-${index}`} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor={f.color} />
        </radialGradient>
      </defs>
      <path
        d="M20,4 C29,4 36,11 36,20 C36,29 29,36 20,36 C11,36 4,29 4,20 C4,11 11,4 20,4 Z"
        fill={`url(#stepBlob-${index})`}
      />
      <g fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 17 Q 14.5 14.5 17 17" />
        <path d="M23 17 Q 25.5 14.5 28 17" />
      </g>
      <path d={f.mouthD} stroke="black" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function HowItWorks() {
  const dict = useDictionary();
  const steps = dict.howItWorks.steps;

  return (
    <div className="relative space-y-8 md:space-y-12 flex flex-col items-center w-full animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight">
          {dict.howItWorks.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 @md/card:grid-cols-3 gap-4 md:gap-8 w-full px-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
            className="relative flex flex-col items-center gap-4 rounded-(--radius-card) bg-(--warmth-50)/30 border border-border/50 p-6 md:p-7 text-center"
          >
            <span className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-(--warmth-100) text-(--warmth-700) text-xs font-semibold">
              {i + 1}
            </span>
            <StepBlob index={i} />
            <h3 className="font-semibold text-base md:text-lg">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
