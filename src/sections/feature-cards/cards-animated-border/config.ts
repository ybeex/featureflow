export interface CardsAnimatedBorderConfig {
  speed: number;
  thickness: number;
  arc: number;
  onHoverOnly: boolean;
  columns: number;
  radius: number;
  background: string;
  textColor: string;
  colorA: string;
  colorB: string;
}

export const defaults: CardsAnimatedBorderConfig = {
  speed: 6,
  thickness: 2,
  arc: 90,
  onHoverOnly: false,
  columns: 3,
  radius: 22,
  background: '#0b0d12',
  textColor: '#eef0f6',
  colorA: '#22d3ee',
  colorB: '#f472b6',
};
