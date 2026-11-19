export interface RevealClipImageConfig {
  direction: 'alternate' | 'left' | 'right' | 'center';
  duration: number;
  easing: string;
  threshold: number;
  replay: 'once' | 'replay';
  imageRatio: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealClipImageConfig = {
  direction: 'alternate',
  duration: 1100,
  easing: 'smooth',
  threshold: 0.35,
  replay: 'once',
  imageRatio: 1.5,
  radius: 14,
  background: '#f6f2ea',
  textColor: '#17171c',
  accent: '#d2461b',
};
