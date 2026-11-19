export interface HscrollLayeredPanelsConfig {
  panels: number;
  parallax: number;
  navPosition: 'top' | 'bottom';
  layerOpacity: number;
  scrollPerPanel: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: HscrollLayeredPanelsConfig = {
  panels: 4,
  parallax: 28,
  navPosition: 'top',
  layerOpacity: 0.55,
  scrollPerPanel: 1.1,
  background: '#0e1016',
  textColor: '#f3f1ec',
  accent: '#ff8a5c',
};
