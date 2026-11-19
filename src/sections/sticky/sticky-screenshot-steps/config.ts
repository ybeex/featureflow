export interface StickyScreenshotStepsConfig {
  side: 'left' | 'right';
  stickyOffset: number;
  steps: number;
  calloutStyle: 'ring' | 'glow' | 'label';
  calloutScale: number;
  duration: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StickyScreenshotStepsConfig = {
  side: 'left',
  stickyOffset: 32,
  steps: 4,
  calloutStyle: 'ring',
  calloutScale: 1,
  duration: 500,
  background: '#f4f1ea',
  textColor: '#17171c',
  accent: '#e8501f',
};
