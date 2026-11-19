export interface StickyThemePanelsConfig {
  palette: 'editorial' | 'neon' | 'earth';
  panels: number;
  duration: number;
  easing: string;
  textScale: number;
  stickyOffset: number;
}

export const defaults: StickyThemePanelsConfig = {
  palette: 'editorial',
  panels: 4,
  duration: 700,
  easing: 'smooth',
  textScale: 1,
  stickyOffset: 0,
};
