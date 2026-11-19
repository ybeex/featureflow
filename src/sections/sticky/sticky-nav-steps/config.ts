export interface StickyNavStepsConfig {
  navSide: 'left' | 'right';
  stickyOffset: number;
  steps: number;
  progressStyle: 'line' | 'bar' | 'none';
  scrollBehavior: 'smooth' | 'instant';
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StickyNavStepsConfig = {
  navSide: 'left',
  stickyOffset: 24,
  steps: 5,
  progressStyle: 'line',
  scrollBehavior: 'smooth',
  background: '#ffffff',
  textColor: '#17171c',
  accent: '#2563eb',
};
