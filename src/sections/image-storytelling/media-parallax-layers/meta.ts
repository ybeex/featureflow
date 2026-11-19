import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'media-parallax-layers',
  name: 'Multi-Layer Parallax Scene',
  description: 'A layered landscape whose planes drift at different speeds as the section scrolls through the viewport, with mist at the base and a headline at its own depth.',
  tags: ['parallax', 'layers', 'depth', 'landscape', 'hero', 'image'],
  useCases: ['portfolio', 'agency', 'saas-landing'],
  complexity: 'moderate',
  techniques: ['scroll-var'],
  layouts: ['layered', 'full-bleed'],
  styles: ['dark', 'gradient'],
  scrollDriven: true,
  posterProgress: 0.5,
  frameHeight: 640,
  defaults,
  controls: [
    range('layers', 'Layers', 'layout', 2, 4, 1),
    range('height', 'Section height', 'layout', 0.8, 2.2, 0.1, '× frame'),
    range('skyHue', 'Sky hue', 'style', 0, 360, 5, '°'),
    range('mist', 'Mist', 'style', 0, 1, 0.05),
    color('background', 'Background'),
    color('textColor', 'Text'),
    range('intensity', 'Parallax intensity', 'motion', 0, 140, 5, '%'),
    range('textDepth', 'Headline depth', 'motion', 0, 1.5, 0.1),
  ],
  notes: {
    responsive: 'The scene is positioned absolutely and covers the container at any width; the headline scales with clamp() and is capped at 14 characters per line. Section height is a multiple of the frame so it stays proportionate.',
    accessibility: 'The scene is decorative and hidden from assistive technology; the headline is a real h2 on a darkened base with a text shadow. No information is carried by the imagery.',
    motion: 'Layers move only while the page scrolls, by transform alone. With reduced motion they are static, centred and un-transformed, and the intensity and depth controls have no effect.',
    browser: 'Transforms, CSS masks (with -webkit- prefix) and container-relative units are supported in current browsers.',
    implementation: 'useScrollVar writes pass-progress (0 when the section enters, 1 when it leaves) to --ff-p. Each layer’s translateY is (p − 0.5) × intensity × its own speed, with layers extending 22% beyond the frame so edges never show. The nearest layer moves fastest, which reads as depth without any 3D transforms.',
  },
  component: () => import('./Component'),
});
