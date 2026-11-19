export interface InteractiveTabsIllustrationConfig {
  orientation: 'horizontal' | 'vertical';
  autoplay: boolean;
  intervalMs: number;
  transition: 'fade' | 'slide' | 'zoom';
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: InteractiveTabsIllustrationConfig = {
  orientation: 'horizontal',
  autoplay: false,
  intervalMs: 5000,
  transition: 'slide',
  radius: 20,
  background: '#f5f7fb',
  textColor: '#131726',
  accent: '#4338ca',
};
