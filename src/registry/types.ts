import type { ComponentType } from 'react';
import type { SectionProps } from '../ff/types';

export const CATEGORY_IDS = [
  'scroll-stack',
  'scroll-reveal',
  'sticky',
  'horizontal',
  'split',
  'bento',
  'feature-cards',
  'image-storytelling',
  'typography',
  'interactive',
  'timeline',
  'comparison',
  'experimental',
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export type Complexity = 'simple' | 'moderate' | 'advanced';

export const TECHNIQUES = [
  'css-sticky',
  'scroll-var',
  'motion-scroll',
  'intersection-observer',
  'raf-loop',
  'css-animation',
  'css-transition',
  'scroll-snap',
  'svg',
  'canvas',
  'pointer-tracking',
  'clip-path',
  'state-machine',
] as const;
export type Technique = (typeof TECHNIQUES)[number];

export const LAYOUTS = ['stacked', 'split', 'grid', 'track', 'timeline', 'full-bleed', 'centered', 'masonry', 'layered'] as const;
export type LayoutPattern = (typeof LAYOUTS)[number];

export const STYLES = ['minimal', 'editorial', 'dark', 'glass', 'gradient', 'playful', 'technical'] as const;
export type VisualStyle = (typeof STYLES)[number];

export const USE_CASES = ['saas-landing', 'product-site', 'portfolio', 'dashboard', 'agency', 'documentation', 'pricing'] as const;
export type UseCase = (typeof USE_CASES)[number];

export type ControlGroup = 'layout' | 'style' | 'motion';

interface ControlBase {
  key: string;
  label: string;
  group: ControlGroup;
  hint?: string;
}
export interface RangeControl extends ControlBase {
  type: 'range';
  min: number;
  max: number;
  step: number;
  unit?: string;
}
export interface ColorControl extends ControlBase {
  type: 'color';
}
export interface SelectControl extends ControlBase {
  type: 'select';
  options: { value: string; label: string }[];
}
export interface ToggleControl extends ControlBase {
  type: 'toggle';
}
export type ControlDef = RangeControl | ColorControl | SelectControl | ToggleControl;

export type ConfigValue = number | string | boolean;
export type ConfigRecord = Record<string, ConfigValue>;

export interface SectionNotes {
  /** How the layout adapts to tablet and phone widths. */
  responsive: string;
  /** Keyboard, screen-reader and contrast considerations. */
  accessibility: string;
  /** What happens with prefers-reduced-motion and when JavaScript is unavailable. */
  motion: string;
  /** Technique support and fallbacks. */
  browser: string;
  /** How the animation or interaction works internally. */
  implementation: string;
}

/** What a section's `meta.ts` declares. Category is taken from its parent folder name. */
export interface SectionMetaInput<C extends object = ConfigRecord> {
  id: string;
  name: string;
  description: string;
  tags: string[];
  useCases: UseCase[];
  complexity: Complexity;
  techniques: Technique[];
  layouts: LayoutPattern[];
  styles: VisualStyle[];
  /** True when the primary interaction depends on scrolling. */
  scrollDriven: boolean;
  /** Where the gallery thumbnail parks the scroll (0–1 of the scrollable range). Default 0. */
  posterProgress?: number;
  /** Height of the live preview frame in px at desktop width. Default 720. */
  frameHeight?: number;
  featured?: boolean;
  controls: ControlDef[];
  defaults: C;
  notes: SectionNotes;
  component: () => Promise<{ default: ComponentType<SectionProps<C>> }>;
}

export interface SectionMeta<C extends object = ConfigRecord> extends SectionMetaInput<C> {
  category: CategoryId;
  /** Folder under src/sections/<category>/<id>. */
  folder: string;
}

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  blurb: string;
  hue: number;
}
