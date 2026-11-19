import { defineSection } from '../../../registry/define';
import { color, easingControl, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-fade-stagger',
  name: 'Staggered Fade-Up Cards',
  description: 'A heading and a grid of cards that fade in sequence, with an explicit trigger: once or replay, at a visibility threshold you choose.',
  tags: ['reveal', 'fade', 'stagger', 'entrance', 'cards', 'threshold'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'css-transition'],
  layouts: ['grid'],
  styles: ['minimal'],
  scrollDriven: true,
  posterProgress: 0,
  frameHeight: 640,
  featured: true,
  defaults,
  controls: [
    range('columns', 'Columns', 'layout', 1, 4, 1),
    range('radius', 'Corner radius', 'layout', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    select('direction', 'Direction', 'motion', ['up', 'down', 'left', 'right']),
    range('distance', 'Reveal distance', 'motion', 0, 120, 2, 'px'),
    range('duration', 'Duration', 'motion', 150, 1600, 50, 'ms'),
    range('stagger', 'Stagger delay', 'motion', 0, 300, 10, 'ms'),
    easingControl(),
    range('threshold', 'Trigger threshold', 'motion', 0.05, 1, 0.05, undefined, 'Fraction of the element that must be visible before it reveals.'),
    select('replay', 'Replay behaviour', 'motion', [['once', 'Reveal once'], ['replay', 'Replay on re-entry']]),
    { type: 'toggle', key: 'sequence', label: 'Cards wait for heading', group: 'motion', hint: 'Start the card sequence after the heading transition is underway.' },
  ],
  notes: {
    responsive: 'The grid drops to two columns below ~760px of container width and one column below ~480px. Reveal distance is unchanged, so nothing travels far on small screens.',
    accessibility: 'Content stays in DOM order and is never removed from the accessibility tree: only opacity and transform change. Headings keep a real h2/h3 hierarchy.',
    motion: 'The hidden start state is applied only after JavaScript runs and only when motion is allowed. With reduced motion, or no JavaScript, everything is simply visible.',
    browser: 'IntersectionObserver and CSS transitions are supported everywhere; without IntersectionObserver the hook reports the element as visible.',
    implementation: 'useInView observes the heading and the grid. A data-visible attribute flips on entry (and off again in replay mode); CSS transitions do the motion with a per-card transition-delay of index × stagger.',
  },
  component: () => import('./Component'),
});
