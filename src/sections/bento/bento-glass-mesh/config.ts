export interface BentoGlassMeshConfig {
  blur: number;
  glassOpacity: number;
  meshIntensity: number;
  spotlight: boolean;
  drift: boolean;
  gap: number;
  radius: number;
  colorA: string;
  colorB: string;
  colorC: string;
  textColor: string;
}

export const defaults: BentoGlassMeshConfig = {
  blur: 18,
  glassOpacity: 0.14,
  meshIntensity: 0.9,
  spotlight: true,
  drift: true,
  gap: 14,
  radius: 26,
  colorA: '#7c3aed',
  colorB: '#06b6d4',
  colorC: '#f472b6',
  textColor: '#f8f7ff',
};
