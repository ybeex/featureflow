import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'hscroll-timeline',
  name: 'Draggable Milestone Timeline',
  description: 'A horizontal timeline in a native scroller with mouse drag-to-scroll, arrow-key stepping, alternating milestone cards and a line that fills with the scroll position.',
  tags: ['horizontal', 'timeline', 'drag', 'milestones', 'progress', 'native'],
  useCases: ['saas-landing', 'portfolio', 'agency'],
  complexity: 'moderate',
  techniques: ['pointer-tracking', 'raf-loop'],
  layouts: ['timeline', 'track'],
  styles: ['dark', 'technical'],
  scrollDriven: false,
  frameHeight: 560,
  defaults,
  controls: [
    range('milestones', 'Milestones', 'layout', 3, 8, 1),
    range('spacing', 'Spacing', 'layout', 160, 340, 10, 'px'),
    range('cardWidth', 'Card width', 'layout', 150, 300, 10, 'px'),
    range('lineThickness', 'Line thickness', 'style', 2, 10, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('dragEnabled', 'Drag to scroll (mouse)', 'motion', 'Touch and trackpads always scroll natively; this adds click-and-drag for mouse users.'),
  ],
  notes: {
    responsive: 'The track is as wide as its content and scrolls inside the container, so the same layout serves every width. Touch devices scroll natively; mouse users also get drag and a visible scrollbar.',
    accessibility: 'The scroller is a focusable labelled region that scrolls with the left and right arrow keys. Milestones are an ordered list in time order; reached milestones get a check mark and hidden “(passed)” text rather than colour alone.',
    motion: 'Arrow-key scrolling is instant with reduced motion. The progress line only moves when the user scrolls; nothing animates on its own.',
    browser: 'Pointer events with setPointerCapture and overflow scrolling are supported in all current browsers. Drag is limited to mouse pointers so it never competes with touch panning.',
    implementation: 'A single passive scroll listener (throttled with rAF) reads scrollLeft and writes two CSS variables: the fill width of the rail and the overall progress. Milestone centres are measured on mount and resize only, so scrolling does no layout reads. Drag suppresses the click that would otherwise fire on release.',
  },
  component: () => import('./Component'),
});
