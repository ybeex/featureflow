import { defineSection } from '../../../registry/define';
import { color, range } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'reveal-svg-draw',
  name: 'SVG Path Drawing Workflow',
  description: 'An inline SVG workflow whose connecting curves draw themselves with scroll, nodes popping in as the line reaches them, with captions beneath.',
  tags: ['reveal', 'svg', 'path', 'draw', 'workflow', 'process'],
  useCases: ['saas-landing', 'documentation', 'product-site'],
  complexity: 'moderate',
  techniques: ['svg', 'scroll-var', 'css-sticky'],
  layouts: ['timeline', 'centered'],
  styles: ['minimal', 'technical'],
  scrollDriven: true,
  posterProgress: 0.6,
  frameHeight: 640,
  featured: true,
  defaults,
  controls: [
    range('steps', 'Steps', 'layout', 3, 5, 1),
    range('curvature', 'Curve height', 'layout', 0, 110, 5, 'px', 'Vertical swing between neighbouring nodes. Zero gives a straight line.'),
    range('nodeSize', 'Node size', 'layout', 12, 34, 1, 'px'),
    color('background', 'Background'),
    color('textColor', 'Text'),
    color('accent', 'Accent'),
    range('strokeWidth', 'Stroke width', 'style', 1, 10, 0.5, 'px'),
    range('drawStart', 'Draw starts at', 'motion', 0, 0.6, 0.05, undefined, 'Scroll progress at which the first segment begins to draw.'),
    range('drawEnd', 'Draw finishes at', 'motion', 0.4, 1, 0.05, undefined, 'Scroll progress at which the last segment is complete.'),
    range('scrollLength', 'Scroll length', 'motion', 1.2, 5, 0.2, '× frame'),
  ],
  notes: {
    responsive: 'Below ~560px the captions collapse into a single-column list showing step titles only, while the SVG scales to the container width.',
    accessibility: 'The SVG is decorative (aria-hidden); the captions are a real ordered list that carries the same steps in order, so nothing depends on seeing the drawing.',
    motion: 'With reduced motion the stage is unpinned and the line is fully drawn. Without JavaScript the progress variable defaults to 1, which also renders the complete diagram.',
    browser: 'Uses pathLength="1" with stroke-dasharray/offset and CSS clamp()/calc() inside custom properties: supported in all current browsers.',
    implementation: 'useScrollVar writes pinned progress to --ff-p. Each segment computes its own 0–1 draw amount from (progress − start) / span × segments − index, which drives stroke-dashoffset. Nodes and captions reuse the same expression for opacity and scale.',
  },
  component: () => import('./Component'),
});
