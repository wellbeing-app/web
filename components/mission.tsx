import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useDictionary } from '@/components/providers/dictionary-provider';

interface MissionProps {
  isFullPage?: boolean;
}

function QuoteGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M11.5 8C7 8 3.5 11.4 3.5 15.8c0 3.4 2.4 5.7 5.4 5.7 1.5 0 2.5-.4 3.2-1l.4-.3-.6.7c-1 1.2-2.4 2-4.1 2.6L9 24l1.3 2.3.6-.2c5.4-1.7 9-6 9-11.4 0-2.4-.6-4.2-1.7-5.5C16.9 8 14.4 8 11.5 8Zm15 0c-4.5 0-8 3.4-8 7.8 0 3.4 2.4 5.7 5.4 5.7 1.5 0 2.5-.4 3.2-1l.4-.3-.6.7c-1 1.2-2.4 2-4.1 2.6l-.8.3 1.3 2.3.6-.2c5.4-1.7 9-6 9-11.4 0-2.4-.6-4.2-1.7-5.5C32 8 29.5 8 26.5 8Z" />
    </svg>
  );
}

export function Mission({ isFullPage = false }: MissionProps) {
  const dict = useDictionary();
  const params = useParams();
  const lang = params.lang as string;

  return (
    <div className="relative w-full flex flex-col items-center justify-center rounded-(--radius-card-lg) animate-fade-in">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="relative z-10 px-4 py-10 md:px-6 md:py-16 text-center space-y-5 md:space-y-8 flex flex-col items-center"
      >
        <h2 className="text-(length:--text-2xl-fluid) @lg/card:text-(length:--text-3xl-fluid) font-semibold tracking-tight text-foreground/90">
          {dict.vision.title}
        </h2>

        <div className="relative max-w-2xl mx-auto">
          {/* Stylized quote glyphs in warm accent */}
          <QuoteGlyph className="hidden sm:block absolute -top-3 -left-2 md:-top-5 md:-left-3 w-7 h-7 md:w-10 md:h-10 text-(--warmth-300) opacity-80 pointer-events-none" />
          <p className="text-base md:text-2xl font-medium font-serif leading-relaxed italic text-foreground/85">
            {dict.vision.description}
          </p>
          <QuoteGlyph className="hidden sm:block absolute -bottom-7 -right-2 md:-bottom-9 md:-right-3 w-7 h-7 md:w-10 md:h-10 text-(--warmth-300) opacity-80 rotate-180 pointer-events-none" />
        </div>

        {!isFullPage && (
          <Link
            href={`/${lang}/vision`}
            className="inline-flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-(--warmth-700) transition-colors duration-(--duration-soft) group mt-2 md:mt-4 underline decoration-(--warmth-300) underline-offset-4 hover:decoration-(--warmth-700)"
          >
            <span>{dict.vision.learnMoreLink}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        )}
      </motion.div>

      {isFullPage && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full max-w-3xl mx-auto px-6 pb-32 space-y-8"
        >
          <div className="h-px w-full bg-linear-to-r from-transparent via-border/50 to-transparent" />
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground/90">
              {dict.vision.marketAnalysisTitle}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {dict.vision.marketAnalysis}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
