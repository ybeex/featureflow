export interface RevealBlurSweepConfig {
  blur: number;
  duration: number;
  sequenceGap: number;
  sweepAngle: number;
  threshold: number;
  replay: 'once' | 'replay';
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealBlurSweepConfig = {
  blur: 14,
  duration: 800,
  sequenceGap: 140,
  sweepAngle: 100,
  threshold: 0.3,
  replay: 'once',
  background: '#ffffff',
  textColor: '#17171c',
  accent: '#7c3aed',
};
