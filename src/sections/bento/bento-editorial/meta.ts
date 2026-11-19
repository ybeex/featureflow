import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'bento-editorial',
  name: 'Editorial Bento',
  description: 'A magazine-style bento: a cover story, a captioned figure, oversized statistics, an inverted pull quote and a contents list, with serif and rule styles you can switch.',
  tags: ['bento', 'editorial', 'serif', 'magazine', 'typography', 'statistics'],
  useCases: ['agency', 'portfolio', 'documentation'],
  complexity: 'simple',
  techniques: ['css-transition'],
  layouts: ['grid', 'masonry'],
  styles: ['editorial'],
  scrollDriven: false,
  frameHeight: 620,
  defaults,
  controls: [
    select('density', 'Density', 'layout', [['airy', 'Airy'], ['compact', 'Compact']]),
    select('border', 'Tile borders', 'style', [['hairline', 'Hairline'], ['bold', 'Bold'], ['none', 'None']]),
    toggle('serif', 'Serif headlines', 'style'),
    range('numberScale', 'Statistic size', 'style', 0.6, 1.4, 0.05, '×'),
    range('radius', 'Corner radius', 'style', 0, 28, 1, 'px'),
    color('background', 'Background'),
    color('paper', 'Tile paper'),
    color('textColor', 'Ink'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'Six columns collapse to two below ~640px: the cover story, quote and contents run full width and the statistics sit side by side. The figure keeps its aspect ratio at every size.',
    accessibility: 'The cover headline is the section’s h2 and the figure has a real alt text plus a visible caption. The quote uses blockquote with attribution. Dark ink on paper keeps contrast high; the accent is used for large numerals and kickers only.',
    motion: 'There is no motion by design, so reduced-motion preferences need no special handling.',
    browser: 'CSS grid and container queries only. The serif stack uses system fonts (Georgia, Iowan Old Style), so nothing is downloaded.',
    implementation: 'Everything is static markup; the controls toggle data attributes and CSS variables (serif, density, border style, numeral scale), which makes this the cheapest bento here to ship and the easiest to restyle.',
  },
  component: () => import('./Component'),
});
