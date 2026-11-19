import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'timeline-vertical-progress',
  name: 'Vertical Progress Timeline',
  description: 'A vertical timeline whose centre line fills as you scroll. Events light up and show a check mark when the line reaches them, in alternating or single-sided layouts.',
  tags: ['timeline', 'vertical', 'progress', 'scroll', 'alternating', 'steps'],
  useCases: ['saas-landing', 'documentation', 'portfolio'],
  complexity: 'moderate',
  techniques: ['scroll-var', 'css-transition'],
  layouts: ['timeline', 'stacked'],
  styles: ['minimal', 'editorial'],
  scrollDriven: true,
  posterProgress: 0.55,
  frameHeight: 680,
  featured: true,
  defaults,
  controls: [
    select('layout', 'Layout', 'layout', [['alternate', 'Alternating sides'], ['left', 'Line on the left']]),
    select('marker', 'Marker', 'style', [['number', 'Numbered'], ['dot', 'Plain dot']]),
    range('lineWidth', 'Line thickness', 'style', 1, 8, 1, 'px'),
    range('radius', 'Card radius', 'style', 0, 28, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('dim', 'Unreached opacity', 'motion', 0.1, 1, 0.05, '', 'How faded events are before the line reaches them. 1 turns the dimming off.'),
  ],
  notes: {
    responsive: 'Below ~560px both layouts become a single column with the line on the left, so cards never get narrower than the text needs.',
    accessibility: 'An ordered list in chronological order, so assistive tech announces position. Reached events get a check mark and hidden “(reached)” text rather than just a colour change. Dimmed events are still readable (default 35% opacity on large text; raise it for stricter contrast needs).',
    motion: 'The line fill is driven directly by scroll position. With reduced motion every event is shown as reached and the line is full; no transitions run.',
    browser: 'Transforms, CSS variables and container queries are supported everywhere current.',
    implementation: 'useScrollVar writes pass-progress to --ff-p on the list; the rail’s fill is scaleY(--ff-p), a pure transform. The onProgress callback derives how many events the line has passed and React only re-renders when that integer changes, not every frame.',
  },
  component: () => import('./Component'),
});
