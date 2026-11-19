import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'timeline-sticky-process',
  name: 'Pinned Process Stepper',
  description: 'A horizontal stepper pinned in view while scrolling advances through the process: nodes complete, the connecting line fills and the detail card changes for each step.',
  tags: ['timeline', 'process', 'stepper', 'pinned', 'sticky', 'progress'],
  useCases: ['saas-landing', 'agency', 'product-site'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var', 'state-machine'],
  layouts: ['timeline', 'centered'],
  styles: ['dark', 'technical'],
  scrollDriven: true,
  posterProgress: 0.45,
  frameHeight: 640,
  defaults,
  controls: [
    range('steps', 'Steps', 'layout', 2, 5, 1),
    toggle('showNumbers', 'Show step numbers', 'layout'),
    range('scrollPerStep', 'Scroll per step', 'layout', 0.4, 1.8, 0.1, '× frame'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    select('transition', 'Card transition', 'motion', [['slide', 'Slide and fade'], ['fade', 'Fade only']]),
  ],
  notes: {
    responsive: 'Step labels collapse to just their numbers below ~520px so the five nodes always fit on one line; the full title appears in the detail card below.',
    accessibility: 'Steps are an ordered list with aria-current="step" on the active one, and only the active panel is exposed to assistive tech while pinned. With reduced motion every panel is shown in order, so no content depends on scrolling a pinned stage.',
    motion: 'Node states, the line fill and card transitions follow scroll position. With reduced motion the stage is unpinned and all steps appear as a normal vertical list with no transitions.',
    browser: 'position: sticky and container queries are supported in all current browsers.',
    implementation: 'useScrollVar writes pinned progress to --ff-p, which scales the connector line directly in CSS. The same progress is quantised to a step index in onProgress, so React re-renders only when the step changes. Panels are stacked in the same cell and toggled with opacity/visibility so layout never jumps between steps of different length.',
  },
  component: () => import('./Component'),
});
