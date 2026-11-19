export interface TypeBigNumbersConfig {
  fill: 'sweep' | 'solid';
  idleOpacity: number;
  align: 'left' | 'center';
  fontSize: number;
  rowGap: number;
  background: string;
  textColor: string;
  accent: string;
  accent2: string;
}

export const defaults: TypeBigNumbersConfig = {
  fill: 'sweep',
  idleOpacity: 0.18,
  align: 'left',
  fontSize: 180,
  rowGap: 40,
  background: '#0e1012',
  textColor: '#f2f3f5',
  accent: '#f97316',
  accent2: '#ec4899',
};
