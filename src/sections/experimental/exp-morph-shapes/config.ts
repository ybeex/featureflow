export type MorphShape = 'circle' | 'blob' | 'star' | 'square';

export interface ExpMorphShapesConfig {
  first: MorphShape;
  second: MorphShape;
  third: MorphShape;
  points: number;
  rotation: number;
  filled: boolean;
  strokeWidth: number;
  colorA: string;
  colorB: string;
  scrollLength: number;
  textColor: string;
  background: string;
}

export const defaults: ExpMorphShapesConfig = {
  first: 'circle',
  second: 'star',
  third: 'blob',
  points: 96,
  rotation: 90,
  filled: true,
  strokeWidth: 3,
  colorA: '#f97316',
  colorB: '#8b5cf6',
  scrollLength: 1.6,
  textColor: '#f5f3ff',
  background: '#0d0b14',
};
