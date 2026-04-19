import { motion } from 'framer-motion';
import { useDictionary } from '@/components/providers/dictionary-provider';

interface MissionProps {
  isFullPage?: boolean;
}

export function Mission({ isFullPage = false }: MissionProps) {
  const dict = useDictionary();
  return (
    <div className="relative w-full flex flex-col items-center justify-center overflow-hidden rounded-4xl shadow-xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="relative z-10 px-6 py-20 text-center space-y-8"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground/90">
          {dict.vision.title}
        </h2>

        <div className="relative max-w-2xl mx-auto">
          {/* Stylized Quotes */}
          <span className="absolute -top-6 -left-4 text-6xl text-primary/10 font-serif leading-none italic pointer-events-none">
            &ldquo;
          </span>
          <p className="text-xl md:text-2xl font-medium font-serif leading-relaxed italic text-foreground/80 lowercase first-letter:uppercase">
            {dict.vision.description}
          </p>
          <span className="absolute -bottom-10 -right-4 text-6xl text-primary/10 font-serif leading-none italic pointer-events-none">
            &rdquo;
          </span>
        </div>
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
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground/90">
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
