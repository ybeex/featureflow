import type { ColorControl, ControlGroup, RangeControl, SelectControl, ToggleControl } from './types';
import { EASING_OPTIONS } from '../ff/easing';

export const range = (key: string, label: string, group: ControlGroup, min: number, max: number, step: number, unit?: string, hint?: string): RangeControl => ({
  type: 'range', key, label, group, min, max, step, unit, hint,
});
export const color = (key: string, label: string, group: ControlGroup = 'style', hint?: string): ColorControl => ({ type: 'color', key, label, group, hint });
export const select = (key: string, label: string, group: ControlGroup, options: [string, string][] | string[], hint?: string): SelectControl => ({
  type: 'select', key, label, group, hint,
  options: options.map((o) => (typeof o === 'string' ? { value: o, label: o } : { value: o[0], label: o[1] })),
});
export const toggle = (key: string, label: string, group: ControlGroup, hint?: string): ToggleControl => ({ type: 'toggle', key, label, group, hint });

/** Easing selector shared by every section that animates over time. */
export const easingControl = (key = 'easing') => select(key, 'Easing', 'motion', EASING_OPTIONS.map((o) => [o.value, o.label] as [string, string]));
