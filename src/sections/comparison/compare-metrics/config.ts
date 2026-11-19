export interface CompareMetricsConfig {
  sort: 'listed' | 'best';
  showValues: boolean;
  barHeight: number;
  animate: boolean;
  duration: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
  rival: string;
}

export const defaults: CompareMetricsConfig = {
  sort: 'listed',
  showValues: true,
  barHeight: 14,
  animate: true,
  duration: 1100,
  radius: 8,
  background: '#0f1115',
  textColor: '#eceff4',
  accent: '#38bdf8',
  rival: '#6b7280',
};
