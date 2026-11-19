export interface TimelineStickyProcessConfig {
  steps: number;
  transition: 'fade' | 'slide';
  showNumbers: boolean;
  scrollPerStep: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TimelineStickyProcessConfig = {
  steps: 4,
  transition: 'slide',
  showNumbers: true,
  scrollPerStep: 0.9,
  background: '#0f1318',
  textColor: '#edf1f6',
  accent: '#f59e0b',
};
