import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'compare-matrix',
  name: 'Feature Comparison Matrix',
  description: 'A semantic plan-by-feature table with grouped rows, a sticky header, a recommended column, column hover highlighting and a “show only differences” filter.',
  tags: ['comparison', 'table', 'matrix', 'pricing', 'sticky-header', 'filter'],
  useCases: ['pricing', 'saas-landing', 'product-site'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'state-machine'],
  layouts: ['grid', 'stacked'],
  styles: ['minimal', 'technical'],
  scrollDriven: false,
  frameHeight: 700,
  featured: true,
  defaults,
  controls: [
    select('highlight', 'Recommended plan', 'layout', [['free', 'Free'], ['pro', 'Pro'], ['team', 'Team']]),
    toggle('differencesOnly', 'Show only differences', 'layout', 'Hides rows where every plan has the same value.'),
    select('density', 'Row density', 'layout', [['comfortable', 'Comfortable'], ['compact', 'Compact']]),
    toggle('stickyHeader', 'Sticky header', 'style'),
    range('radius', 'Corner radius', 'style', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('rowHover', 'Row hover', 'motion'),
  ],
  notes: {
    responsive: 'The table has a minimum width and scrolls sideways inside its own focusable region on narrow screens, with the header row staying visible vertically. Nothing is hidden or reflowed, so the comparison stays intact.',
    accessibility: 'A real table with caption, column headers (scope=col), row headers and group headers (scope=colgroup). Ticks and dashes carry hidden “Included” / “Not included” text. The scroll region is keyboard-focusable and labelled.',
    motion: 'Highlight changes are instant colour changes, so there is no motion to reduce.',
    browser: 'position: sticky on table headers is supported in all current browsers.',
    implementation: 'Data lives in one array. The differences filter compares the set of stringified values per row, and empty groups are removed so no orphaned group header remains. Column hover is tracked in state and applied by data attribute because CSS alone cannot style a whole table column.',
  },
  component: () => import('./Component'),
});
