export interface BentoLiveMetricsConfig {
  tickMs: number;
  volatility: number;
  sparklines: boolean;
  pointsShown: number;
  gap: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: BentoLiveMetricsConfig = {
  tickMs: 1400,
  volatility: 12,
  sparklines: true,
  pointsShown: 24,
  gap: 14,
  radius: 20,
  background: '#0a0f1a',
  textColor: '#e6ecf7',
  accent: '#22d3ee',
};
