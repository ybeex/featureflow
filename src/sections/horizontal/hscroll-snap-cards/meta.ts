import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'hscroll-snap-cards',
  name: 'Snap-Scroll Card Carousel',
  description: 'A native horizontal scroller with mandatory CSS snap points, prev/next buttons that disable at the ends, synced dots, arrow-key navigation and edge fades.',
  tags: ['horizontal', 'carousel', 'scroll-snap', 'cards', 'native', 'touch'],
  useCases: ['saas-landing', 'product-site', 'portfolio'],
  complexity: 'simple',
  techniques: ['scroll-snap', 'intersection-observer'],
  layouts: ['track'],
  styles: ['minimal'],
  scrollDriven: false,
  frameHeight: 560,
  featured: true,
  defaults,
  controls: [
    range('cardWidth', 'Card width', 'layout', 220, 420, 10, 'px'),
    range('gap', 'Gap', 'layout', 8, 48, 2, 'px'),
    select('snapAlign', 'Snap alignment', 'layout', [['start', 'Start'], ['center', 'Centre']]),
    range('inset', 'Edge inset', 'layout', 0, 96, 4, 'px', 'Space before the first card. Also where cards snap to when aligned to the start, so the next card peeks in.'),
    range('radius', 'Corner radius', 'layout', 0, 32, 1, 'px'),
    toggle('showDots', 'Show dots', 'style'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
  ],
  notes: {
    responsive: 'Cards cap at 82% of the container width so a neighbour always peeks in on phones. Prev/next buttons are hidden on touch-only devices, where swiping is the natural gesture, and the dots remain.',
    accessibility: 'Follows the WAI-ARIA carousel pattern: aria-roledescription="carousel" and "slide", each slide labelled “n of N”, a focusable scroller with Arrow/Home/End keys, and buttons with text labels that become disabled (not hidden) at the ends.',
    motion: 'Scrolling is native; programmatic scrolls are instant when reduced motion is on and the dot/fade transitions are removed. Nothing auto-plays.',
    browser: 'scroll-snap and scrollBy({ behavior }) are supported in all current browsers. Without JavaScript the scroller still scrolls and snaps natively.',
    implementation: 'The track is overflow-x: auto with scroll-snap-type: x mandatory. One IntersectionObserver rooted at the scroller tracks which cards are at least 60% visible, driving the dots and the disabled state of the buttons; no scroll listener is attached.',
  },
  component: () => import('./Component'),
});
