import { defineSection } from '../../../registry/define';
import { color, range, select } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'exp-particles-canvas',
  name: 'Particle Word Assembly',
  description: 'A canvas particle field that gathers into a word as you scroll (or on a loop), springs back when scattered, and flees from the pointer. Targets are sampled from the rendered text itself.',
  tags: ['experimental', 'canvas', 'particles', 'text', 'physics', 'pointer'],
  useCases: ['agency', 'portfolio', 'product-site'],
  complexity: 'advanced',
  techniques: ['canvas', 'raf-loop', 'pointer-tracking', 'scroll-var'],
  layouts: ['full-bleed', 'centered'],
  styles: ['dark', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.9,
  frameHeight: 640,
  defaults,
  controls: [
    select('assemble', 'Assembles', 'layout', [['scroll', 'With scroll'], ['auto', 'On a loop']]),
    range('count', 'Particles', 'layout', 300, 3500, 100),
    range('size', 'Particle size', 'style', 1, 6, 0.2, 'px'),
    color('background', 'Background'),
    color('colorA', 'Colour A'),
    color('colorB', 'Colour B'),
    range('repelRadius', 'Pointer reach', 'motion', 20, 220, 5, 'px'),
    range('ease', 'Spring strength', 'motion', 0.02, 0.25, 0.01),
  ],
  notes: {
    responsive: 'The canvas fills the stage and, on resize, re-samples the word at the new size, so the formation stays centred and the type scales to fit 86% of the width. DPR is capped at 2.',
    accessibility: 'The canvas has role="img" with a description of the effect, and the word itself is present as a visually hidden h2, so the content is never only pixels. The pointer interaction is decorative. With reduced motion the particles are drawn once, already formed, with no animation.',
    motion: 'A single rAF loop runs only while the canvas is on screen (IntersectionObserver) and the preview is not paused. Reduced motion draws one static frame. Touch pointers do not repel particles so scrolling stays smooth.',
    browser: 'Canvas 2D, getImageData and ResizeObserver are universal; the particle colour uses CSS color-mix() in fillStyle, which needs Chrome 111+/Safari 16.2+/Firefox 113+. For older browsers precompute the blended colour.',
    implementation: 'The word is drawn to an off-screen canvas and every third pixel above half alpha becomes a candidate target; targets are shuffled and truncated to the particle count. Each particle is a damped spring toward a blend between its scatter origin and its target, with a repulsion impulse near the pointer. “Scroll” mode feeds pinned scroll progress into the blend; “loop” mode derives it from time.',
  },
  component: () => import('./Component'),
});
