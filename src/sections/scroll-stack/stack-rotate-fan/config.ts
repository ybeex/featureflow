export interface StackRotateFanConfig {
  cardCount: number;
  fanAngle: number;
  spreadRadius: number;
  pivotOffset: number;
  cardWidth: number;
  radius: number;
  scrollLength: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StackRotateFanConfig = {
  cardCount: 5,
  fanAngle: 52,
  spreadRadius: 720,
  pivotOffset: 0,
  cardWidth: 240,
  radius: 20,
  scrollLength: 3,
  background: '#14121f',
  textColor: '#f4f1fb',
  accent: '#a78bfa',
};
