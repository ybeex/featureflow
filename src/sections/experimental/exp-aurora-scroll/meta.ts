import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'exp-aurora-scroll',
  name: 'Scroll-Tinted Aurora',
  description: 'Four blurred colour fields drift and shift hue as you scroll through a pinned scene, and lean toward the pointer. It is built from CSS gradients alone, with no images and no canvas.',
  tags: ['experimental', 'aurora', 'gradient', 'hue', 'blur', 'pointer'],
  useCases: ['agency', 'portfolio', 'saas-landing'],
  complexity: 'moderate',
  techniques: ['scroll-var', 'css-sticky', 'pointer-tracking'],
  layouts: ['full-bleed', 'centered'],
  styles: ['gradient', 'dark'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 640,
  featured: true,
  defaults,
  controls: [
    range('scrollLength', 'Scroll length', 'layout', 0.4, 3, 0.1, '× frame'),
    range('hueStart', 'Starting hue', 'style', 0, 360, 5, '°'),
    range('blur', 'Blur', 'style', 20, 140, 2, 'px'),
    range('intensity', 'Intensity', 'style', 0.2, 1, 0.05),
    toggle('grain', 'Film grain', 'style'),
    color('textColor', 'Text'),
    range('hueTravel', 'Hue travel', 'motion', 0, 360, 5, '°', 'How many degrees the hues rotate over the full scroll.'),
    toggle('followPointer', 'Lean toward pointer', 'motion'),
  ],
  notes: {
    responsive: 'Blobs are sized in percentages of an oversized sky layer, so the composition scales to any container and always bleeds past the edges. The headline uses clamp() and a 15-character measure.',
    accessibility: 'The sky is decorative and aria-hidden; the headline is a real h2 with a text shadow over a dark base. Hues stay saturated but mid-lightness, so white text keeps contrast; if you change the starting hue or intensity, check the contrast of the text against the brightest blob.',
    motion: 'Hue and position are direct functions of scroll position. Pointer lean eases with a CSS transition (touch ignored). With reduced motion the sky rests at a fixed mid hue and the section is unpinned.',
    browser: 'hsl() with calc() and CSS variables, filter: blur, and mix-blend-mode are supported in all current browsers. Large blur radii are GPU-heavy on low-end devices: lower Blur if frames drop.',
    implementation: 'Everything derives from one --ff-p variable written by useScrollVar: each blob’s hue is hue0 + offset + p × travel and its transform is p × travel-distance, so there is no per-frame JS beyond that one write. Pointer position is two more variables written on pointermove.',
  },
  component: () => import('./Component'),
});
