import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'media-scale-scroll',
  name: 'Scale-to-Fullscreen Media',
  description: 'A framed image that grows from a rounded card to full-bleed as you scroll, while the headline fades away and a caption rises in over the finished image.',
  tags: ['image', 'scale', 'full-bleed', 'pinned', 'hero', 'storytelling'],
  useCases: ['portfolio', 'agency', 'saas-landing'],
  complexity: 'moderate',
  techniques: ['css-sticky', 'scroll-var'],
  layouts: ['full-bleed', 'centered'],
  styles: ['dark', 'editorial'],
  scrollDriven: true,
  posterProgress: 0.6,
  frameHeight: 640,
  featured: true,
  defaults,
  controls: [
    range('startScale', 'Starting size', 'layout', 25, 90, 1, '%'),
    range('scrollLength', 'Scroll length', 'layout', 0.5, 3, 0.1, '× frame'),
    range('startRadius', 'Starting corner radius', 'style', 0, 80, 1, 'px'),
    range('overlay', 'Caption shade', 'style', 0, 0.9, 0.05),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('captionAt', 'Caption appears at', 'motion', 0.2, 0.9, 0.05, '', 'Scroll progress (0–1) at which the caption starts to fade in.'),
  ],
  notes: {
    responsive: 'The stage fills the container, so the end state is always full-bleed regardless of width. The caption is capped to 84% of the width and the headline scales with clamp().',
    accessibility: 'The headline is real text (an h2) and the image has a text alternative. Text over the image sits on a bottom gradient so contrast holds at the end; the headline fades out before it could overlap the image. With reduced motion the finished full-bleed image is shown with the headline on top.',
    motion: 'Scale, radius, headline, shade and caption are all direct functions of scroll position, so nothing continues after the user stops. Reduced motion renders the end state with no pinning.',
    browser: 'CSS clamp() inside calc() for opacity and the sticky/transform pipeline are supported in current browsers.',
    implementation: 'One scroll variable drives everything in CSS: scale = start + (1 − start) × p, radius = start × (1 − p), opacity = clamp(0, (p − threshold) × 4, 1). The art inside counter-scales slightly for a subtle zoom. Only transform and opacity change, so the page stays on the compositor.',
  },
  component: () => import('./Component'),
});
