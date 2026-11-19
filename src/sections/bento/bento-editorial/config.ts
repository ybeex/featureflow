export interface BentoEditorialConfig {
  serif: boolean;
  density: 'airy' | 'compact';
  border: 'hairline' | 'bold' | 'none';
  numberScale: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
  paper: string;
}

export const defaults: BentoEditorialConfig = {
  serif: true,
  density: 'airy',
  border: 'hairline',
  numberScale: 1,
  radius: 4,
  background: '#f3ede2',
  textColor: '#1b1a17',
  accent: '#b4341a',
  paper: '#fbf7ee',
};
