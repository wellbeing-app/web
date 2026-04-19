export type ScreenerId = 'who5' | 'phq9' | 'gad7';

export type SeverityKey =
  | 'who5_good'
  | 'who5_low'
  | 'who5_poor'
  | 'minimal'
  | 'mild'
  | 'moderate'
  | 'moderatelySevere'
  | 'severe';

export interface ScreenerSpec {
  id: ScreenerId;
  itemCount: number;
  scaleSize: number;
  maxRawScore: number;
}

export const SCREENERS: Record<ScreenerId, ScreenerSpec> = {
  who5: { id: 'who5', itemCount: 5, scaleSize: 6, maxRawScore: 25 },
  phq9: { id: 'phq9', itemCount: 9, scaleSize: 4, maxRawScore: 27 },
  gad7: { id: 'gad7', itemCount: 7, scaleSize: 4, maxRawScore: 21 },
};

export interface ScreenerResult {
  id: ScreenerId;
  rawScore: number;
  displayScore: number;
  displayMax: number;
  severity: SeverityKey;
  suggestedFeatureIndexes: number[];
  showCrisis: boolean;
}

// Feature indexes match fullList in dictionaries:
// 0 Personalization · 1 Digital Diary · 2 Monitoring · 3 Therapeutic Tools ·
// 4 Goals · 5 Analytics · 6 Crisis Support
const SUGGEST = {
  who5_good: [1, 5, 4],
  who5_low: [1, 3, 4],
  who5_poor: [3, 5, 6],
  phq9_minimal: [1, 5],
  phq9_mild: [1, 3, 2],
  phq9_moderate: [3, 1, 4],
  phq9_modSevere: [3, 6, 5],
  phq9_severe: [6, 3],
  gad7_minimal: [1, 5],
  gad7_mild: [3, 1],
  gad7_moderate: [3, 2, 1],
  gad7_severe: [3, 6],
} as const;

export function scoreScreener(id: ScreenerId, answers: number[]): ScreenerResult {
  const rawScore = answers.reduce((a, b) => a + b, 0);

  if (id === 'who5') {
    const displayScore = rawScore * 4;
    let severity: SeverityKey;
    let suggestedFeatureIndexes: readonly number[];
    if (displayScore <= 28) {
      severity = 'who5_poor';
      suggestedFeatureIndexes = SUGGEST.who5_poor;
    } else if (displayScore <= 50) {
      severity = 'who5_low';
      suggestedFeatureIndexes = SUGGEST.who5_low;
    } else {
      severity = 'who5_good';
      suggestedFeatureIndexes = SUGGEST.who5_good;
    }
    return {
      id,
      rawScore,
      displayScore,
      displayMax: 100,
      severity,
      suggestedFeatureIndexes: [...suggestedFeatureIndexes],
      showCrisis: false,
    };
  }

  if (id === 'phq9') {
    // Item 9 (index 8) is the self-harm item — any non-zero answer triggers
    // crisis handoff regardless of total score.
    const item9 = answers[8] ?? 0;
    let severity: SeverityKey;
    let suggestedFeatureIndexes: readonly number[];
    if (rawScore <= 4) {
      severity = 'minimal';
      suggestedFeatureIndexes = SUGGEST.phq9_minimal;
    } else if (rawScore <= 9) {
      severity = 'mild';
      suggestedFeatureIndexes = SUGGEST.phq9_mild;
    } else if (rawScore <= 14) {
      severity = 'moderate';
      suggestedFeatureIndexes = SUGGEST.phq9_moderate;
    } else if (rawScore <= 19) {
      severity = 'moderatelySevere';
      suggestedFeatureIndexes = SUGGEST.phq9_modSevere;
    } else {
      severity = 'severe';
      suggestedFeatureIndexes = SUGGEST.phq9_severe;
    }
    return {
      id,
      rawScore,
      displayScore: rawScore,
      displayMax: 27,
      severity,
      suggestedFeatureIndexes: [...suggestedFeatureIndexes],
      showCrisis: item9 > 0 || rawScore >= 20,
    };
  }

  // gad7
  let severity: SeverityKey;
  let suggestedFeatureIndexes: readonly number[];
  if (rawScore <= 4) {
    severity = 'minimal';
    suggestedFeatureIndexes = SUGGEST.gad7_minimal;
  } else if (rawScore <= 9) {
    severity = 'mild';
    suggestedFeatureIndexes = SUGGEST.gad7_mild;
  } else if (rawScore <= 14) {
    severity = 'moderate';
    suggestedFeatureIndexes = SUGGEST.gad7_moderate;
  } else {
    severity = 'severe';
    suggestedFeatureIndexes = SUGGEST.gad7_severe;
  }
  return {
    id,
    rawScore,
    displayScore: rawScore,
    displayMax: 21,
    severity,
    suggestedFeatureIndexes: [...suggestedFeatureIndexes],
    showCrisis: rawScore >= 15,
  };
}
