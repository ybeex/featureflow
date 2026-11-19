import type { CategoryInfo } from './types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'scroll-stack', label: 'Scroll Stack', hue: 18, blurb: 'Cards that pin, scale and recede as you scroll, driven by real scroll position.' },
  { id: 'scroll-reveal', label: 'Scroll Reveal', hue: 42, blurb: 'Entrance patterns with explicit triggers: once, replay, threshold or scroll-linked.' },
  { id: 'sticky', label: 'Sticky Sections', hue: 150, blurb: 'A pinned stage whose content changes as the narrative scrolls past it.' },
  { id: 'horizontal', label: 'Horizontal Scroll', hue: 200, blurb: 'Vertical scrolling turned sideways, or native horizontal tracks with snap and keyboard support.' },
  { id: 'split', label: 'Split Layouts', hue: 262, blurb: 'Asymmetric, diagonal and independently moving two-part compositions.' },
  { id: 'bento', label: 'Bento Grids', hue: 320, blurb: 'Tile layouts with a clear hierarchy, live data and considered responsive reflow.' },
  { id: 'feature-cards', label: 'Feature Cards', hue: 345, blurb: 'Complete card sections with spotlight, tilt, animated borders and progressive disclosure.' },
  { id: 'image-storytelling', label: 'Image Storytelling', hue: 28, blurb: 'Media-led sections: reveals, parallax, comparison sliders and product frames.' },
  { id: 'typography', label: 'Typography', hue: 80, blurb: 'Type as the main visual: emphasis shifts, kinetic marquees, variable-weight animation.' },
  { id: 'interactive', label: 'Interactive Sections', hue: 175, blurb: 'User-driven tabs, accordions and diagrams with keyboard-first behaviour.' },
  { id: 'timeline', label: 'Timelines & Process', hue: 230, blurb: 'Progress lines, numbered steps and roadmaps that follow the real scroll position.' },
  { id: 'comparison', label: 'Comparison & Data', hue: 110, blurb: 'Matrices, metrics and plans with text alternatives that never rely on colour alone.' },
  { id: 'experimental', label: 'Experimental', hue: 290, blurb: 'Aurora, canvas particles, perspective scenes and morphing shapes, each with a light fallback.' },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<string, CategoryInfo>;
