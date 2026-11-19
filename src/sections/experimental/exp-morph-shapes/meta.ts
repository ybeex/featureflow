import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

const shapes: [string, string][] = [['circle', 'Circle'], ['blob', 'Blob'], ['star', 'Star'], ['square', 'Square']];

export default defineSection({
  id: 'exp-morph-shapes',
  name: 'Scroll Shape Morph',
  description: 'One SVG path that reshapes between a circle, blob, star and square as you scroll. The outline is resampled in polar coordinates so any two shapes interpolate point-for-point.',
  tags: ['experimental', 'svg', 'morph', 'path', 'shapes', 'gradient'],
  useCases: ['agency', 'portfolio', 'product-site'],
  complexity: 'advanced',
  techniques: ['svg', 'scroll-var', 'css-sticky'],
  layouts: ['split'],
  styles: ['gradient', 'dark'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 640,
  defaults,
  controls: [
    range('scrollLength', 'Scroll length', 'layout', 0.4, 3, 0.1, '× frame'),
    range('points', 'Path points', 'layout', 24, 200, 4, '', 'More points give smoother curves and sharper star tips.'),
    toggle('filled', 'Filled', 'style'),
    range('strokeWidth', 'Stroke width', 'style', 1, 8, 0.5, 'px'),
    color('colorA', 'Gradient start'),
    color('colorB', 'Gradient end'),
    select('first', 'First shape', 'motion', shapes),
    select('second', 'Second shape', 'motion', shapes),
    select('third', 'Third shape', 'motion', shapes),
    range('rotation', 'Start rotation', 'motion', 0, 360, 5, '°'),
  ],
  notes: {
    responsive: 'The SVG scales with its column and keeps a 1:1 box. Below 640px the copy stacks above the shape and the shape is capped at about half the frame height.',
    accessibility: 'The SVG has role="img" and a label naming every shape in the sequence; the current shape is also written as visible text ("Now showing: Star") so the state is not conveyed by form alone. With reduced motion the section is unpinned and shows the first shape.',
    motion: 'Each segment between shapes is eased with smoothstep so shapes dwell briefly before changing. The outline also turns 40° across the full scroll. Reduced motion and pause hold the first shape.',
    browser: 'Plain SVG path data and an SVG linearGradient; works in every current browser. The path "d" attribute is written directly each frame (no CSS d() property, which is not universally supported).',
    implementation: 'Every shape is a function radius(angle). Both ends of a segment are sampled at the same N angles, so interpolation is just a per-index lerp of radii. The path is rebuilt from the interpolated radii inside the scroll callback and set on a ref, so scrolling causes no React re-renders.',
  },
  component: () => import('./Component'),
});
