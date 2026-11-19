import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'cards-tilt-3d',
  name: '3D Tilt Cards',
  description: 'Cards that rotate toward the pointer in perspective, with layers lifted along Z for depth and a light glare that tracks the cursor.',
  tags: ['cards', '3d', 'tilt', 'perspective', 'glare', 'pointer'],
  useCases: ['portfolio', 'agency', 'product-site'],
  complexity: 'moderate',
  techniques: ['pointer-tracking', 'css-transition'],
  layouts: ['grid'],
  styles: ['dark', 'playful'],
  scrollDriven: false,
  frameHeight: 520,
  defaults,
  controls: [
    range('columns', 'Columns', 'layout', 1, 3, 1),
    range('radius', 'Corner radius', 'style', 0, 36, 1, 'px'),
    toggle('glare', 'Glare', 'style'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Focus ring'),
    range('maxTilt', 'Max tilt', 'motion', 0, 30, 1, '°'),
    range('perspective', 'Perspective', 'motion', 300, 2000, 50, 'px', 'Lower values exaggerate the 3D effect.'),
    range('lift', 'Layer lift', 'motion', 0, 40, 1, 'px'),
    toggle('depth', 'Layered depth', 'motion'),
  ],
  notes: {
    responsive: 'Three columns stack into one centred column below ~640px. Tilt is pointer-driven only: on touch devices the cards are flat and fully usable.',
    accessibility: 'Text sits on a solid dark card and keeps full contrast at any tilt (max 30°, default 12°). Cards are focusable with a visible ring; nothing is hidden behind hover. The glare is a decorative overlay with pointer-events: none.',
    motion: 'Rotation follows the pointer and eases back on leave. With reduced motion the cards never rotate or lift at all, and the glare is not shown.',
    browser: 'transform-style: preserve-3d and perspective are supported in all current browsers. Safari needs the perspective on the parent, which is how it is set here.',
    implementation: 'Perspective lives on each slot (the parent) and the card rotates inside it. The pointer handler converts position to rotateX/rotateY via CSS variables set directly on the element, with no React state. The transition is shortened while hovering so tracking feels immediate, then lengthened for the return, which is what makes the settle feel smooth.',
  },
  component: () => import('./Component'),
});
