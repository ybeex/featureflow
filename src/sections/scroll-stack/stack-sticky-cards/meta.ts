import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'stack-sticky-cards',
  name: 'Sticky Card Stack',
  description: 'Feature cards pin one beneath another and progressively scale back as each new card lands on top.',
  tags: ['stack', 'cards', 'pinned', 'scale', 'numbered', 'hero'],
  useCases: ['saas-landing', 'product-site'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'motion-scroll'],
  layouts: ['stacked', 'split'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.42,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('cardCount', 'Cards', 'layout', 2, 6, 1),
    range('stickyTop', 'Sticky offset', 'layout', 0, 120, 2, 'px', 'Distance from the top of the scroller where the first card pins. Raise it to clear a fixed header.'),
    range('stackOffset', 'Stack spacing', 'layout', 6, 44, 1, 'px', 'How far each pinned card peeks out above the next.'),
    range('gap', 'Scroll distance', 'layout', 16, 200, 4, 'px', 'Space between cards in the natural flow, which sets how long each transition takes.'),
    range('radius', 'Corner radius', 'layout', 0, 40, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('shadow', 'Shadow intensity', 'style', 0, 1, 0.05),
    range('scaleStep', 'Stack scale', 'motion', 0, 0.1, 0.005, undefined, 'How much smaller each card gets per card stacked on top of it.'),
  ],
  notes: {
    responsive: 'Below ~640px the cards become single-column, shorter, and peek by at most 12px so the pinned stack never consumes the screen.',
    accessibility: 'Rendered as an ordered list of articles in DOM order, so reading and tab order match the visual order. The illustrations have text alternatives; the numerals are decorative.',
    motion: 'With prefers-reduced-motion the cards render as a plain vertical list: no pinning, no scaling. Without JavaScript the sticky layout still works because pinning is pure CSS.',
    browser: 'position: sticky and color-mix() are supported in all current browsers. Older browsers without color-mix show the cards on the base background.',
    implementation: 'Each slot is position: sticky with top = base + index × offset. Motion’s useScroll tracks the list from “start start” to “end end”, and each card maps that progress to its own scale with useTransform. Only transforms animate.',
  },
  component: () => import('./Component'),
});
