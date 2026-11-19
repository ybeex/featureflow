import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'compare-metrics',
  name: 'Metric Bars Comparison',
  description: 'Paired horizontal bars compare your product with a typical alternative on lower-is-better and higher-is-better metrics, animating in once, with optional sorting by advantage.',
  tags: ['comparison', 'metrics', 'bars', 'benchmark', 'animation', 'data'],
  useCases: ['saas-landing', 'product-site', 'pricing'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'css-transition'],
  layouts: ['stacked'],
  styles: ['dark', 'technical'],
  scrollDriven: false,
  frameHeight: 600,
  defaults,
  controls: [
    select('sort', 'Order', 'layout', [['listed', 'As listed'], ['best', 'Biggest advantage first']]),
    toggle('showValues', 'Show values', 'layout'),
    range('barHeight', 'Bar thickness', 'style', 6, 28, 1, 'px'),
    range('radius', 'Bar radius', 'style', 0, 14, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Our bars'),
    color('rival', 'Their bars'),
    toggle('animate', 'Animate on scroll', 'motion'),
    range('duration', 'Duration', 'motion', 200, 2400, 50, 'ms'),
  ],
  notes: {
    responsive: 'Bars are fluid and the value column narrows on small containers. Rows stack vertically at every width, so no horizontal scrolling is needed.',
    accessibility: 'Every bar is paired with a visible number and hidden text naming whose value it is. Each metric is a description list, and “lower/higher is better” is written out so colour and length are not the only cues. Ours vs theirs also differ by label, not hue alone.',
    motion: 'Bars grow once when the block scrolls into view, staggered per row. With reduced motion, or with the toggle off, the bars are drawn at full length immediately.',
    browser: 'transform: scaleX transitions and :has() (used only to adjust the layout when values are hidden) are supported in current browsers; without :has() the value column is simply left empty.',
    implementation: 'Bar length is value ÷ scale maximum as a CSS variable, and the animation scales it from 0 using transform rather than animating width. The advantage sort ranks rows by the ratio between the two values in the direction that is better.',
  },
  component: () => import('./Component'),
});
