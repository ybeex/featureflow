import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-blur-sweep',
  name: 'Gradient Sweep & Blur Sequence',
  description: 'A heading with a one-time gradient sweep, a paragraph revealed line by line, and three feature rows that sharpen from blur one after another.',
  tags: ['reveal', 'blur', 'gradient', 'sequence', 'text', 'lines'],
  useCases: ['saas-landing', 'product-site', 'agency'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'css-animation', 'css-transition'],
  layouts: ['centered'],
  styles: ['minimal', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.15,
  frameHeight: 640,
  defaults,
  controls: [
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Sweep & icon colour'),
    range('blur', 'Blur amount', 'style', 0, 30, 1, 'px'),
    range('duration', 'Duration', 'motion', 200, 1800, 50, 'ms'),
    range('sequenceGap', 'Sequence gap', 'motion', 0, 600, 20, 'ms', 'Pause between one item finishing and the next starting.'),
    range('sweepAngle', 'Sweep angle', 'motion', 0, 180, 5, '°'),
    range('threshold', 'Trigger threshold', 'motion', 0.1, 0.9, 0.05),
    select('replay', 'Replay behaviour', 'motion', [['once', 'Reveal once'], ['replay', 'Replay on re-entry']]),
  ],
  notes: {
    responsive: 'Type is sized with container units, so the heading, lead and rows scale with the frame width. Lines are explicit blocks, so wrapping stays predictable on narrow containers.',
    accessibility: 'All text is real, in reading order. The gradient text keeps a solid foreground colour as its resting state, so contrast is that of the text colour. Blur and fade never remove content from the accessibility tree.',
    motion: 'The transparent gradient-text and blurred start states are applied only after mount and only when motion is allowed, so reduced-motion and no-JS visitors see plain, fully readable content.',
    browser: 'background-clip: text and filter: blur() are supported in all current browsers (the -webkit- prefixes are included). Animation uses opacity, transform, filter and background-position only.',
    implementation: 'A single useInView on the wrapper sets data-visible. A keyframe animates the heading’s background-position once; lines and rows transition with delays computed from duration and sequence gap, so each row waits for the one before it.',
  },
  component: () => import('./Component'),
});
