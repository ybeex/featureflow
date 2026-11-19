export interface StackStickyCardsConfig {
  cardCount: number;
  stickyTop: number;
  stackOffset: number;
  gap: number;
  radius: number;
  scaleStep: number;
  background: string;
  textColor: string;
  accent: string;
  shadow: number;
}

export const defaults: StackStickyCardsConfig = {
  cardCount: 4,
  stickyTop: 24,
  stackOffset: 18,
  gap: 56,
  radius: 22,
  scaleStep: 0.04,
  background: '#f6f4ef',
  textColor: '#17171c',
  accent: '#ff6a3d',
  shadow: 0.35,
};
