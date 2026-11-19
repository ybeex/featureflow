import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'stack-screenshot-layers',
  name: 'Layered Product Screenshots',
  description: 'Product screenshots slide up over each other on a pinned stage while a caption swaps in sync and background art drifts at its own speed.',
  tags: ['stack', 'screenshots', 'parallax', 'layers', 'product', 'caption'],
  useCases: ['product-site', 'saas-landing'],
  complexity: 'advanced',
  techniques: ['css-sticky', 'motion-scroll'],
  layouts: ['stacked', 'layered', 'split'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.55,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('screenshotCount', 'Screenshots', 'layout', 2, 5, 1),
    range('overlap', 'Peek offset', 'layout', 0, 40, 1, 'px', 'How far each buried screenshot peeks out above the one on top.'),
    range('scrollLength', 'Scroll length', 'layout', 2, 6, 0.25, '× frame'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('parallax', 'Parallax intensity', 'motion', 0, 400, 10, 'px', 'Distance the background art travels while the stage is pinned.'),
    range('tilt', 'Entry tilt', 'motion', 0, 10, 0.5, '°'),
  ],
  notes: {
    responsive: 'Below ~700px the caption sits above the screenshots (single column) and the stage keeps pinning so the stack still resolves in place.',
    accessibility: 'The caption is an aria-live="polite" region that follows the front screenshot; each mock interface has a descriptive text alternative. Background art is decorative and hidden from assistive tech.',
    motion: 'With reduced motion the screenshots become an ordinary vertical list under a static heading, the parallax layers are not rendered, and no pinning occurs.',
    browser: 'Needs position: sticky and container queries (all current browsers). Motion handles the scroll-linked transforms.',
    implementation: 'Motion’s useScroll tracks the track element against the frame’s scroll container. Each screenshot maps its own slice of progress to y / scale / rotate with useTransform, the background art uses different ranges for parallax, and useMotionValueEvent updates the active caption only when the index changes.',
  },
  component: () => import('./Component'),
});
