export interface TypeSplitLinesConfig {
  direction: 'up' | 'down';
  stagger: number;
  duration: number;
  distance: number;
  replay: boolean;
  fontSize: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TypeSplitLinesConfig = {
  direction: 'up',
  stagger: 110,
  duration: 900,
  distance: 110,
  replay: false,
  fontSize: 84,
  background: '#f4f1ea',
  textColor: '#15130f',
  accent: '#dc2626',
};
