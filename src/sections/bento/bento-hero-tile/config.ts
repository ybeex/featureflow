export interface BentoHeroTileConfig {
  heroSide: 'left' | 'right';
  heroSpan: number;
  gap: number;
  radius: number;
  hoverLift: boolean;
  reveal: boolean;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: BentoHeroTileConfig = {
  heroSide: 'left',
  heroSpan: 2,
  gap: 14,
  radius: 24,
  hoverLift: true,
  reveal: true,
  background: '#eef0f6',
  textColor: '#12151f',
  accent: '#5b4bff',
};
