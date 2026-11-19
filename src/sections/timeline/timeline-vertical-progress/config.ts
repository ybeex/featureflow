export interface TimelineVerticalProgressConfig {
  layout: 'alternate' | 'left';
  marker: 'dot' | 'number';
  lineWidth: number;
  dim: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TimelineVerticalProgressConfig = {
  layout: 'alternate',
  marker: 'number',
  lineWidth: 3,
  dim: 0.35,
  radius: 16,
  background: '#fbfaf7',
  textColor: '#1d1b16',
  accent: '#0e7490',
};
