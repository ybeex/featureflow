export interface CardsTilt3dConfig {
  maxTilt: number;
  perspective: number;
  glare: boolean;
  lift: number;
  depth: boolean;
  columns: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: CardsTilt3dConfig = {
  maxTilt: 12,
  perspective: 900,
  glare: true,
  lift: 14,
  depth: true,
  columns: 3,
  radius: 22,
  background: '#12131a',
  textColor: '#f1f2f8',
  accent: '#fb923c',
};
