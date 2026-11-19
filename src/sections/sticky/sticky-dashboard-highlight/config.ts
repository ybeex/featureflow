export interface StickyDashboardHighlightConfig {
  dim: number;
  highlightStyle: 'outline' | 'glow' | 'lift';
  stickyOffset: number;
  showCallouts: boolean;
  duration: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: StickyDashboardHighlightConfig = {
  dim: 0.55,
  highlightStyle: 'outline',
  stickyOffset: 24,
  showCallouts: true,
  duration: 450,
  background: '#eef0f4',
  textColor: '#14161c',
  accent: '#4f46e5',
};
