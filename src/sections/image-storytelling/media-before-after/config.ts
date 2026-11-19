export interface MediaBeforeAfterConfig {
  startPosition: number;
  handleStyle: 'circle' | 'bar' | 'pill';
  showLabels: boolean;
  dividerWidth: number;
  aspectRatio: '16 / 10' | '3 / 2' | '21 / 9';
  radius: number;
  background: string;
  textColor: string;
  accent: string;
  introSweep: boolean;
  smoothing: number;
}

export const defaults: MediaBeforeAfterConfig = {
  startPosition: 50,
  handleStyle: 'circle',
  showLabels: true,
  dividerWidth: 3,
  aspectRatio: '16 / 10',
  radius: 20,
  background: '#f4f2ee',
  textColor: '#17171c',
  accent: '#ff6a3d',
  introSweep: true,
  smoothing: 160,
};
