import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'sticky-text-media',
  name: 'Sticky Text, Scrolling Media',
  description: 'A sticky copy column keeps its heading, a live sub-paragraph and progress dots in view while a tall column of images scrolls past; the copy follows whichever image is centred.',
  tags: ['sticky', 'split', 'gallery', 'dots', 'editorial', 'storytelling'],
  useCases: ['saas-landing', 'product-site', 'portfolio', 'agency'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'intersection-observer', 'css-transition'],
  layouts: ['split', 'stacked'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.3,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('columnRatio', 'Text column width', 'layout', 30, 55, 1, '%', 'Share of the section given to the sticky copy column.'),
    range('stickyOffset', 'Sticky offset', 'layout', 0, 160, 4, 'px', 'Distance from the top of the scroller where the copy pins. Raise it to clear a fixed header.'),
    range('imageCount', 'Images', 'layout', 3, 6, 1),
    range('gap', 'Image gap', 'layout', 16, 120, 4, 'px'),
    range('imageRatio', 'Image ratio', 'layout', 0.7, 1.8, 0.05, undefined, 'Width divided by height of each image.'),
    range('radius', 'Corner radius', 'style', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('dimInactive', 'Dim off-centre images', 'motion', 0, 0.8, 0.05, undefined, 'How much images fade when they are not the one beside the copy.'),
    range('duration', 'Swap duration', 'motion', 0, 900, 25, 'ms', 'Length of the copy swap and image dimming transitions.'),
  ],
  notes: {
    responsive: 'Below ~640px the columns collapse. The heading scrolls away and only a compact bar (counter, one-paragraph summary and dots, about 130px) stays pinned above the images, so the pinned area never takes over the screen.',
    accessibility: 'Images are an ordered list of figures with text alternatives and visible captions, so nothing depends on the synced copy. The dots are real buttons with labels that jump to an image; the current one has aria-current plus a wider shape and a numeric counter, not colour alone.',
    motion: 'With reduced motion the copy swaps instantly and images are never dimmed. Without JavaScript the first summary shows, every image has its caption, and the sticky column still pins because it is CSS only.',
    browser: 'position: sticky, IntersectionObserver, container queries and color-mix() are available in all current browsers. Without container queries the single-column layout is not applied, so the two columns simply stay narrow.',
    implementation: 'The copy column is position: sticky inside a grid row as tall as the image list. useActiveIndex observes a thin band across the middle of the scroller and reports which figure crosses it; that index selects the sub-text (re-keyed so a CSS animation replays), the counter and the active dot. Dots call scrollIntoView on the matching figure.',
  },
  component: () => import('./Component'),
});
