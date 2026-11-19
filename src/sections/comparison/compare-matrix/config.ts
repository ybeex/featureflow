export interface CompareMatrixConfig {
  highlight: 'pro' | 'team' | 'free';
  differencesOnly: boolean;
  stickyHeader: boolean;
  density: 'comfortable' | 'compact';
  rowHover: boolean;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: CompareMatrixConfig = {
  highlight: 'team',
  differencesOnly: false,
  stickyHeader: true,
  density: 'comfortable',
  rowHover: true,
  radius: 18,
  background: '#f6f7fb',
  textColor: '#141824',
  accent: '#4f46e5',
};
