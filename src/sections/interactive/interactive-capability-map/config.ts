export interface InteractiveCapabilityMapConfig {
  filter: 'all' | 'build' | 'run' | 'secure';
  showLabels: boolean;
  showLinks: boolean;
  nodeSize: number;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: InteractiveCapabilityMapConfig = {
  filter: 'all',
  showLabels: true,
  showLinks: true,
  nodeSize: 34,
  radius: 36,
  background: '#0b1018',
  textColor: '#e8edf5',
  accent: '#38bdf8',
};
