import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'split-independent-scroll',
  name: 'Independent Column Scroll',
  description: 'A pinned two-column stage where the text lane and the image lane travel independently from one scroll position, in opposite or the same direction.',
  tags: ['split', 'pinned', 'columns', 'opposite-scroll', 'sticky', 'storytelling'],
  useCases: ['saas-landing', 'agency', 'portfolio'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var'],
  layouts: ['split', 'stacked'],
  styles: ['dark', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 640,
  defaults,
  controls: [
    select('direction', 'Column direction', 'layout', [['opposite', 'Opposite'], ['same', 'Same']]),
    range('cards', 'Items', 'layout', 3, 6, 1),
    range('gap', 'Gap', 'layout', 8, 40, 2, 'px'),
    range('speed', 'Scroll length', 'motion', 0.5, 2.5, 0.1, '×', 'Scales how much page scrolling the pinned stage uses; higher is slower.'),
    range('radius', 'Image radius', 'style', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'Under ~640px the stage unpins and becomes a plain single-column list; the decorative image lane is dropped so nothing scrolls sideways or competes with the text.',
    accessibility: 'All the content is in the text lane, in order, as an ordered list with headings. The image lane is purely decorative and hidden from assistive technology, so nothing is lost without it.',
    motion: 'Both lanes are driven directly by scroll position, so they stop when the reader stops. With reduced motion the section is static and unpinned.',
    browser: 'position: sticky, translate3d and container queries are supported in all current browsers.',
    implementation: 'A tall track makes the sticky stage hold still while useScrollVar writes progress to --ff-p. Each lane translates by progress × (its own height − the viewport), expressed in percentages of itself, so lanes of different heights both finish exactly at the end. Opposite mode uses (1 − progress).',
  },
  component: () => import('./Component'),
});
