export interface InteractiveProductStatesConfig {
  initial: 'empty' | 'loading' | 'ready' | 'error';
  theme: 'light' | 'dark';
  rows: number;
  loadMs: number;
  annotate: boolean;
  radius: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: InteractiveProductStatesConfig = {
  initial: 'ready',
  theme: 'light',
  rows: 5,
  loadMs: 1600,
  annotate: true,
  radius: 16,
  background: '#eef1f6',
  textColor: '#111827',
  accent: '#2563eb',
};
