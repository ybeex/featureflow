import { defineSection } from '../../../registry/define';
import { color, range, toggle } from '../../../registry/controls';
import { defaults } from './config';

export default defineSection({
  id: 'media-image-sequence',
  name: 'Scroll-Scrubbed Frame Sequence',
  description: 'A pinned canvas that plays an exploded-view animation one whole frame at a time as you scroll, exactly like a scrubbed image sequence, but drawn procedurally so there are no frames to download.',
  tags: ['canvas', 'image-sequence', 'scrub', 'exploded-view', 'pinned', 'product'],
  useCases: ['product-site', 'saas-landing', 'agency'],
  complexity: 'advanced',
  techniques: ['canvas', 'scroll-var', 'css-sticky'],
  layouts: ['centered', 'full-bleed'],
  styles: ['dark', 'technical'],
  scrollDriven: true,
  posterProgress: 0.7,
  frameHeight: 680,
  defaults,
  controls: [
    range('parts', 'Layers', 'layout', 3, 6, 1),
    range('scrollLength', 'Scroll length', 'layout', 0.6, 3.2, 0.1, '× frame'),
    toggle('showCounter', 'Frame counter', 'layout'),
    color('background', 'Background'),
    color('textColor', 'Text and labels'),
    color('accent', 'Accent'),
    range('frames', 'Frame count', 'motion', 8, 120, 2, 'frames', 'Progress snaps to this many discrete frames, like a real image sequence. Lower values look steppier.'),
    range('spread', 'Explode distance', 'motion', 20, 140, 2, '%'),
    toggle('rotate', 'Rotate while separating', 'motion'),
  ],
  notes: {
    responsive: 'The canvas fills the pinned stage and re-renders from a ResizeObserver at the container’s size and device pixel ratio (capped at 2), so it stays sharp on high-density screens without allocating huge buffers. Label size scales with width.',
    accessibility: 'The canvas has role="img" and a text label naming every layer, and the same layers are listed as a visually hidden ordered list. The frame counter is decorative. With reduced motion the finished exploded view is shown unpinned.',
    motion: 'Drawing happens only when scroll progress changes, never on a timer, so the canvas is idle when the user is. Progress is quantised to whole frames; reduced motion renders the last frame once.',
    browser: 'Canvas 2D and CanvasRenderingContext2D.roundRect (Chrome 99+, Safari 16+, Firefox 112+). Older browsers would need a path fallback for rounded corners.',
    implementation: 'drawFrame(t) is a pure function of progress, so any frame is reproducible and scrubbing backwards is exact. To use real image frames, replace its body with ctx.drawImage(frames[index], …) and keep the same quantise-and-draw loop. React state only tracks the displayed frame number, not the pixels.',
  },
  component: () => import('./Component'),
});
