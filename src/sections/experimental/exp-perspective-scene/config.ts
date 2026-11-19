export interface ExpPerspectiveSceneConfig {
  panels: number;
  spacing: number;
  perspective: number;
  sway: number;
  fog: number;
  scrollLength: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: ExpPerspectiveSceneConfig = {
  panels: 6,
  spacing: 520,
  perspective: 900,
  sway: 12,
  fog: 0.75,
  scrollLength: 2.4,
  background: '#090a10',
  textColor: '#f1f2f8',
  accent: '#818cf8',
};
