export interface MediaImageSequenceConfig {
  frames: number;
  parts: number;
  spread: number;
  showCounter: boolean;
  rotate: boolean;
  scrollLength: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: MediaImageSequenceConfig = {
  frames: 48,
  parts: 5,
  spread: 70,
  showCounter: true,
  rotate: true,
  scrollLength: 1.8,
  background: '#0b0d12',
  textColor: '#eef1f7',
  accent: '#22d3ee',
};
