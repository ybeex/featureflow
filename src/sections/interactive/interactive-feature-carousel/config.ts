export interface InteractiveFeatureCarouselConfig {
  loop: boolean;
  autoplay: boolean;
  intervalMs: number;
  sideScale: number;
  sideOpacity: number;
  cardWidth: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: InteractiveFeatureCarouselConfig = {
  loop: true,
  autoplay: false,
  intervalMs: 4500,
  sideScale: 0.82,
  sideOpacity: 0.5,
  cardWidth: 56,
  radius: 24,
  background: '#12141c',
  textColor: '#eff1f8',
  accent: '#facc15',
};
