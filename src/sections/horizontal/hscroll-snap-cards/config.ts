export interface HscrollSnapCardsConfig {
  cardWidth: number;
  gap: number;
  snapAlign: 'start' | 'center';
  inset: number;
  showDots: boolean;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: HscrollSnapCardsConfig = {
  cardWidth: 300,
  gap: 20,
  snapAlign: 'start',
  inset: 32,
  showDots: true,
  radius: 20,
  background: '#f3f5f9',
  textColor: '#14161c',
  accent: '#4f46e5',
};
