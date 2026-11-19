export interface CardsExpandableConfig {
  mode: 'single' | 'multiple';
  startOpen: boolean;
  columns: number;
  duration: number;
  radius: number;
  showIcons: boolean;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: CardsExpandableConfig = {
  mode: 'single',
  startOpen: true,
  columns: 2,
  duration: 380,
  radius: 18,
  showIcons: true,
  background: '#f5f6fa',
  textColor: '#151826',
  accent: '#0f766e',
};
