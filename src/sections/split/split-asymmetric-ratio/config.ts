export interface SplitAsymmetricRatioConfig {
  ratio: number;
  alternate: boolean;
  align: 'start' | 'center' | 'end';
  gap: number;
  rows: number;
  radius: number;
  reveal: boolean;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: SplitAsymmetricRatioConfig = {
  ratio: 62,
  alternate: true,
  align: 'center',
  gap: 48,
  rows: 3,
  radius: 22,
  reveal: true,
  background: '#fbf8f3',
  textColor: '#1e1a16',
  accent: '#c2410c',
};
