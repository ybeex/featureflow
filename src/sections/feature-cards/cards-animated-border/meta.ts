import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'cards-animated-border',
  name: 'Animated Gradient Border Cards',
  description: 'Cards whose borders carry a travelling conic gradient arc, built with a registered CSS angle property and a masked pseudo-element, so no extra DOM or JavaScript runs.',
  tags: ['cards', 'border', 'conic-gradient', '@property', 'css-only', 'glow'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'moderate',
  techniques: ['css-animation'],
  layouts: ['grid'],
  styles: ['dark', 'gradient'],
  scrollDriven: false,
  frameHeight: 520,
  defaults,
  controls: [
    range('columns', 'Columns', 'layout', 1, 3, 1),
    range('radius', 'Corner radius', 'style', 0, 36, 1, 'px'),
    range('thickness', 'Border thickness', 'style', 1, 6, 1, 'px'),
    range('arc', 'Arc length', 'style', 30, 270, 10, '°'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('colorA', 'Gradient start'),
    color('colorB', 'Gradient end'),
    range('speed', 'Rotation time', 'motion', 1.5, 16, 0.5, 's'),
    toggle('onHoverOnly', 'Only spin on hover / focus', 'motion'),
  ],
  notes: {
    responsive: 'Three columns stack to one centred column below ~640px. The border scales with the card because it is a masked pseudo-element sized to the card, not an image.',
    accessibility: 'The animation is on a decorative pseudo-element and never changes text contrast. Cards are focusable, and the “only on hover / focus” mode starts the spin for keyboard users too. A 3px focus ring is always drawn.',
    motion: 'With reduced motion, or when the preview is paused, no animation runs and the gradient arc rests at its starting angle as a static accent. Speed and arc length are configurable.',
    browser: '@property and mask-composite are supported in current Chrome, Edge, Safari and Firefox. Where the mask is unsupported the animated border is hidden and the neutral hairline border remains.',
    implementation: 'A registered <angle> custom property is animated 0→360deg and read by a conic-gradient; the gradient is clipped to the border box with a two-layer mask (content-box excluded from the full box), which leaves only the ring visible. Because it animates a paint-only property on one pseudo-element per card, it needs no JavaScript.',
  },
  component: () => import('./Component'),
});
