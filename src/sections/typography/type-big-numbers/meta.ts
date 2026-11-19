import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'type-big-numbers',
  name: 'Oversized Gradient Numerals',
  description: 'Giant ghosted statistics that fill with a gradient as each row scrolls through the viewport, driven by the row’s own scroll progress.',
  tags: ['typography', 'numbers', 'statistics', 'gradient-text', 'scroll'],
  useCases: ['saas-landing', 'agency', 'product-site'],
  complexity: 'moderate',
  techniques: ['scroll-var'],
  layouts: ['stacked'],
  styles: ['dark', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 640,
  defaults,
  controls: [
    select('align', 'Alignment', 'layout', [['left', 'Left, with caption beside'], ['center', 'Centred']]),
    range('fontSize', 'Maximum numeral size', 'layout', 80, 300, 4, 'px'),
    range('rowGap', 'Row spacing', 'layout', 12, 100, 2, 'px'),
    select('fill', 'Fill', 'style', [['sweep', 'Gradient sweep'], ['solid', 'Fade to solid']]),
    range('idleOpacity', 'Unfilled numeral opacity', 'style', 0.05, 0.5, 0.01, '', 'How visible the not-yet-filled part of each numeral is.'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Gradient start'),
    color('accent2', 'Gradient end'),
  ],
  notes: {
    responsive: 'Numeral size is clamped between a floor and the chosen maximum and scales with the container; below ~520px the caption stacks under the numeral.',
    accessibility: 'The visual numeral is aria-hidden and a visually hidden text copy carries the same value, so the number is read once as plain text and the ghosted glyph styling cannot impair it. In reduced-motion mode the numeral rests fully filled with the gradient, a solid high-contrast fill.',
    motion: 'The fill follows each row’s scroll progress directly. Reduced motion renders the finished, filled state with no scroll listeners.',
    browser: 'background-clip: text is supported in all current browsers (the -webkit- prefix is required in Safari and older Chromium). Ghosting uses a translucent fill rather than a text stroke because strokes expose the overlapping contours inside variable fonts.',
    implementation: 'Each row owns a useScrollVar, so --ff-p is local to the row and CSS can slide a clipped gradient with background-position: calc(100% − p × 100%). No React re-render happens during scroll.',
  },
  component: () => import('./Component'),
});
