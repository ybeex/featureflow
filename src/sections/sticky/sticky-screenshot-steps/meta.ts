import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'sticky-screenshot-steps',
  name: 'Pinned Screenshot with Steps',
  description: 'A product screenshot stays pinned while step descriptions scroll past; each step swaps the interface and moves an animated callout to the relevant region.',
  tags: ['sticky', 'screenshot', 'callout', 'steps', 'product', 'tour'],
  useCases: ['product-site', 'saas-landing', 'documentation'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'intersection-observer', 'css-transition'],
  layouts: ['split', 'timeline'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.4,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    select('side', 'Screenshot side', 'layout', [['left', 'Left'], ['right', 'Right']]),
    range('stickyOffset', 'Sticky offset', 'layout', 0, 120, 2, 'px'),
    range('steps', 'Steps', 'layout', 2, 4, 1),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    select('calloutStyle', 'Callout style', 'style', [['ring', 'Ring'], ['glow', 'Glow'], ['label', 'Underlined region']]),
    range('calloutScale', 'Callout size', 'style', 0.8, 1.3, 0.05, '×'),
    range('duration', 'Transition duration', 'motion', 0, 1200, 50, 'ms'),
  ],
  notes: {
    responsive: 'Below ~720px the screenshot pins as a compact strip (62% width) above the scrolling steps rather than beside them, and the callout label is hidden so it cannot cover the interface.',
    accessibility: 'Steps are an ordered list with aria-current="step" and “Step n of N” text. Hidden screenshot layers are aria-hidden; the visible one has a text alternative. The callout is decorative because each step’s text already names what it points at.',
    motion: 'Reduced motion removes the layer cross-fade, callout travel and glow pulse (changes become instant). Pinning is CSS and works without JavaScript; the first screenshot and callout show by default.',
    browser: 'position: sticky and container queries are supported in all current browsers.',
    implementation: 'useActiveIndex observes each step in a thin band at the centre of the scroller. The active index selects which screenshot layer is opaque and sets the callout’s left/top/width/height (percent of the screenshot), which CSS transitions between regions.',
  },
  component: () => import('./Component'),
});
