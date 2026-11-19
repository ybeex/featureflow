export interface MediaParallaxLayersConfig {
  intensity: number;
  layers: number;
  mist: number;
  textDepth: number;
  height: number;
  skyHue: number;
  background: string;
  textColor: string;
}

export const defaults: MediaParallaxLayersConfig = {
  intensity: 60,
  layers: 4,
  mist: 0.5,
  textDepth: 0.5,
  height: 1.3,
  skyHue: 215,
  background: '#0a0f1e',
  textColor: '#f5f7ff',
};
