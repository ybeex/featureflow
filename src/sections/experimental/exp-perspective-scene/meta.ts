import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'exp-perspective-scene',
  name: 'Fly-Through 3D Corridor',
  description: 'A pinned CSS 3D scene: panels sit at increasing depth along a corridor and scrolling flies the camera forward through them, with fog fading the distance.',
  tags: ['experimental', '3d', 'perspective', 'camera', 'fly-through', 'css-3d'],
  useCases: ['agency', 'portfolio', 'product-site'],
  complexity: 'advanced',
  techniques: ['scroll-var', 'css-sticky'],
  layouts: ['layered', 'full-bleed'],
  styles: ['dark', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.4,
  frameHeight: 660,
  defaults,
  controls: [
    range('panels', 'Panels', 'layout', 3, 6, 1),
    range('spacing', 'Depth spacing', 'layout', 200, 1000, 20, 'px'),
    range('scrollLength', 'Scroll length', 'layout', 0.8, 5, 0.1, '× frame'),
    range('sway', 'Side offset', 'style', 0, 30, 1, '%'),
    range('fog', 'Fog', 'style', 0, 1, 0.05),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('perspective', 'Perspective', 'motion', 300, 2000, 50, 'px', 'Lower values give a stronger sense of depth.'),
  ],
  notes: {
    responsive: 'Panel width follows the container and, on narrow containers, panels stay centred (no side sway) and get wider so the text remains readable as they pass. Perspective is applied to the stage so it scales with its size.',
    accessibility: 'Panels are real list items in order. With reduced motion the 3D scene is replaced by a plain grid of the same panels, so every piece of content stays reachable without depending on a long pinned scroll animation or on depth cues.',
    motion: 'Camera travel is a direct function of scroll position (translateZ on one parent), so it stops when the reader stops. Large 3D motion can be uncomfortable for some people, which is why reduced motion fully disables it.',
    browser: 'CSS 3D transforms (perspective, preserve-3d) and min()/max() in calc() are supported in all current browsers.',
    implementation: 'Instead of moving a camera, the whole rail translates toward the viewer by progress × (panels − 1) × spacing. Each panel’s fog opacity is derived in CSS from its signed distance to the camera plane, so there is no per-panel JS. Everything is transform and opacity, so it stays on the compositor.',
  },
  component: () => import('./Component'),
});
