import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'type-split-lines',
  name: 'Masked Line Reveal',
  description: 'A headline split into lines, each rising out of its own clipping mask in sequence when the block scrolls into view, with an optional replay each time it re-enters.',
  tags: ['typography', 'line-reveal', 'mask', 'headline', 'stagger', 'editorial'],
  useCases: ['saas-landing', 'agency', 'portfolio'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'css-transition'],
  layouts: ['stacked'],
  styles: ['editorial', 'minimal'],
  scrollDriven: false,
  frameHeight: 520,
  defaults,
  controls: [
    select('direction', 'Direction', 'layout', [['up', 'Rise from below'], ['down', 'Drop from above']]),
    range('fontSize', 'Maximum font size', 'layout', 40, 160, 2, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('stagger', 'Delay between lines', 'motion', 0, 400, 10, 'ms'),
    range('duration', 'Line duration', 'motion', 200, 2000, 50, 'ms'),
    range('distance', 'Travel distance', 'motion', 20, 160, 5, '%'),
    toggle('replay', 'Replay on every entry', 'motion'),
  ],
  notes: {
    responsive: 'Lines are authored breaks sized with clamp(); if a line is too long for a narrow container it wraps inside its own mask and still reveals correctly, because the mask is a block that grows with its content.',
    accessibility: 'The visible lines are aria-hidden spans, and the h2 carries one aria-label with the whole sentence, so the heading is read once, intact. Masks have vertical padding so descenders are not clipped.',
    motion: 'The reveal is a single transform transition per line, staggered by index. With reduced motion the headline is simply visible; the hidden start state exists only after mount and only when motion is allowed.',
    browser: 'overflow: hidden masks and CSS transitions work everywhere; no clip-path or JS splitting libraries are needed.',
    implementation: 'One observer watches the block; its visibility flips a data attribute and CSS applies per-line delays from --i, so there are no per-line observers or timers. Splitting is done by authoring the lines, which avoids measuring text and re-splitting on resize.',
  },
  component: () => import('./Component'),
});
