import { defineSection } from '../../../registry/define';
import { color, easingControl, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-counters',
  name: 'Count-Up Statistics',
  description: 'A statistics band whose numbers count up with an eased rAF animation when the grid enters view, with the final value always readable by assistive tech.',
  tags: ['reveal', 'counter', 'stats', 'numbers', 'metrics', 'dark'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'raf-loop'],
  layouts: ['grid'],
  styles: ['dark', 'technical'],
  scrollDriven: true,
  posterProgress: 0.3,
  frameHeight: 560,
  defaults,
  controls: [
    range('columns', 'Columns', 'layout', 1, 4, 1),
    range('radius', 'Corner radius', 'layout', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('duration', 'Duration', 'motion', 400, 4000, 100, 'ms'),
    easingControl(),
    range('stagger', 'Stagger delay', 'motion', 0, 400, 20, 'ms'),
    select('startFrom', 'Count from', 'motion', [['zero', 'Zero'], ['half', 'Half the final value']]),
    select('replay', 'Replay behaviour', 'motion', [['once', 'Count once'], ['replay', 'Replay on re-entry']]),
  ],
  notes: {
    responsive: 'The grid shows the configured column count on wide containers, two columns below ~760px and one below ~380px.',
    accessibility: 'The animated digits are aria-hidden; a visually-hidden copy states the final figure once, so screen readers never hear intermediate counts. Numbers use tabular figures so the layout does not jitter while counting.',
    motion: 'With reduced motion (or no JavaScript) the final values are rendered immediately and no animation loop is created.',
    browser: 'requestAnimationFrame, IntersectionObserver and Intl.NumberFormat are supported everywhere. Formatting uses the en-US locale; change it in Component.tsx.',
    implementation: 'useInView toggles a boolean for the whole grid. Each Counter runs one rAF loop (started after index × stagger ms) that eases from the start value to the target and is cancelled on cleanup or when the grid leaves view in replay mode.',
  },
  component: () => import('./Component'),
});
