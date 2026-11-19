export interface StackPerspectiveDepthConfig {
  cardCount: number;
  perspective: number;
  depthStep: number;
  tilt: number;
  fade: number;
  radius: number;
  scrollLength: number;
  background: string;
  textColor: string;
  accent: string;
  surface: string;
}

export const defaults: StackPerspectiveDepthConfig = {
  cardCount: 5,
  perspective: 1100,
  depthStep: 90,
  tilt: 12,
  fade: 0.2,
  radius: 22,
  scrollLength: 4,
  background: '#0d0e16',
  textColor: '#ecebf5',
  accent: '#9b8cff',
  surface: '#1a1b2b',
};
