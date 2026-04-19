'use client';

import { useState } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDictionary } from '@/components/providers/dictionary-provider';
import { cn } from '@/lib/utils';
import { SCREENERS, scoreScreener, type ScreenerId, type ScreenerResult } from '@/lib/screeners';

type View =
  | { kind: 'picker' }
  | { kind: 'quiz'; id: ScreenerId; step: number; answers: number[] }
  | { kind: 'result'; result: ScreenerResult };

const INSTRUMENT_ORDER: ScreenerId[] = ['who5', 'phq9', 'gad7'];

export function Screener() {
  const dict = useDictionary();
  const [view, setView] = useState<View>({ kind: 'picker' });

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-border/50 bg-card p-6 md:p-10 shadow-xs">
      <div className="text-center space-y-3 mb-8">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.screener.heading}</h3>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {dict.screener.intro}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {view.kind === 'picker' && (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <PickerView
              onPick={(id) =>
                setView({ kind: 'quiz', id, step: 0, answers: Array(SCREENERS[id].itemCount).fill(-1) })
              }
            />
          </motion.div>
        )}

        {view.kind === 'quiz' && (
          <motion.div
            key={`quiz-${view.id}-${view.step}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <QuizView
              view={view}
              onAnswer={(score) => {
                const nextAnswers = [...view.answers];
                nextAnswers[view.step] = score;
                const isLast = view.step === SCREENERS[view.id].itemCount - 1;
                if (isLast) {
                  setView({ kind: 'result', result: scoreScreener(view.id, nextAnswers) });
                } else {
                  setView({ ...view, step: view.step + 1, answers: nextAnswers });
                }
              }}
              onBack={() => {
                if (view.step === 0) {
                  setView({ kind: 'picker' });
                } else {
                  setView({ ...view, step: view.step - 1 });
                }
              }}
            />
          </motion.div>
        )}

        {view.kind === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <ResultView
              result={view.result}
              onRestart={() =>
                setView({
                  kind: 'quiz',
                  id: view.result.id,
                  step: 0,
                  answers: Array(SCREENERS[view.result.id].itemCount).fill(-1),
                })
              }
              onChange={() => setView({ kind: 'picker' })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PickerView({ onPick }: { onPick: (id: ScreenerId) => void }) {
  const dict = useDictionary();
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground/80 text-center">{dict.screener.pickPrompt}</p>
      <div className="grid gap-3">
        {INSTRUMENT_ORDER.map((id) => {
          const meta = dict.screener.instruments[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              className="group flex items-center justify-between gap-4 text-left w-full rounded-2xl border border-border bg-secondary/20 hover:bg-secondary/40 px-5 py-4 transition-all hover:border-border cursor-pointer"
            >
              <div>
                <div className="font-semibold">{meta.name}</div>
                <div className="text-sm text-muted-foreground">{meta.blurb}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizView({
  view,
  onAnswer,
  onBack,
}: {
  view: Extract<View, { kind: 'quiz' }>;
  onAnswer: (score: number) => void;
  onBack: () => void;
}) {
  const dict = useDictionary();
  const meta = dict.screener.instruments[view.id];
  const spec = SCREENERS[view.id];
  const progressText = dict.screener.ui.progress
    .replace('{current}', String(view.step + 1))
    .replace('{total}', String(spec.itemCount));
  const currentAnswer = view.answers[view.step];
  const progressPct = ((view.step + 1) / spec.itemCount) * 100;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{meta.name}</span>
          <span>{progressText}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary/40 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{meta.timeframe}</p>
        <p className="text-lg md:text-xl font-medium leading-relaxed">{meta.items[view.step]}</p>
      </div>

      <div className="grid gap-2">
        {meta.scale.map((label, scoreValue) => (
          <button
            key={scoreValue}
            type="button"
            onClick={() => onAnswer(scoreValue)}
            className={cn(
              'w-full text-left rounded-xl border px-4 py-3 text-sm md:text-base transition-all cursor-pointer',
              currentAnswer === scoreValue
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-border bg-secondary/10 hover:bg-secondary/30',
            )}
            aria-pressed={currentAnswer === scoreValue}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {dict.screener.ui.back}
        </button>
      </div>
    </div>
  );
}

function ResultView({
  result,
  onRestart,
  onChange,
}: {
  result: ScreenerResult;
  onRestart: () => void;
  onChange: () => void;
}) {
  const dict = useDictionary();
  const meta = dict.screener.instruments[result.id];
  const severityLabel = dict.screener.severityLabels[result.severity];
  const suggestions = result.suggestedFeatureIndexes
    .map((i) => dict.features.fullList[i])
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{meta.name}</div>
        <div className="text-sm text-muted-foreground">{dict.screener.ui.scoreLabel}</div>
        <div className="text-5xl md:text-6xl font-bold tracking-tight">
          {result.displayScore}
          <span className="text-2xl md:text-3xl text-muted-foreground font-normal">
            {' / '}
            {result.displayMax}
          </span>
        </div>
        <div className="inline-flex items-center rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-sm font-medium">
          {severityLabel}
        </div>
      </div>

      {result.showCrisis && (
        <div
          role="alert"
          className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5"
        >
          <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <div className="font-semibold text-destructive">{dict.screener.ui.crisisTitle}</div>
            <p className="text-sm leading-relaxed text-foreground/90">{dict.screener.ui.crisisBody}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="text-sm font-medium text-foreground/80">{dict.screener.ui.suggestedLabel}</div>
        <div className="grid gap-2 md:grid-cols-2">
          {suggestions.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-secondary/10 p-4"
            >
              <div className="font-semibold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-xl mx-auto">
        {dict.screener.ui.disclaimer}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary/40 transition-colors cursor-pointer"
        >
          {dict.screener.ui.startOver}
        </button>
        <button
          type="button"
          onClick={onChange}
          className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {dict.screener.ui.changeInstrument}
        </button>
      </div>
    </div>
  );
}
