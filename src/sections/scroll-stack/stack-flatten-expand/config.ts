export interface StackFlattenExpandConfig {
  cardCount: number;
  startWidth: number;
  finalRadius: number;
  startRadius: number;
  tilt: number;
  stickyOffset: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StackFlattenExpandConfig = {
  cardCount: 4,
  startWidth: 72,
  finalRadius: 0,
  startRadius: 36,
  tilt: 3,
  stickyOffset: 0,
  background: '#ece8df',
  textColor: '#17171c',
  accent: '#e8501f',
};
