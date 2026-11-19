export interface TypeVariableWeightConfig {
  mode: 'pointer' | 'scroll' | 'wave';
  minWeight: number;
  maxWeight: number;
  radius: number;
  fontSize: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TypeVariableWeightConfig = {
  mode: 'pointer',
  minWeight: 200,
  maxWeight: 900,
  radius: 180,
  fontSize: 120,
  background: '#f6f2ea',
  textColor: '#1a1712',
  accent: '#c2410c',
};
