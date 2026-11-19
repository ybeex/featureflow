import { defineSection } from '../../../registry/define';
import { color, range, select, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'media-before-after',
  name: 'Before / After Slider',
  description: 'A draggable comparison of a cluttered workspace and its cleaned-up version, with a fully keyboard-operable slider handle.',
  tags: ['before-after', 'slider', 'comparison', 'drag', 'clip-path', 'image'],
  useCases: ['saas-landing', 'product-site', 'portfolio'],
  complexity: 'moderate',
  techniques: ['clip-path', 'pointer-tracking', 'intersection-observer'],
  layouts: ['centered', 'layered'],
  styles: ['minimal', 'editorial'],
  scrollDriven: false,
  frameHeight: 720,
  featured: true,
  defaults,
  controls: [
    range('startPosition', 'Start position', 'layout', 5, 95, 1, '%', 'Where the divider rests before anyone touches it.'),
    select('aspectRatio', 'Aspect ratio', 'layout', [['16 / 10', '16:10'], ['3 / 2', '3:2'], ['21 / 9', 'Cinematic 21:9']]),
    range('radius', 'Corner radius', 'layout', 0, 40, 1, 'px'),
    toggle('showLabels', 'Before / After labels', 'layout'),
    select('handleStyle', 'Handle style', 'style', [['circle', 'Circle'], ['pill', 'Pill'], ['bar', 'Bar']]),
    range('dividerWidth', 'Divider thickness', 'style', 1, 8, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    toggle('introSweep', 'Intro sweep', 'motion', 'Nudge the divider once when the slider first scrolls into view, to hint that it moves.'),
    range('smoothing', 'Key / click easing', 'motion', 0, 400, 10, 'ms', 'Glide time for keyboard steps. Dragging always tracks the pointer exactly.'),
  ],
  notes: {
    responsive: 'The stage keeps its chosen aspect ratio at every width, so nothing shifts while it loads. On phones the handle and labels shrink slightly, and the 44px handle hit area remains reachable with a thumb.',
    accessibility: 'The handle is a focusable role="slider" with aria-valuenow/min/max and a readable aria-valuetext. Arrows move 2%, PageUp/PageDown 10%, Home/End jump to the extremes. Both halves have text labels, so the comparison never relies on colour alone.',
    motion: 'Reduced motion removes the intro sweep and all glide transitions; the divider still follows the pointer and keys instantly. Without JavaScript the slider renders at its start position showing both halves.',
    browser: 'Needs clip-path: inset(), pointer events and setPointerCapture, supported in all current browsers. touch-action: pan-y lets vertical swipes still scroll the page while horizontal drags move the divider.',
    implementation: 'Both versions are stacked at the same size; the "before" layer is revealed with clip-path: inset(0 X% 0 0) driven by a single --pos custom property. Pointer capture on the stage keeps the drag alive outside its bounds, and the stage rect is read once per drag, not per move.',
  },
  component: () => import('./Component'),
});
