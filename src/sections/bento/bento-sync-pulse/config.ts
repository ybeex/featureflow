export interface BentoSyncPulseConfig {
  autoCycle: boolean;
  cycleMs: number;
  linkStyle: 'glow' | 'outline' | 'fill';
  showLines: boolean;
  gap: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: BentoSyncPulseConfig = {
  autoCycle: true,
  cycleMs: 2600,
  linkStyle: 'glow',
  showLines: true,
  gap: 14,
  radius: 20,
  background: '#0c1117',
  textColor: '#e9eef5',
  accent: '#a3e635',
};
