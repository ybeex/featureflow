export interface StickyTextMediaConfig {
  columnRatio: number;
  stickyOffset: number;
  imageCount: number;
  gap: number;
  imageRatio: number;
  radius: number;
  dimInactive: number;
  duration: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StickyTextMediaConfig = {
  columnRatio: 40,
  stickyOffset: 40,
  imageCount: 4,
  gap: 48,
  imageRatio: 1.3,
  radius: 18,
  dimInactive: 0.45,
  duration: 450,
  background: '#f7f5f0',
  textColor: '#17171c',
  accent: '#c2410c',
};
