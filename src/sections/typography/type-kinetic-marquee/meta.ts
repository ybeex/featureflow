import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'type-kinetic-marquee',
  name: 'Scroll-Reactive Marquee',
  description: 'Skewed rows of oversized type that drift in alternating directions at a steady speed and get a push from your scroll velocity, pausing when hovered or off-screen.',
  tags: ['typography', 'marquee', 'kinetic', 'velocity', 'ticker', 'ghost'],
  useCases: ['agency', 'portfolio', 'saas-landing'],
  complexity: 'advanced',
  techniques: ['raf-loop', 'intersection-observer'],
  layouts: ['stacked', 'full-bleed'],
  styles: ['dark', 'playful'],
  scrollDriven: true,
  frameHeight: 560,
  featured: true,
  defaults,
  controls: [
    range('rows', 'Rows', 'layout', 1, 4, 1),
    range('fontSize', 'Maximum font size', 'layout', 40, 140, 2, 'px'),
    toggle('ghost', 'Ghost every other word', 'style'),
    range('skew', 'Skew', 'style', -15, 15, 1, '°'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('speed', 'Base speed', 'motion', 0, 200, 5, 'px/s'),
    range('scrollBoost', 'Scroll push', 'motion', 0, 12, 0.5, '×', 'How strongly scroll velocity speeds the rows up.'),
    toggle('pauseOnHover', 'Pause on hover', 'motion'),
  ],
  notes: {
    responsive: 'Font size is clamped between a floor and the chosen maximum and scales with the container. Track widths are re-measured with a ResizeObserver so the loop point stays seamless after a resize.',
    accessibility: 'Moving text is a WCAG 2.2.2 concern, so the marquee pauses on hover, stops when off-screen and is replaced entirely by static, wrapping text under reduced motion. Only the first row is exposed to assistive tech and the duplicated half of each track is aria-hidden, so words are never announced twice.',
    motion: 'Constant drift plus a velocity term from scroll. With reduced motion or a paused preview the rAF loop is never created and the rows render as static wrapped text.',
    browser: 'requestAnimationFrame, transforms are supported in all current browsers.',
    implementation: 'Each row’s word set is rendered twice; the loop advances a per-row offset and wraps it at the width of one set (half of scrollWidth), so the seam is invisible. Velocity is an exponentially smoothed scroll delta, and the loop checks an IntersectionObserver flag to skip work off-screen.',
  },
  component: () => import('./Component'),
});
