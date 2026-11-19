import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'split-asymmetric-ratio',
  name: 'Asymmetric Split Rows',
  description: 'Alternating media and copy rows on an uneven grid (a 62/38 split by default) with a configurable ratio, flipped rows, vertical alignment and a per-row reveal.',
  tags: ['split', 'two-column', 'alternating', 'editorial', 'reveal', 'ratio'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'css-transition'],
  layouts: ['split'],
  styles: ['editorial', 'minimal'],
  scrollDriven: false,
  frameHeight: 760,
  featured: true,
  defaults,
  controls: [
    range('ratio', 'Media column share', 'layout', 35, 75, 1, '%'),
    toggle('alternate', 'Alternate sides', 'layout'),
    select('align', 'Vertical alignment', 'layout', [['start', 'Top'], ['center', 'Centre'], ['end', 'Bottom']]),
    range('gap', 'Column gap', 'layout', 16, 96, 4, 'px'),
    range('rows', 'Rows', 'layout', 1, 6, 1),
    range('radius', 'Media radius', 'style', 0, 40, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('reveal', 'Reveal on scroll', 'motion'),
  ],
  notes: {
    responsive: 'Below ~640px the two columns collapse to one, with media always first so the reading order matches the visual order. The ratio only applies when there is room for two columns.',
    accessibility: 'Each row is an article with a real heading, and the media is an image with a text alternative. Flipping sides uses CSS order on the media only, so DOM order (media, then copy) stays logical for screen readers.',
    motion: 'Rows fade and slide in once via IntersectionObserver. With reduced motion, or with the toggle off, rows are static and fully visible. The hidden start state is applied only after mount.',
    browser: 'CSS grid with calc()-based fr tracks and container queries are supported in all current browsers.',
    implementation: 'Track widths are minmax(0, ratio × 1fr) and minmax(0, (100 − ratio) × 1fr), so the ratio is a single number the CSS multiplies. Flipped rows swap the track order instead of reordering content. Each row owns its own observer and latches visible after first reveal.',
  },
  component: () => import('./Component'),
});
