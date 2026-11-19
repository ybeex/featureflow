export interface RevealCountersConfig {
  duration: number;
  easing: string;
  stagger: number;
  columns: number;
  replay: 'once' | 'replay';
  startFrom: 'zero' | 'half';
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealCountersConfig = {
  duration: 1800,
  easing: 'smooth',
  stagger: 140,
  columns: 4,
  replay: 'once',
  startFrom: 'zero',
  radius: 18,
  background: '#101418',
  textColor: '#f2f4f5',
  accent: '#5eead4',
};
