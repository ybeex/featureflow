import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'timeline-roadmap',
  name: 'Quarterly Roadmap Lanes',
  description: 'An interactive roadmap: items span quarters in swim-lanes, a segmented filter narrows by status, and selecting an item shows its details in a live region.',
  tags: ['timeline', 'roadmap', 'swimlanes', 'filter', 'gantt', 'status'],
  useCases: ['saas-landing', 'documentation', 'product-site'],
  complexity: 'moderate',
  techniques: ['state-machine', 'css-transition'],
  layouts: ['timeline', 'grid'],
  styles: ['minimal', 'technical'],
  scrollDriven: false,
  frameHeight: 620,
  defaults,
  controls: [
    select('filter', 'Initial filter', 'layout', [['all', 'All'], ['shipped', 'Shipped'], ['building', 'In progress'], ['planned', 'Planned']], 'The starting filter. Visitors can change it with the segmented control.'),
    range('quarters', 'Quarters shown', 'layout', 2, 4, 1),
    range('rowHeight', 'Row height', 'layout', 32, 64, 2, 'px'),
    toggle('showDetail', 'Detail panel', 'layout'),
    range('radius', 'Corner radius', 'style', 0, 20, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'Lane labels narrow and bar text shrinks on small containers, and long names truncate with an ellipsis while the full name stays available to assistive tech and in the detail panel.',
    accessibility: 'The filter is a button group with aria-pressed; each bar is a button whose accessible text includes its status and quarters, and selected state is aria-pressed. Status is shown by dot, fill and border style (solid / tinted / dashed), not colour alone. The detail panel is aria-live="polite".',
    motion: 'Only a 1px hover lift; it is removed under reduced motion. Nothing animates automatically.',
    browser: 'CSS grid placement by column span; supported everywhere current.',
    implementation: 'Each item stores its start and end quarter and is placed with grid-column: from / to inside a per-lane grid, so no pixel maths is involved. The visible-quarters control clips items that start beyond the range and truncates those that run past it.',
  },
  component: () => import('./Component'),
});
