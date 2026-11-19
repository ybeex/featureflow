export type EasingName = 'smooth' | 'snappy' | 'gentle' | 'bounce' | 'linear';

const CURVES: Record<EasingName, [number, number, number, number]> = {
  smooth: [0.22, 1, 0.36, 1],
  snappy: [0.16, 1, 0.3, 1],
  gentle: [0.45, 0, 0.15, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  linear: [0, 0, 1, 1],
};

export const EASING_OPTIONS: { value: EasingName; label: string }[] = [
  { value: 'smooth', label: 'Smooth out' },
  { value: 'snappy', label: 'Snappy' },
  { value: 'gentle', label: 'Gentle in-out' },
  { value: 'bounce', label: 'Overshoot' },
  { value: 'linear', label: 'Linear' },
];

/** CSS timing function string, e.g. for `transition-timing-function`. */
export function easingCss(name: string): string {
  const c = CURVES[name as EasingName] ?? CURVES.smooth;
  return `cubic-bezier(${c.join(',')})`;
}

/** Cubic-bezier tuple, e.g. for Motion's `ease` option. */
export function easingTuple(name: string): [number, number, number, number] {
  return CURVES[name as EasingName] ?? CURVES.smooth;
}
