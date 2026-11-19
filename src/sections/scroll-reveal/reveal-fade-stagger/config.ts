export interface RevealFadeStaggerConfig {
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
  duration: number;
  stagger: number;
  threshold: number;
  replay: 'once' | 'replay';
  sequence: boolean;
  easing: string;
  columns: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealFadeStaggerConfig = {
  direction: 'up',
  distance: 32,
  duration: 700,
  stagger: 90,
  threshold: 0.25,
  replay: 'once',
  sequence: true,
  easing: 'smooth',
  columns: 3,
  radius: 16,
  background: '#ffffff',
  textColor: '#17171c',
  accent: '#ff6a3d',
};
