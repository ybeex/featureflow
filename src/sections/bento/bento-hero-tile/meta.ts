import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'bento-hero-tile',
  name: 'Hero Tile Bento',
  description: 'A bento grid anchored by one large dark hero tile with a product screenshot, surrounded by compact feature tiles that rise in with a stagger and lift on hover.',
  tags: ['bento', 'hero-tile', 'grid', 'features', 'stagger', 'hover'],
  useCases: ['saas-landing', 'product-site'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'css-transition'],
  layouts: ['grid'],
  styles: ['minimal'],
  scrollDriven: false,
  frameHeight: 640,
  featured: true,
  defaults,
  controls: [
    select('heroSide', 'Hero side', 'layout', [['left', 'Left'], ['right', 'Right']]),
    range('heroSpan', 'Hero width', 'layout', 1, 3, 1, 'cols'),
    range('gap', 'Gap', 'layout', 4, 32, 2, 'px'),
    range('radius', 'Corner radius', 'style', 0, 40, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Hero / text'),
    color('accent', 'Accent'),
    toggle('hoverLift', 'Hover lift', 'motion'),
    toggle('reveal', 'Staggered reveal', 'motion'),
  ],
  notes: {
    responsive: 'Four columns collapse to two, then one, using container queries. The hero tile spans the full width once the grid is narrower than ~760px, and moving it to the right is ignored there.',
    accessibility: 'Tiles are articles with real headings in a logical order. Icons are decorative; the screenshot inside the hero is decorative and hidden from assistive tech. Hover lift is an enhancement only; focus is never required to read anything.',
    motion: 'Tiles reveal once with a staggered delay. With reduced motion, or with the toggle off, they are static and visible. Hover lift only runs on devices that actually hover.',
    browser: 'CSS grid, container queries and :has-free selectors only; supported in all current browsers.',
    implementation: 'Hero position is an order override plus a column span from one variable, so the other four tiles keep DOM order. A single IntersectionObserver on the grid flips a data attribute and CSS applies per-tile delays from --i, so there is one observer rather than one per tile.',
  },
  component: () => import('./Component'),
});
