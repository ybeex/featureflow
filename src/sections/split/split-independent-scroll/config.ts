export interface SplitIndependentScrollConfig {
  direction: 'opposite' | 'same';
  speed: number;
  cards: number;
  gap: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: SplitIndependentScrollConfig = {
  direction: 'opposite',
  speed: 1,
  cards: 6,
  gap: 16,
  radius: 18,
  background: '#0b1220',
  textColor: '#e8edf7',
  accent: '#60a5fa',
};
