export interface TypeKineticMarqueeConfig {
  rows: number;
  speed: number;
  scrollBoost: number;
  ghost: boolean;
  skew: number;
  pauseOnHover: boolean;
  fontSize: number;
  background: string;
  textColor: string;
  accent: string;
}

export const defaults: TypeKineticMarqueeConfig = {
  rows: 3,
  speed: 60,
  scrollBoost: 4,
  ghost: true,
  skew: -6,
  pauseOnHover: true,
  fontSize: 88,
  background: '#0c0c0f',
  textColor: '#f4f3ef',
  accent: '#a3e635',
};
