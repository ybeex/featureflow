import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'split-diagonal',
  name: 'Diagonal Scroll Split',
  description: 'A before/after split divided by a slanted seam. The seam slides across the pinned frame as you scroll, revealing more of each side.',
  tags: ['split', 'diagonal', 'clip-path', 'before-after', 'seam', 'scroll'],
  useCases: ['saas-landing', 'agency', 'product-site'],
  complexity: 'moderate',
  techniques: ['clip-path', 'scroll-var'],
  layouts: ['split', 'full-bleed', 'layered'],
  styles: ['editorial', 'dark'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 640,
  defaults,
  controls: [
    range('angle', 'Seam angle', 'layout', 0, 30, 1, '°'),
    toggle('reverse', 'Reverse travel direction', 'layout'),
    range('seam', 'Seam thickness', 'style', 0, 12, 1, 'px'),
    toggle('seamGlow', 'Seam glow', 'style'),
    color('leftColor', 'Left panel'),
    color('rightColor', 'Right panel'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('travel', 'Seam travel', 'motion', 0, 24, 1, '%', 'How far the seam moves across the frame while the section scrolls through view.'),
  ],
  notes: {
    responsive: 'Below ~620px the vertical split becomes a horizontal one: the seam runs across the frame, the top panel clips from above and the two messages stack in reading order.',
    accessibility: 'Both halves are ordinary text in DOM order (before, then after); the seam and artwork are decorative and hidden from assistive tech. Text sits on solid colours so contrast does not depend on the moving edge.',
    motion: 'The seam position is driven directly by scroll position, so it stops when the user stops. With reduced motion it rests at the centre. No animation runs on its own.',
    browser: 'clip-path: polygon() with calc() and the CSS tan() function are supported in current Chrome, Safari and Firefox. Browsers without tan() fall back to a vertical seam (the slant term resolves to zero).',
    implementation: 'A tall track pins the stage while useScrollVar writes progress to --ff-p. CSS computes a shift of (p − 0.5) × travel in cqw, and the left panel’s polygon puts its top and bottom vertices at 50% ± shift ± tan(angle) × half-height. The seam is a skewed bar positioned with the same variables so the two always agree.',
  },
  component: () => import('./Component'),
});
