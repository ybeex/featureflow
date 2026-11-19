import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'type-variable-weight',
  name: 'Variable Font Weight Play',
  description: 'A headline whose letters change weight continuously on a variable font axis, driven by pointer proximity, scroll progress or a travelling wave.',
  tags: ['typography', 'variable-font', 'weight', 'pointer', 'wave', 'interactive'],
  useCases: ['agency', 'portfolio', 'product-site'],
  complexity: 'advanced',
  techniques: ['pointer-tracking', 'raf-loop', 'scroll-var'],
  layouts: ['centered'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.7,
  frameHeight: 520,
  defaults,
  controls: [
    select('mode', 'Driven by', 'layout', [['pointer', 'Pointer proximity'], ['scroll', 'Scroll position'], ['wave', 'Travelling wave']]),
    range('fontSize', 'Maximum font size', 'layout', 60, 220, 4, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Hint colour'),
    range('minWeight', 'Lightest weight', 'motion', 100, 500, 25),
    range('maxWeight', 'Heaviest weight', 'motion', 500, 900, 25),
    range('radius', 'Pointer reach', 'motion', 40, 500, 10, 'px', 'Only used in pointer mode: how far from a letter the pointer still thickens it.'),
  ],
  notes: {
    responsive: 'Font size is clamped between a floor and the chosen maximum. Pointer mode is for devices with a pointer; on touch it holds the lightest weight, so choose scroll or wave mode for touch-first audiences.',
    accessibility: 'The heading exposes its full word through aria-label while the individual letters are hidden, so it is read once and whole. Weight changes never change glyph widths enough to reflow text in a way that would shift content. With reduced motion it is shown statically at its heaviest weight.',
    motion: 'Pointer mode updates only while the pointer moves, scroll mode only while scrolling, and wave mode runs a rAF loop that is stopped under reduced motion or when the preview is paused.',
    browser: 'font-variation-settings requires a variable font with a wght axis; this demo uses Inter Variable (@fontsource-variable/inter). With a static font, browsers snap to the nearest available weight, so the effect becomes stepped instead of smooth.',
    implementation: 'Every letter is its own span, and a single handler sets font-variation-settings directly on each (no React state). Pointer weight is lo + (hi − lo) × (1 − d/r)², where d is the letter’s distance to the pointer, which gives a soft falloff. Wave mode uses a sine offset per letter index.',
  },
  component: () => import('./Component'),
});
