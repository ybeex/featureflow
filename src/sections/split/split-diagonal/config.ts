export interface SplitDiagonalConfig {
  angle: number;
  travel: number;
  seam: number;
  reverse: boolean;
  seamGlow: boolean;
  leftColor: string;
  rightColor: string;
  textColor: string;
  accent: string;
}

export const defaults: SplitDiagonalConfig = {
  angle: 12,
  travel: 8,
  seam: 4,
  reverse: false,
  seamGlow: true,
  leftColor: '#14213d',
  rightColor: '#f4efe6',
  textColor: '#0f1420',
  accent: '#ffb703',
};
