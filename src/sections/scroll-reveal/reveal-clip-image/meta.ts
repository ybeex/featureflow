import { defineSection } from '../../../registry/define';
import { color, easingControl, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-clip-image',
  name: 'Clip-Path Image Unveil',
  description: 'Images wipe into view with clip-path from the left, right or centre while the picture inside counter-scales, then the caption follows.',
  tags: ['reveal', 'clip-path', 'image', 'wipe', 'mask', 'editorial'],
  useCases: ['portfolio', 'agency', 'product-site'],
  complexity: 'simple',
  techniques: ['intersection-observer', 'clip-path', 'css-transition'],
  layouts: ['split'],
  styles: ['editorial', 'minimal'],
  scrollDriven: true,
  posterProgress: 0.1,
  frameHeight: 720,
  defaults,
  controls: [
    select('direction', 'Direction', 'motion', [['alternate', 'Alternate left / right / centre'], ['left', 'Left to right'], ['right', 'Right to left'], ['center', 'From centre']]),
    range('imageRatio', 'Image ratio', 'layout', 0.8, 2.2, 0.05),
    range('radius', 'Corner radius', 'layout', 0, 32, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('duration', 'Duration', 'motion', 300, 2200, 50, 'ms'),
    easingControl(),
    range('threshold', 'Trigger threshold', 'motion', 0.1, 0.9, 0.05, undefined, 'How much of a row must be visible before it unveils.'),
    select('replay', 'Replay behaviour', 'motion', [['once', 'Reveal once'], ['replay', 'Replay on re-entry']]),
  ],
  notes: {
    responsive: 'Rows are two columns (alternating sides) on wide containers and a single column below ~640px, with the image always above its caption.',
    accessibility: 'Real figures with text alternatives sit in DOM order; only a clip-path and a transform change, so content is never removed from the accessibility tree. Captions use a proper h2/h3 hierarchy.',
    motion: 'The clipped start state is applied only after mount and only when motion is allowed. With reduced motion or no JavaScript every image and caption is simply visible.',
    browser: 'clip-path: inset() transitions work in all current browsers; IntersectionObserver is universal and the hook falls back to “visible”.',
    implementation: 'useInView observes each row. Setting data-visible transitions clip-path from a direction-specific inset (left, right or centre) to inset(0), while the inner image eases from scale(1.3) to 1 and the caption fades up after a short delay.',
  },
  component: () => import('./Component'),
});
