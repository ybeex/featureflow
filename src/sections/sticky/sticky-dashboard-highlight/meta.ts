import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'sticky-dashboard-highlight',
  name: 'Pinned Dashboard Highlights',
  description: 'A dashboard built from live HTML tiles stays pinned while narrative blocks scroll; the tile being described is outlined and labelled and the rest recede.',
  tags: ['sticky', 'dashboard', 'highlight', 'callout', 'tiles', 'product'],
  useCases: ['dashboard', 'product-site', 'saas-landing'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'intersection-observer', 'css-transition'],
  layouts: ['split', 'grid'],
  styles: ['technical', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 720,
  defaults,
  controls: [
    range('stickyOffset', 'Sticky offset', 'layout', 0, 100, 2, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    select('highlightStyle', 'Highlight style', 'style', [['outline', 'Outline'], ['glow', 'Glow'], ['lift', 'Lift']]),
    range('dim', 'Dim amount', 'style', 0, 0.85, 0.05, undefined, 'How much the non-highlighted tiles fade. The highlighted tile also gets an outline and a text label, so dimming is never the only cue.'),
    toggle('showCallouts', 'Callout labels', 'style'),
    range('duration', 'Transition duration', 'motion', 0, 1200, 50, 'ms'),
  ],
  notes: {
    responsive: 'On narrow containers the dashboard pins as a compact strip (smaller type, shorter chart, shorter feed) above the steps, so it never occupies more than a fraction of the screen.',
    accessibility: 'The mock dashboard is a labelled group of real text, not an image. The highlighted tile is identified by an outline and a text tag as well as by contrast with its dimmed neighbours; the active narrative step carries aria-current="step".',
    motion: 'Reduced motion makes tile changes instant (no fade, lift or label transition). Without JavaScript the first narrative item is the default and every tile stays fully readable.',
    browser: 'position: sticky, outline-offset and container queries work in all current browsers.',
    implementation: 'useActiveIndex returns which narrative block is crossing the middle of the scroller; its area name becomes data-focus on the matching tile. CSS handles dimming, the outline/glow/lift variants and the label from that single attribute.',
  },
  component: () => import('./Component'),
});
