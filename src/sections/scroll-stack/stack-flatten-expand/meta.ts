import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'stack-flatten-expand',
  name: 'Flatten & Expand Panels',
  description: 'Narrow, rounded, tilted cards widen to full-bleed panels as they reach the top, then the next card covers them.',
  tags: ['stack', 'full-bleed', 'clip-path', 'tilt', 'panels', 'editorial'],
  useCases: ['saas-landing', 'portfolio', 'agency', 'product-site'],
  complexity: 'advanced',
  techniques: ['css-sticky', 'scroll-var', 'clip-path'],
  layouts: ['stacked', 'full-bleed'],
  styles: ['editorial', 'playful'],
  scrollDriven: true,
  posterProgress: 0.3,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('cardCount', 'Panels', 'layout', 2, 6, 1),
    range('startWidth', 'Start width', 'layout', 40, 95, 1, '%'),
    range('stickyOffset', 'Sticky offset', 'layout', 0, 100, 2, 'px'),
    range('startRadius', 'Start radius', 'style', 0, 60, 1, 'px'),
    range('finalRadius', 'Final radius', 'style', 0, 40, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('tilt', 'Rotation strength', 'motion', 0, 8, 0.25, '°', 'Tilt of an incoming panel; it levels out as the panel flattens.'),
  ],
  notes: {
    responsive: 'Panels keep their start inset on wide containers. Below ~640px they stack into single-column panels with a shorter image, and the inset remains small enough that text is never clipped.',
    accessibility: 'Panels are list items in reading order. The clip only crops padding, never text: content is padded to stay inside the narrowest clip. Illustrations carry text alternatives.',
    motion: 'With reduced motion each panel renders as a normal rounded block with no clipping, tilt or pinning. Without JavaScript the panels stay sticky and fully visible (progress defaults to the flattened state).',
    browser: 'clip-path: inset() with round and calc() is supported in all current browsers. Animating clip-path is paint-only; it does not trigger layout.',
    implementation: 'Each panel measures its own “pass” progress with useScrollVar and derives --e (0 to 1) with clamp(). clip-path insets, radius and rotation are all functions of --e, so the panel widens, rounds off and levels as it nears the pinned position.',
  },
  component: () => import('./Component'),
});
