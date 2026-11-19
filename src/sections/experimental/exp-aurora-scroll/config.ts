export interface ExpAuroraScrollConfig {
  hueStart: number;
  hueTravel: number;
  blur: number;
  intensity: number;
  followPointer: boolean;
  grain: boolean;
  scrollLength: number;
  textColor: string;
}

export const defaults: ExpAuroraScrollConfig = {
  hueStart: 160,
  hueTravel: 140,
  blur: 70,
  intensity: 0.85,
  followPointer: true,
  grain: true,
  scrollLength: 1.4,
  textColor: '#f3f8f6',
};
