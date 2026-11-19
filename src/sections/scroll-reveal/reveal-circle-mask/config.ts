export interface RevealCircleMaskConfig {
  maskShape: 'circle' | 'wipe' | 'curtain' | 'diagonal';
  startSize: number;
  rangeStart: number;
  rangeEnd: number;
  scrollLength: number;
  overlay: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealCircleMaskConfig = {
  maskShape: 'circle',
  startSize: 6,
  rangeStart: 0.08,
  rangeEnd: 0.8,
  scrollLength: 2.4,
  overlay: 0.55,
  background: '#14151a',
  textColor: '#f4f2ee',
  accent: '#ff8a5c',
};
