export interface RevealSvgDrawConfig {
  steps: number;
  strokeWidth: number;
  curvature: number;
  nodeSize: number;
  drawStart: number;
  drawEnd: number;
  scrollLength: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: RevealSvgDrawConfig = {
  steps: 5,
  strokeWidth: 4,
  curvature: 70,
  nodeSize: 22,
  drawStart: 0.1,
  drawEnd: 0.85,
  scrollLength: 2.4,
  background: '#fbf8f2',
  textColor: '#17171c',
  accent: '#e8501f',
};
