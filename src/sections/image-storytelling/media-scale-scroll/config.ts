export interface MediaScaleScrollConfig {
  startScale: number;
  startRadius: number;
  overlay: number;
  scrollLength: number;
  captionAt: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: MediaScaleScrollConfig = {
  startScale: 48,
  startRadius: 36,
  overlay: 0.45,
  scrollLength: 1.6,
  captionAt: 0.6,
  background: '#0d0e12',
  textColor: '#f6f4ef',
  accent: '#fbbf24',
};
