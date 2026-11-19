export interface StackNumberedStepsConfig {
  steps: number;
  showRail: boolean;
  stickyOffset: number;
  cardHeight: number;
  stackOffset: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
  scaleStep: number;
}

export const defaults: StackNumberedStepsConfig = {
  steps: 5,
  showRail: true,
  stickyOffset: 56,
  cardHeight: 56,
  stackOffset: 14,
  radius: 20,
  background: '#0f1115',
  textColor: '#f3f1ec',
  accent: '#ff7a45',
  scaleStep: 0.03,
};
