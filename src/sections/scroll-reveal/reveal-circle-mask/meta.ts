import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-circle-mask',
  name: 'Moving Mask Reveal',
  description: 'A pinned stage where an image panel is revealed through a growing circle, wipe, curtain or diagonal while the headline swaps from problem to answer.',
  tags: ['reveal', 'mask', 'clip-path', 'circle', 'pinned', 'headline'],
  useCases: ['saas-landing', 'portfolio', 'agency'],
  complexity: 'moderate',
  techniques: ['clip-path', 'scroll-var', 'css-sticky'],
  layouts: ['full-bleed', 'centered'],
  styles: ['dark', 'editorial'],
  scrollDriven: true,
  posterProgress: 0.45,
  frameHeight: 640,
  featured: true,
  defaults,
  controls: [
    select('maskShape', 'Mask shape', 'layout', [['circle', 'Circle'], ['wipe', 'Horizontal wipe'], ['curtain', 'Vertical curtain'], ['diagonal', 'Diagonal']]),
    range('startSize', 'Start size', 'layout', 0, 40, 1, '%', 'Initial radius of the circle (circle shape only).'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('overlay', 'Overlay darkness', 'style', 0.2, 0.9, 0.05, undefined, 'Darkens the picture behind the revealed text. Keep it high enough for readable contrast.'),
    range('rangeStart', 'Reveal starts at', 'motion', 0, 0.5, 0.02),
    range('rangeEnd', 'Reveal finishes at', 'motion', 0.5, 1, 0.02),
    range('scrollLength', 'Scroll length', 'motion', 1.2, 5, 0.2, '× frame'),
  ],
  notes: {
    responsive: 'The headline scales with the container (cqw) and the stage always fills the frame; on small containers the type steps down to 1.9rem so two-line headlines still fit.',
    accessibility: 'Both statements are real text. The revealed panel sits over a dark scrim set by the overlay control (default gives well over 4.5:1 for white text). The decorative image is aria-hidden.',
    motion: 'With reduced motion the pinning, mask and cross-fade are removed: only the “after” panel is rendered, in full, as a normal block. With no JavaScript the progress variable defaults to fully revealed.',
    browser: 'clip-path with circle(), inset() and polygon() accepting calc() and custom properties works in all current browsers. The animation is paint-only.',
    implementation: 'useScrollVar writes pinned progress to --ff-p; CSS converts it to an eased-in 0–1 value (--e) over the chosen range and feeds it into the clip-path of the reveal layer. The shape select only changes which clip-path rule applies.',
  },
  component: () => import('./Component'),
});
