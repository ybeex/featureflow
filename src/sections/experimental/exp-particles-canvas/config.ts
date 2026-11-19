export interface ExpParticlesCanvasConfig {
  word: string;
  count: number;
  size: number;
  repelRadius: number;
  ease: number;
  assemble: 'scroll' | 'auto';
  background: string;
  colorA: string;
  colorB: string;
}

export const defaults: ExpParticlesCanvasConfig = {
  word: 'FLOW',
  count: 1400,
  size: 2.2,
  repelRadius: 90,
  ease: 0.09,
  assemble: 'scroll',
  background: '#07080c',
  colorA: '#38bdf8',
  colorB: '#f472b6',
};
