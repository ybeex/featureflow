export interface MediaDeviceCalloutsConfig {
  device: 'laptop' | 'phone';
  autoTour: boolean;
  tourMs: number;
  showNumbers: boolean;
  pulse: boolean;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: MediaDeviceCalloutsConfig = {
  device: 'laptop',
  autoTour: true,
  tourMs: 3200,
  showNumbers: true,
  pulse: true,
  background: '#f1f4f9',
  textColor: '#101626',
  accent: '#e11d48',
};
