export interface StackScreenshotLayersConfig {
  screenshotCount: number;
  overlap: number;
  parallax: number;
  tilt: number;
  scrollLength: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StackScreenshotLayersConfig = {
  screenshotCount: 4,
  overlap: 16,
  parallax: 160,
  tilt: 4,
  scrollLength: 3.5,
  background: '#f5f0e8',
  textColor: '#17171c',
  accent: '#e8501f',
};
