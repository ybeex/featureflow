export interface CardsSpotlightConfig {
  columns: number;
  spotlightSize: number;
  spotlightStrength: number;
  borderGlow: boolean;
  gap: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: CardsSpotlightConfig = {
  columns: 3,
  spotlightSize: 320,
  spotlightStrength: 0.35,
  borderGlow: true,
  gap: 14,
  radius: 20,
  background: '#08090d',
  textColor: '#ecedf3',
  accent: '#818cf8',
};
