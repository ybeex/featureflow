export interface TypeEmphasisScrollConfig {
  mark: 'marker' | 'underline' | 'color';
  dimOthers: boolean;
  fontSize: number;
  thickness: number;
  bandSize: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TypeEmphasisScrollConfig = {
  mark: 'marker',
  dimOthers: true,
  fontSize: 44,
  thickness: 45,
  bandSize: 30,
  background: '#faf7f0',
  textColor: '#1a1814',
  accent: '#ffd43b',
};
