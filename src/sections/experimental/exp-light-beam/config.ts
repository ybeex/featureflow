export interface ExpLightBeamConfig {
  radius: number;
  softness: number;
  ambient: number;
  smoothing: number;
  autoSweep: boolean;
  sweepSpeed: number;
  tint: string;
  textColor: string;
  background: string;
  headline: string;
}

export const defaults: ExpLightBeamConfig = {
  radius: 190,
  softness: 0.7,
  ambient: 0.4,
  smoothing: 0.14,
  autoSweep: true,
  sweepSpeed: 1,
  tint: '#fde68a',
  textColor: '#fafaf9',
  background: '#0b0a09',
  headline: 'Shine a light on what matters',
};
